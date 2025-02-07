import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema({
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    floorNumber: {
        type: Number,
        required: true
    },
    floorPlan: {
        mapImageUrl: String,
        svgData: String,
        scale: Number
    },
    emergencyFeatures: {
        exits: [{
            location: {
                x: Number,
                y: Number
            },
            description: String
        }],
        fireExtinguishers: [{
            location: {
                x: Number,
                y: Number
            }
        }],
        firstAidKits: [{
            location: {
                x: Number,
                y: Number
            }
        }]
    },
    facilities: [{
        name: String,
        type: {
            type: String,
            enum: ['restroom', 'elevator', 'stairs', 'vending', 'other']
        },
        location: {
            x: Number,
            y: Number
        },
        isAccessible: Boolean
    }],
    isAccessible: {
        type: Boolean,
        default: true
    },
    restrictedAccess: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

floorSchema.index({ buildingId: 1, floorNumber: 1 }, { unique: true });


const Floor = mongoose.model('Floor', floorSchema);
export default Floor;

