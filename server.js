
const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoutes =require("./routes/authRoutes")
const eventRoutes = require("./routes/eventRoutes")
const userRoutes = require("./routes/userRoutes")

dotenv.config()

const app = express()
//app.use(express.json())

mongoose
.connect(process.env.MONGO_URI)

.then(()=>console.log("MONGODB Bağlantısı Başarılı"))

.catch((err)=> console.log("MONGODB Bağlantı Hatası",  err))

//app.use("/api/auth", authRoutes)
//app.use("/api/events", eventRoutes)
//app.use("/api/users", userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`Server ${PORT} portunda çalışıyor...`))