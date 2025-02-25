const express = require("express");
const { getDoctors, getAvailableSlots,addDoctor } = require("../controllers/doctorController");

const router = express.Router();
router.get("/", getDoctors);
router.get("/:id/slots", getAvailableSlots);
router.post("/", addDoctor);
module.exports = router;
