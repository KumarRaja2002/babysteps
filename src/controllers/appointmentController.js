const moment = require("moment-timezone");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { isSlotAvailable } = require("../utils/availabilityHelper");

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find().populate("doctor_id");
  res.json(appointments);
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, date, duration, appointment_type, patient_name, notes } = req.body;
    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Convert date to "HH:mm" format
    const requestedSlot = moment.utc(date).format("HH:mm");

    const availableSlots = await isSlotAvailable(doctor, date);

    if (!availableSlots.includes(requestedSlot)) {
      return res.status(400).json({ message: "Slot not available" });
    }

    const appointment = new Appointment({ doctor_id, date, duration, appointment_type, patient_name, notes });
    await appointment.save();
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating appointment" });
  }
};


exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate("doctor_id");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_id, date, duration, appointment_type, patient_name, notes } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });


    // If the date is being updated, check slot availability
    if (date && date !== appointment.date.toISOString()) {
      const requestedSlot = moment.utc(date).format("HH:mm");

      const availableSlots = await isSlotAvailable(doctor, date)

      if (!availableSlots.includes(requestedSlot)) {
        return res.status(400).json({ message: "Slot not available" });
      }

      appointment.date = date; // Update date only if changed
    }

    // Update other fields
    appointment.doctor_id = doctor_id || appointment.doctor_id;
    appointment.duration = duration || appointment.duration;
    appointment.appointment_type = appointment_type || appointment.appointment_type;
    appointment.patient_name = patient_name || appointment.patient_name;
    appointment.notes = notes || appointment.notes;

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};

