import Building from '../models/building.model.js';
import Floor from '../models/floor.models.js';
import roomModel from '../models/room.model.js';

export const buildingController = {
    
    create: async (req, res) => {
        try {
            const { name, code, location, totalFloors, category } = req.body;

            
            if (!name || !code || !location || !totalFloors || !category) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields'
                });
            }

            
            const existingBuilding = await Building.findOne({ code });
            if (existingBuilding) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Building code must be unique'
                });
            }

            const building = new Building(req.body);
            await building.save();

            res.status(201).json({
                status: 'success',
                data: building
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    
    getAll: async (req, res) => {
        try {
            const { category, isAccessible, status } = req.query;
            const filter = {};

            if (category) filter.category = category;
            if (isAccessible !== undefined) filter.isAccessible = isAccessible === 'true';
            if (status) filter.status = status;

            const buildings = await Building.find(filter)
                .select('-__v')
                .sort('name');

            res.status(200).json({
                status: 'success',
                count: buildings.length,
                data: buildings
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
            const building = await Building.findById(req.params.id);
            if (!building) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Building not found'
                });
            }

            
            const floors = await Floor.find({ buildingId: building._id })
                .select('-__v')
                .sort('floorNumber');

            
            const rooms = await Room.find({ buildingId: building._id })
                .select('-__v')
                .sort('roomNumber');

            res.status(200).json({
                status: 'success',
                data: {
                    building,
                    floors,
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

            
            if (req.body.code) {
                const existingBuilding = await Building.findOne({
                    code: req.body.code,
                    _id: { $ne: id }
                });
                if (existingBuilding) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Building code must be unique'
                    });
                }
            }

            const building = await Building.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!building) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Building not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: building
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    
    delete: async (req, res) => {
        const session = await Building.startSession();
        try {
            session.startTransaction();

            const { id } = req.params;

            const building = await Building.findById(id).session(session);
            if (!building) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Building not found'
                });
            }

            await Floor.deleteMany({ buildingId: id }).session(session);
            await roomModel.deleteMany({ buildingId: id }).session(session);

            await Building.findByIdAndDelete(id).session(session);

            await session.commitTransaction();

            res.status(200).json({
                status: 'success',
                message: 'Building and associated data deleted successfully'
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

    
    searchByLocation: async (req, res) => {
        try {
            const { longitude, latitude, maxDistance = 1000 } = req.query; 

            if (!longitude || !latitude) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Longitude and latitude are required'
                });
            }

            const buildings = await Building.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        $maxDistance: parseInt(maxDistance)
                    }
                }
            });

            res.status(200).json({
                status: 'success',
                count: buildings.length,
                data: buildings
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};