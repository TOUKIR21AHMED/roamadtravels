const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const {
  imageUpload,
  runMiddleware,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

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

// CREATE place with image upload
router.post("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const uploadedImage = req.file
      ? await uploadSingleImage(req.file, "roamad-travels/places")
      : null;

    const image = uploadedImage?.secure_url || "";

    const newPlace = new Place({
      districtId: req.body.districtId,
      nameBn: req.body.nameBn,
      image,
      shortDescription: req.body.shortDescription,
      fullDescription: req.body.fullDescription,
      locationBn: req.body.locationBn,
      weatherLocationEn: req.body.weatherLocationEn,
    });

    const savedPlace = await newPlace.save();

    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create place",
      error: error.message,
    });
  }
});

// UPDATE place with optional image upload
router.put("/:id", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const updateData = {
      districtId: req.body.districtId,
      nameBn: req.body.nameBn,
      shortDescription: req.body.shortDescription,
      fullDescription: req.body.fullDescription,
      locationBn: req.body.locationBn,
      weatherLocationEn: req.body.weatherLocationEn,
    };

    if (req.file) {
      const uploadedImage = await uploadSingleImage(
        req.file,
        "roamad-travels/places"
      );

      updateData.image = uploadedImage?.secure_url || "";
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      updateData,
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