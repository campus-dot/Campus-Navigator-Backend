import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor',
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true,
        enum: ['classroom', 'laboratory', 'office', 'conference', 'lecture_hall',
            'study_room', 'storage', 'utility', 'other']
    },
    capacity: {
        type: Number,
        required: true
    },
    facilities: [{
        type: {
            type: String,
            enum: ['projector', 'whiteboard', 'computer', 'printer', 'ac', 'other']
        },
        count: Number,
        details: String
    }],
    isAccessible: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance', 'reserved'],
        default: 'available'
    },
    departmentAssigned: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});


roomSchema.index({ buildingId: 1, floorId: 1, roomNumber: 1 }, { unique: true });


export default mongoose.model('Room', roomSchema);