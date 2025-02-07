import Path from '../models/path.model.js';

export const findPath = async (req, res) => {
    try {
        const { startLat, startLng, endLat, endLng, accessibility } = req.query;

        const paths = await Path.find({
            startPoint: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(startLng), parseFloat(startLat)]
                    }
                }
            },
            endPoint: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(endLng), parseFloat(endLat)]
                    }
                }
            },
            ...(accessibility && { isAccessible: true })
        }).limit(1);

        res.json(paths[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPath = async (req, res) => {
    try {
        const path = new Path(req.body);
        await path.save();
        res.status(201).json(path);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};