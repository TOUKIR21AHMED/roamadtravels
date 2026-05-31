const express = require("express");
const router = express.Router();
const District = require("../models/District");
const {
  imageUpload,
  runMiddleware,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

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

// CREATE district with image upload
router.post("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const uploadedImage = req.file
      ? await uploadSingleImage(req.file, "roamad-travels/districts")
      : null;

    const image = uploadedImage?.secure_url || "";

    const newDistrict = new District({
      divisionId: req.body.divisionId,
      nameBn: req.body.nameBn,
      slug: req.body.slug,
      shortDescription: req.body.shortDescription,
      image,
    });

    const savedDistrict = await newDistrict.save();

    res.status(201).json(savedDistrict);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create district",
      error: error.message,
    });
  }
});

// UPDATE district
router.put("/:id", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const updateData = {
      divisionId: req.body.divisionId,
      nameBn: req.body.nameBn,
      slug: req.body.slug,
      shortDescription: req.body.shortDescription,
    };

    if (req.file) {
      const uploadedImage = await uploadSingleImage(
        req.file,
        "roamad-travels/districts"
      );

      updateData.image = uploadedImage?.secure_url || "";
    }

    const updatedDistrict = await District.findByIdAndUpdate(
      req.params.id,
      updateData,
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