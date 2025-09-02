// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔒 Tüm event işlemleri giriş yapmış kullanıcılar tarafından yapılabilir
router.post("/", authMiddleware, eventController.createEvent);       // Yeni event oluştur
router.get("/", authMiddleware, eventController.getAllEvents);      // Tüm eventleri getir
router.get("/:id", authMiddleware, eventController.getEventById);   // Tek event getir
router.put("/:id", authMiddleware, eventController.updateEvent);    // Event güncelle
router.delete("/:id", authMiddleware, eventController.deleteEvent); // Event sil

// ➕ Kullanıcıların etkinliklere katılması / ayrılması
router.post("/:id/join", authMiddleware, eventController.joinEvent);   // Etkinliğe katıl
router.post("/:id/leave", authMiddleware, eventController.leaveEvent); // Etkinlikten ayrıl

module.exports = router;
