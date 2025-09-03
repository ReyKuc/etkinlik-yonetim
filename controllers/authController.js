const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.registerAdmin = async (req, res) => {
    try {
        const existingAdmins = await User.find({ role: "admin" });
        if (existingAdmins.length > 0)
            return res.status(403).json({ message: "Already exists an admin" });

        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username and password are required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({ username, password: hashedPassword, role: "admin" });
        await admin.save();

        res.status(201).json({ message: "Admin successfully created", admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username and password are required" });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized action" });

        const { username, password, role } = req.body;
        if (!username || !password || !role) return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User successfully created", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized action" });

        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized action" });

        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User successfully deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateUserRole = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized action" });

        const userId = req.params.id;
        const { role } = req.body;
        if (!role) return res.status(400).json({ message: "Role is required" });

        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
        res.json({ message: "User role successfully updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
  res.json({ message: "Logout successful. Please clear the JWT token on the client side." });
};