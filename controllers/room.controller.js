import Building from "../models/building.model.js";
import Floor from "../models/floor.models.js";
import Room from "../models/room.model.js";

export const roomController = {

    create: async (req, res) => {
        const session = await Room.startSession();
        session.startTransaction();

        try {
            const { buildingId, floorId, roomNumber } = req.body;

        
            const building = await Building.findById(buildingId).session(session);
            if (!building) {
                throw new Error('Building not found');
            }

        
            const floor = await Floor.findOne({ _id: floorId, buildingId }).session(session);
            if (!floor) {
                throw new Error('Floor not found or does not belong to this building');
            }

        
            const existingRoom = await Room.findOne({ floorId, roomNumber }).session(session);
            if (existingRoom) {
                throw new Error('Room number already exists on this floor');
            }

        
            const room = new Room(req.body);
            await room.save({ session });

        
            await Floor.findByIdAndUpdate(
                floorId,
                { $push: { rooms: room._id } },
                { session }
            );

            await session.commitTransaction();

        
            const populatedRoom = await Room.findById(room._id)
                .populate('buildingId', 'name code')
                .populate('floorId', 'floorNumber');

            res.status(201).json({
                status: 'success',
                data: populatedRoom
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        } finally {
            session.endSession();
        }
    },


    getAllInFloor: async (req, res) => {
        try {
            const { floorId } = req.params;
            const { type, status, isAccessible } = req.query;
            const filter = { floorId };

            if (type) filter.roomType = type;
            if (status) filter.status = status;
            if (isAccessible !== undefined) filter.isAccessible = isAccessible === 'true';

            const rooms = await Room.find(filter)
                .select('-__v')
                .sort('roomNumber');

            res.status(200).json({
                status: 'success',
                count: rooms.length,
                data: rooms
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },


    getById: async (req, res) => {
        try {
            const room = await Room.findById(req.params.id)
                .select('-__v')
                .populate('buildingId', 'name code')
                .populate('floorId', 'floorNumber');

            if (!room) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Room not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: room
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },


    update: async (req, res) => {
        try {
            const { id } = req.params;

        
            if (req.body.roomNumber) {
                const existingRoom = await Room.findOne({
                    roomNumber: req.body.roomNumber,
                    floorId: req.body.floorId || (await Room.findById(id)).floorId,
                    _id: { $ne: id }
                });
                if (existingRoom) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Room number already exists on this floor'
                    });
                }
            }

            const room = await Room.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!room) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Room not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: room
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const room = await Room.findByIdAndDelete(req.params.id);

            if (!room) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Room not found'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Room deleted successfully',
                data: room
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },


    search: async (req, res) => {
        try {
            const {
                buildingId,
                floorId,
                roomType,
                minCapacity,
                maxCapacity,
                isAccessible,
                status
            } = req.query;

            const filter = {};

            if (buildingId) filter.buildingId = buildingId;
            if (floorId) filter.floorId = floorId;
            if (roomType) filter.roomType = roomType;
            if (isAccessible !== undefined) filter.isAccessible = isAccessible === 'true';
            if (status) filter.status = status;

        
            if (minCapacity || maxCapacity) {
                filter.capacity = {};
                if (minCapacity) filter.capacity.$gte = parseInt(minCapacity);
                if (maxCapacity) filter.capacity.$lte = parseInt(maxCapacity);
            }

            const rooms = await Room.find(filter)
                .populate('buildingId', 'name code')
                .populate('floorId', 'floorNumber')
                .sort('roomNumber');

            res.status(200).json({
                status: 'success',
                count: rooms.length,
                data: rooms
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },


    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['available', 'occupied', 'maintenance', 'reserved'].includes(status)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid status value'
                });
            }

            const room = await Room.findByIdAndUpdate(
                id,
                { status },
                { new: true, runValidators: true }
            );

            if (!room) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Room not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: room
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },


    updateFacilities: async (req, res) => {
        try {
            const { id } = req.params;
            const { facilities } = req.body;

            if (!Array.isArray(facilities)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Facilities must be an array'
                });
            }

            const room = await Room.findByIdAndUpdate(
                id,
                { facilities },
                { new: true, runValidators: true }
            );

            if (!room) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Room not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: room
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },


    getByDepartment: async (req, res) => {
        try {
            const { departmentAssigned } = req.params;

            const rooms = await Room.find({ departmentAssigned })
                .populate('buildingId', 'name code')
                .populate('floorId', 'floorNumber')
                .sort('roomNumber');

            res.status(200).json({
                status: 'success',
                count: rooms.length,
                data: rooms
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};