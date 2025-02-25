const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  appointment_type: { type: String, required: true },
  patient_name: { type: String, required: true },
  notes: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
