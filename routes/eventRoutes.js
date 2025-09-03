const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getevent/:id", authMiddleware, eventController.getEventsParticipants);
router.post("/", authMiddleware, eventController.createEvent);
router.get("/", authMiddleware, eventController.getAllEvents);
router.get("/top-five", authMiddleware, eventController.getTopFiveEvents);
router.get("/last-seven-days", authMiddleware, eventController.getLastSevenDaysEvents);
router.get("/:id/details", authMiddleware, eventController.getEventDetails);
router.get("/list", authMiddleware, eventController.getEventList);

router.get("/:id", authMiddleware, eventController.getEventById);
router.put("/:id", authMiddleware, eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);
router.post("/:id/join", authMiddleware, eventController.joinEvent);
router.post("/:id/leave", authMiddleware, eventController.leaveEvent);

module.exports = router;