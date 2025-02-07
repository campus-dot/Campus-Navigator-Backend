import Floor from '../models/floor.models.js';
import Building from '../models/building.model.js';


export const floorController = {
    
    create: async (req, res) => {
        const session = await Floor.startSession();
        try {
            session.startTransaction();

            const { buildingId, floorNumber } = req.body;

            
            const building = await Building.findById(buildingId).session(session);
            if (!building) {
                throw new Error('Building not found');
            }

            
            const existingFloor = await Floor.findOne({ buildingId, floorNumber }).session(session);
            if (existingFloor) {
                throw new Error('Floor number already exists in this building');
            }

            
            const floor = new Floor(req.body);
            await floor.save({ session });

            
            if (floorNumber > building.totalFloors) {
                building.totalFloors = floorNumber;
                await building.save({ session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 'success',
                data: floor
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

    
    getAllInBuilding: async (req, res) => {
        try {
            const { buildingId } = req.params;
            const floors = await Floor.find({ buildingId })
                .select('-__v')
                .sort('floorNumber');

            res.status(200).json({
                status: 'success',
                count: floors.length,
                data: floors
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
            const floor = await Floor.findById(req.params.id).select('-__v');
            if (!floor) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Floor not found'
                });
            }

            const rooms = await Room.find({ floorId: floor._id })
                .select('-__v')
                .sort('roomNumber');

            res.status(200).json({
                status: 'success',
                data: {
                    floor,
                    rooms
                }
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

            const floor = await Floor.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!floor) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Floor not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: floor
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    
    delete: async (req, res) => {
        const session = await Floor.startSession();
        try {
            session.startTransaction();

            const { id } = req.params;

            
            const floor = await Floor.findById(id).session(session);
            if (!floor) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Floor not found'
                });
            }

            
            await Room.deleteMany({ floorId: id }).session(session);

            
            await Floor.findByIdAndDelete(id).session(session);

            await session.commitTransaction();

            res.status(200).json({
                status: 'success',
                message: 'Floor and associated rooms deleted successfully'
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
    }

};