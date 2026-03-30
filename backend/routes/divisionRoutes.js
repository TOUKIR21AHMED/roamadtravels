const express = require("express");
const router = express.Router();
const Division = require("../models/Division");

// GET all divisions
router.get("/", async (req, res) => {
  try {
    const divisions = await Division.find().sort({ nameBn: 1 });
    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch divisions",
      error: error.message,
    });
  }
});

// POST create division
router.post("/", async (req, res) => {
  try {
    const newDivision = new Division(req.body);
    const savedDivision = await newDivision.save();
    res.status(201).json(savedDivision);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create division",
      error: error.message,
    });
  }
});

module.exports = router;