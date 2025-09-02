const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.registerAdmin = async (req, res) => {
    try {
        const existingAdmins = await User.find({ role: "admin" });
        if (existingAdmins.length > 0)
            return res.status(403).json({ message: "Sistem zaten bir admin içeriyor" });

        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username ve password gerekli" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({ username, password: hashedPassword, role: "admin" });
        await admin.save();

        res.status(201).json({ message: "Admin başarıyla oluşturuldu", admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username ve password gerekli" });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Parola yanlış" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Giriş başarılı", token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Yetkisiz işlem" });

        const { username, password, role } = req.body;
        if (!username || !password || !role) return res.status(400).json({ message: "Tüm alanlar gerekli" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Kullanıcı zaten var" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Kullanıcı oluşturuldu", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Yetkisiz işlem" });

        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Yetkisiz işlem" });

        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ message: "Kullanıcı silindi" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateUserRole = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Yetkisiz işlem" });

        const userId = req.params.id;
        const { role } = req.body;
        if (!role) return res.status(400).json({ message: "Role gerekli" });

        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
        res.json({ message: "Kullanıcı rolü güncellendi", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
