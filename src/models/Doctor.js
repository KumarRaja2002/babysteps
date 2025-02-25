const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  working_hours: { start: String, end: String },
});

module.exports = mongoose.model("Doctor", doctorSchema);
