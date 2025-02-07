import mongoose from 'mongoose';

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

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['building', 'parking', 'cafe', 'library', 'lab', 'classroom', 'other'],
        required: true
    },
    location: {
        type: pointSchema,
        required: true,
        index: '2dsphere'
    },
    elevation: {
        type: Number,
        default: 0
    },
    floor: {
        type: Number,
        default: 0
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    metadata: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

const Location = mongoose.model('Location', locationSchema);
export default Location;