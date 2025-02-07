import Building from '../models/building.model.js';
import Location from '../models/location.model.js';
import Route from '../models/route.model.js';


const calculateDistance = (point1, point2) => {
    const R = 6371e3; 
    const φ1 = point1.coordinates[1] * Math.PI / 180;
    const φ2 = point2.coordinates[1] * Math.PI / 180;
    const Δφ = (point2.coordinates[1] - point1.coordinates[1]) * Math.PI / 180;
    const Δλ = (point2.coordinates[0] - point1.coordinates[0]) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const searchNearby = async (req, res) => {
    try {
        const { lat, lng, radius = 500, accessibility } = req.query;

        
        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        };

        
        if (accessibility === 'true') {
            query.isAccessible = true;
        }

        
        const buildings = await Building.find(query);

        console.log('Query:', JSON.stringify(query, null, 2));
        console.log('Found buildings:', buildings.length);

        res.json(buildings);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const findRoute = async (req, res) => {
    try {
        const {
            startLat,
            startLng,
            endLat,
            endLng,
            mode = 'walking',
            accessibility = false
        } = req.query;

        const startPoint = {
            type: 'Point',
            coordinates: [parseFloat(startLng), parseFloat(startLat)]
        };

        const endPoint = {
            type: 'Point',
            coordinates: [parseFloat(endLng), parseFloat(endLat)]
        };

        
        let route = await Route.findOne({
            'path.coordinates': {
                $all: [
                    startPoint.coordinates,
                    endPoint.coordinates
                ]
            },
            type: mode,
            ...(accessibility && { 'accessibility.isWheelchairAccessible': true })
        });

        if (!route) {
            
            const distance = calculateDistance(startPoint, endPoint);
            const averageSpeed = {
                walking: 1.4, 
                wheelchair: 1.2,
                bicycle: 4.17,
                shuttle: 8.33
            };

            route = new Route({
                type: mode,
                path: {
                    type: 'LineString',
                    coordinates: [startPoint.coordinates, endPoint.coordinates]
                },
                distance,
                duration: distance / averageSpeed[mode],
                accessibility: {
                    isWheelchairAccessible: accessibility
                }
            });

            await route.save();
        }

        res.json(route);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDirections = async (req, res) => {
    try {
        const {
            origin,
            destination,
            waypoints,
            mode = 'walking',
            alternatives = false
        } = req.body;


        const routes = await Route.find({
            type: mode,
            'path.coordinates': {
                $all: [
                    origin.coordinates,
                    destination.coordinates
                ]
            }
        });

        const calculateElevationProfile = (route) => {
            
            const elevationProfile = route.path.coordinates.map(coord => {
                
                const randomElevation = Math.random() * 1000; 
                return { coordinates: coord, elevation: randomElevation };
            });

            return elevationProfile;
        };



        const directions = routes.map(route => ({
            route_id: route._id,
            distance: route.distance,
            duration: route.duration,
            steps: generateSteps(route.path.coordinates),
            elevation_profile: calculateElevationProfile(route)
        }));

        res.json({
            routes: alternatives ? directions : [directions[0]]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const generateSteps = (coordinates) => {
    const steps = [];
    for (let i = 1; i < coordinates.length; i++) {
        const bearing = calculateBearing(coordinates[i - 1], coordinates[i]);
        const distance = calculateDistance(
            { coordinates: coordinates[i - 1] },
            { coordinates: coordinates[i] }
        );

        steps.push({
            instruction: generateInstruction(bearing, distance),
            distance,
            bearing
        });
    }
    return steps;
};

const calculateBearing = (start, end) => {
    const startLat = start[1] * Math.PI / 180;
    const startLng = start[0] * Math.PI / 180;
    const endLat = end[1] * Math.PI / 180;
    const endLng = end[0] * Math.PI / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;
    return bearing;
};

const generateInstruction = (bearing, distance) => {
    const direction = getBearingDirection(bearing);
    const formattedDistance = formatDistance(distance);
    return `Head ${direction} for ${formattedDistance}`;
};

const getBearingDirection = (bearing) => {
    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    return directions[Math.round(bearing / 45) % 8];
};

const formatDistance = (distance) => {
    if (distance < 1000) {
        return `${Math.round(distance)} meters`;
    }
    return `${(distance / 1000).toFixed(1)} kilometers`;
};

