const express = require("express");
const { getAppointments, createAppointment, getAppointmentById, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");

const router = express.Router();
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
