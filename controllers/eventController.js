
const Event = require("./models/event");
const eventController = require("./eventController");


exports.createEvent = async (req,res)=>{
    try{
        const {title,description, date,location,participants,status} = req.body;

        const event = new Event ({
            title,
            description,
            date,
            location,
            participants,
            status,
            createdBy:req.user.id,
        })

        await event.save();
        res.status(201).json(event);
    } catch(error){
        res.status(500).json({message:"Server Error", error:error.message})
    }
};

exports.getMyEvents = async (req,res)=>{
    try{
        const event = await Event.find({createdBy: req.user.id})
        res.json(event)
    }catch(error){
        res.status(500).json({message:"Server Error"})
    }

}

exports.getAllEvents = async(req,res)=>{
    try{
        const events = await Event.find();
        res.json(events);

    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

exports.getEventById = async(req,res)=>{

    try{
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({message:"Event Not Found"});    
        }
        res.json(event);

    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};



exports.updateEvent = async(req,res)=>{
    try{
        const {title,description,date,location,participants,status} = req.body;
        const event = await Event.findById(req.params.id);

        if(!event) return res.status(404).json({message:"Event Not Found"});

        event.title = title !== undefined ? title : event.title;
        event.description = description !== undefined ? description : event.description;
        event.location = location !== undefined ? location :event.location;
        event.participants = participants !== undefined ? participants .event.participants;
        event.status = status !== undefined ? status:event.status;

        await event.save();
        res.json(event);

    }catch(error){
        res.status(500).json({message:"Server Error"})
    }
}


exports.deleteEvent = async(req,res)=>{
    try{
        const event = await Event.findByIdAndDelete(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"})
         
            res.json({message:"Event Deleted"});

        }catch(error){
            res.status(500).json({message:"Server Error"});
        }

}

exports.joinEvent = async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"});

        event.participants.push(req.user.id);
        await event.save();
        res.json(event);

    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

exports.leaveEvent = async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({message:"Event Not Found"});

        event.participants.pull(req.user.id);
        await event.save();
        res.json(event);

    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}