const Event = require("../models/Event");
const User = require("../models/User");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, participants, status } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      participants: participants || [],
      status,
      createdBy: req.user.id,
    });
    await event.save();
    res.status(201).json({
      ...event._doc,
      participantCount: event.participants.length,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    const eventsWithCount = events.map((event) => ({
      ...event._doc,
      participantCount: event.participants.length,
    }));
    res.json(eventsWithCount);
  } catch (error) {
    console.error("Get My Events Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const eventsWithCount = events.map((event) => ({
      ...event._doc,
      participantCount: event.participants.length,
    }));
    res.json(eventsWithCount);
  } catch (error) {
    console.error("Get All Events Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });
    res.json({
      ...event._doc,
      participantCount: event.participants.length,
    });
  } catch (error) {
    console.error("Get Event By Id Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, participants, status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });

    event.title = title !== undefined ? title : event.title;
    event.description = description !== undefined ? description : event.description;
    event.date = date !== undefined ? date : event.date;
    event.location = location !== undefined ? location : event.location;
    event.participants = participants !== undefined ? participants : event.participants;
    event.status = status !== undefined ? status : event.status;

    await event.save();
    res.json({
      ...event._doc,
      participantCount: event.participants.length,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });
    res.json({ message: "Event Deleted" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });
    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
    }
    await event.save();
    res.json({
      ...event._doc,
      participantCount: event.participants.length,
    });
  } catch (error) {
    console.error("Join Event Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });
    event.participants.pull(req.user.id);
    await event.save();
    res.json({
      ...event._doc,
      participantCount: event.participants.length,
    });
  } catch (error) {
    console.error("Leave Event Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getEventsParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });
    const participants = await User.find({ _id: { $in: event.participants } });
    const participantsCount = participants.length;
    res.json({
      id: event._id,
      name: event.title,
      participantsCount: participantsCount,
    });
  } catch (error) {
    console.error("Get Events Participants Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getTopFiveEvents = async (req, res) => {
  try {
    const topEvents = await Event.find()
      .sort({ participants: -1 })
      .limit(5)
      .select('title participants');
    const eventsWithCount = topEvents.map((event) => ({
      ...event._doc,
      participantCount: event.participants.length,
    }));
    res.json(eventsWithCount);
  } catch (error) {
    console.error("Get Top Five Events Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getLastSevenDaysEvents = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEvents = await Event.find({ createdAt: { $gte: sevenDaysAgo } })
      .populate('participants', 'username')
      .select('title participants createdAt');
    const eventsWithCount = recentEvents.map((event) => ({
      ...event._doc,
      participantCount: event.participants.length,
    }));
    res.json(eventsWithCount);
  } catch (error) {
    console.error("Get Last Seven Days Events Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants', 'username')
      .select('title participants');
    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }
    res.json({
      id: event._id,
      title: event.title,
      participants: event.participants,
      participantCount: event.participants.length,
    });
  } catch (error) {
    console.error("Get Event Details Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getEventList = async (req, res) => {
  try {
    const events = await Event.find().select('_id title participants');
    const eventList = events.map((event) => ({
      id: event._id,
      title: event.title,
      participantCount: event.participants.length,
    }));
    res.json(eventList);
  } catch (error) {
    console.error("Get Event List Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};