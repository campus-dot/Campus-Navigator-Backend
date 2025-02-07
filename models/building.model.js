import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    description: {
        type: String,
        trim: true
    },
    totalFloors: {
        type: Number,
        required: true,
        min: 1
    },
    departments: [{
        name: String,
        code: String
    }],
    facilities: [{
        type: String,
        trim: true
    }],
    emergencyExits: {
        count: Number,
        locations: [String]
    },
    operatingHours: {
        weekday: {
            open: String,
            close: String
        },
        weekend: {
            open: String,
            close: String
        }
    },
    category: {
        type: String,
        enum: ['academic', 'administrative', 'residential', 'recreational', 'other'],
        required: true
    },
    imageUrl: String,
    galleryImages: [String],
    isAccessible: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'closed'],
        default: 'active'
    }
}, {
    timestamps: true
});

buildingSchema.index({ location: '2dsphere' });
buildingSchema.index({ code: 1 }, { unique: true });


const Building = mongoose.model('Building', buildingSchema);
export default Building;