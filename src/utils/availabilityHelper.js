const Appointment = require("../models/Appointment");
const moment = require("moment");

const isSlotAvailable = async (doctor, date) => {
  const { working_hours } = doctor;
  if (!working_hours) return [];

  const inputDate = moment.tz(date, "UTC").startOf("day"); // Normalize input date to UTC
  const startTime = inputDate.clone().set({
    hour: parseInt(working_hours.start.split(":")[0]),
    minute: parseInt(working_hours.start.split(":")[1]),
    second: 0,
    millisecond: 0,
  });

  const endTime = inputDate.clone().set({
    hour: parseInt(working_hours.end.split(":")[0]),
    minute: parseInt(working_hours.end.split(":")[1]),
    second: 0,
    millisecond: 0,
  });


  const existingAppointments = await Appointment.find({
    doctor_id: doctor._id,
    date: { $gte: startTime.toDate(), $lt: endTime.toDate() },
  });

  const bookedSlots = existingAppointments.map((appt) =>
    moment.tz(appt.date, "UTC").format("HH:mm")
  );

  const availableSlots = [];
  let currentSlot = startTime.clone();

  while (currentSlot.isBefore(endTime)) {
    if (!bookedSlots.includes(currentSlot.format("HH:mm"))) {
      availableSlots.push(currentSlot.format("HH:mm"));
    }
    currentSlot.add(30, "minutes");
  }
  return availableSlots;
};

module.exports = { isSlotAvailable };

