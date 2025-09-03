
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.post("/register", authController.registerAdmin);

router.post("/login", authController.login);
router.post("/addUser", authMiddleware, roleMiddleware(['admin']), authController.addUser);
router.get("/allUsers", authMiddleware, roleMiddleware(['admin']), authController.getAllUsers);
router.delete("/deleteUser/:id", authMiddleware, roleMiddleware(['admin']), authController.deleteUser);
router.put("/updateUserRole/:id", authMiddleware, roleMiddleware(['admin']), authController.updateUserRole);

router.post("/logout", authMiddleware, authController.logout);
module.exports = router;
