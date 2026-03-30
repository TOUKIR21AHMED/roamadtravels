const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// GET all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find()
      .populate("districtId")
      .sort({ createdAt: -1 });

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch places",
      error: error.message,
    });
  }
});

// GET places by district
router.get("/by-district/:districtId", async (req, res) => {
  try {
    const places = await Place.find({
      districtId: req.params.districtId,
    }).sort({ createdAt: -1 });

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch places by district",
      error: error.message,
    });
  }
});

// GET single place by id
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate("districtId");

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch place",
      error: error.message,
    });
  }
});

// SEARCH places
router.get("/search/:text", async (req, res) => {
  try {
    const searchText = req.params.text;

    const places = await Place.find({
      nameBn: { $regex: searchText, $options: "i" },
    }).populate("districtId");

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search places",
      error: error.message,
    });
  }
});
// POST create place
router.post("/", async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create place",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update place",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete place",
      error: error.message,
    });
  }
});

module.exports = router;