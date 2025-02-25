const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
