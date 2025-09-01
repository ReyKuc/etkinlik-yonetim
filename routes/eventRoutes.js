const express= require("express")
const router = express.Router()

const eventController = require("../controllers/eventController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")
const { eventNames } = require("process")


router.post(
    "/",
    authMiddleware,
    roleMiddleware(["user","admin"]),
    eventController.createrEvent
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["admin"]),
    eventController.getAllEvents
);

router.get(
    "/my",
    authMiddleware,
    roleMiddleware(["user"]),
    eventController.getMyEvents
);

router.get(
    "/:id",
    authMiddleware,
    checkEventOwnership,
    eventController.getEventById
);

router.put(
    "/:id",
    authMiddleware,
    checkEventOwnership,
    eventController.updateEvent
);


router.delete(
    "/:id",
    authMiddleware,
    checkEventOwnership,
    eventController.deleteEvent
);

router.post(
    "/:id/join",
    authMiddleware,
    checkEventOwnership,
    eventController.joinEvent
);

router.post(
    "/:id/leave",
    authMiddleware,
    checkEventOwnership,
    eventController.leaveEvent
);

module.exports = router;
