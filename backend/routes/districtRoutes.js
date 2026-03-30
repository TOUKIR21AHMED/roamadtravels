const express = require("express");
const router = express.Router();
const District = require("../models/District");

// GET all districts
router.get("/", async (req, res) => {
  try {
    const districts = await District.find()
      .populate("divisionId", "nameBn slug")
      .sort({ nameBn: 1 });

    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch districts",
      error: error.message,
    });
  }
});

// GET districts by division
router.get("/by-division/:divisionId", async (req, res) => {
  try {
    const districts = await District.find({
      divisionId: req.params.divisionId,
    }).sort({ nameBn: 1 });

    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch districts by division",
      error: error.message,
    });
  }
});

// GET single district by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const district = await District.findOne({ slug: req.params.slug }).populate(
      "divisionId",
      "nameBn slug"
    );

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    res.status(200).json(district);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch district",
      error: error.message,
    });
  }
});

// POST create district
router.post("/", async (req, res) => {
  try {
    const newDistrict = new District(req.body);
    const savedDistrict = await newDistrict.save();
    res.status(201).json(savedDistrict);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create district",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDistrict = await District.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    res.status(200).json(updatedDistrict);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update district",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedDistrict = await District.findByIdAndDelete(req.params.id);

    if (!deletedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    res.status(200).json({ message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete district",
      error: error.message,
    });
  }
});

module.exports = router;