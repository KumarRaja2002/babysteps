const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { isSlotAvailable } = require("../utils/availabilityHelper");

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const availableSlots = await isSlotAvailable(doctor, date);
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { name, working_hours, specialization } = req.body;

    if (!name || !working_hours?.start || !working_hours?.end) {
      return res.status(400).json({ message: "Name and working hours are required" });
    }

    const newDoctor = new Doctor({ name, working_hours, specialization });
    await newDoctor.save();

    res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
