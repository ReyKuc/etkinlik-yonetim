
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/", authMiddleware, eventController.createEvent);       
router.get("/", authMiddleware, eventController.getAllEvents);      
router.get("/:id", authMiddleware, eventController.getEventById);   
router.put("/:id", authMiddleware, eventController.updateEvent);    
router.delete("/:id", authMiddleware, eventController.deleteEvent); 


router.post("/:id/join", authMiddleware, eventController.joinEvent);   
router.post("/:id/leave", authMiddleware, eventController.leaveEvent); 

module.exports = router;
