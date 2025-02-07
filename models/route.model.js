import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const routeSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ['walking', 'wheelchair', 'bicycle', 'shuttle'],
        default: 'walking'
    },
    path: {
        type: {
            type: String,
            enum: ['LineString'],
            required: true
        },
        coordinates: {
            type: [[Number]],
            required: true
        }
    },
    distance: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    elevationGain: Number,
    accessibility: {
        isWheelchairAccessible: Boolean,
        hasStairs: Boolean,
        hasElevator: Boolean
    },
    waypoints: [{
        type: pointSchema,
        name: String,
        type: String
    }]
}, {
    timestamps: true
});

const Route = mongoose.model('Route', routeSchema);
export default Route;