const Event = require("../models/Event");

// Yeni event oluştur
exports.createEvent = async (req,res)=>{
    try{
        const {title,description,date,location,participants,status} = req.body;

        const event = new Event ({
            title,
            description,
            date,
            location,
            participants: participants || [],
            status,
            createdBy:req.user.id,
        });

        await event.save();
        res.status(201).json({
            ...event._doc,
            participantCount: event.participants.length
        });
    } catch(error){
        res.status(500).json({message:"Server Error", error:error.message});
    }
};

// Kullanıcının kendi eventlerini getir
exports.getMyEvents = async(req,res)=>{
    try{
        const events = await Event.find({createdBy: req.user.id});
        const eventsWithCount = events.map(event => ({
            ...event._doc,
            participantCount: event.participants.length
        }));
        res.json(eventsWithCount);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

// Tüm eventleri getir
exports.getAllEvents = async(req,res)=>{
    try{
        const events = await Event.find();
        const eventsWithCount = events.map(event => ({
            ...event._doc,
            participantCount: event.participants.length
        }));
        res.json(eventsWithCount);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

// ID ile event getir
exports.getEventById = async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"});
        
        res.json({
            ...event._doc,
            participantCount: event.participants.length
        });
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

// Event güncelle
exports.updateEvent = async(req,res)=>{
    try{
        const {title,description,date,location,participants,status} = req.body;
        const event = await Event.findById(req.params.id);

        if(!event) return res.status(404).json({message:"Event Not Found"});

        event.title = title !== undefined ? title : event.title;
        event.description = description !== undefined ? description : event.description;
        event.date = date !== undefined ? date : event.date;
        event.location = location !== undefined ? location : event.location;
        event.participants = participants !== undefined ? participants : event.participants;
        event.status = status !== undefined ? status : event.status;

        await event.save();
        res.json({
            ...event._doc,
            participantCount: event.participants.length
        });
    }catch(error){
        res.status(500).json({message:"Server Error"})
    }
};

// Event sil
exports.deleteEvent = async(req,res)=>{
    try{
        const event = await Event.findByIdAndDelete(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"});
         
        res.json({message:"Event Deleted"});
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

// Event’e katıl
exports.joinEvent = async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"});

        if(!event.participants.includes(req.user.id)){
            event.participants.push(req.user.id);
        }
        await event.save();

        res.json({
            ...event._doc,
            participantCount: event.participants.length
        });
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

// Event’ten ayrıl
exports.leaveEvent = async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"});

        event.participants.pull(req.user.id);
        await event.save();

        res.json({
            ...event._doc,
            participantCount: event.participants.length
        });
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};
