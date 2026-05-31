const express = require("express");
const PackageGallery = require("../models/PackageGallery");
const {
  imageUpload,
  runMiddleware,
  uploadMultipleImages,
} = require("../utils/uploadToCloudinary");

const router = express.Router();

// random 9 images for frontend
router.get("/random", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 9;

    const images = await PackageGallery.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } },
    ]);

    res.json(images);
  } catch (error) {
    res.status(500).json({
      message: "Random gallery fetch failed",
      error: error.message,
    });
  }
});

// admin get all
router.get("/", async (req, res) => {
  try {
    const images = await PackageGallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({
      message: "Gallery fetch failed",
      error: error.message,
    });
  }
});

// upload multiple
router.post("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.array("images", 50), req, res);

    const files = req.files || [];
    const uploadedImages = await uploadMultipleImages(
      files,
      "roamad-travels/package-gallery"
    );

    if (!uploadedImages.length) {
      return res.status(400).json({ message: "Please select at least one image" });
    }

    const saved = await PackageGallery.insertMany(
      uploadedImages.map((file) => ({
        title: req.body.title || "",
        location: req.body.location || "",
        image: file.secure_url,
        isActive: true,
      }))
    );

    res.status(201).json({
      message: "Gallery images uploaded successfully",
      images: saved,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gallery upload failed",
      error: error.message,
    });
  }
});

// status toggle
router.put("/:id/status", async (req, res) => {
  try {
    const image = await PackageGallery.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );

    res.json(image);
  } catch (error) {
    res.status(500).json({
      message: "Status update failed",
      error: error.message,
    });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    await PackageGallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

module.exports = router;