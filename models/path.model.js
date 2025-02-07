import mongoose from 'mongoose';

const pathSchema = new mongoose.Schema({
    startPoint: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    endPoint: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    distance: {
        type: Number,
        required: true
    },
    pathType: {
        type: String,
        enum: ['indoor', 'outdoor', 'mixed'],
        required: true
    },
    isAccessible: {
        type: Boolean,
        default: true
    },
    waypoints: [{
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    }]
}, {
    timestamps: true
});

const Path = mongoose.model('Path', pathSchema);
export default Path;