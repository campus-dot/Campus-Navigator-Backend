
import mongoose from 'mongoose';
import Event from '../models/event.model.js';

export const createEvent = async (req, res) => {
  try {
    const { location, organizer } = req.body;

    // Validate location and organizer ObjectIds
    if (!mongoose.Types.ObjectId.isValid(location)) {
      return res.status(400).json({ message: "Invalid location ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(organizer)) {
      return res.status(400).json({ message: "Invalid organizer ID." });
    }

    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLiveEvents = async (req, res) => {
  try {
    const currentTime = new Date();
    const events = await Event.find({
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
      isActive: true
    }).populate('location')  // This populates the 'location' reference
      .populate('organizer');  // If you want to also populate the 'organizer' reference, you can add this

    if (events.length === 0) {
      return res.status(404).json({ message: "No live events found." });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
