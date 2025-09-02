const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User Not Found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.put("/:id/role", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !["admin", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User Not Found" });

        user.role = role;
        await user.save();

        res.json({ message: `User role updated to ${role}` });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
