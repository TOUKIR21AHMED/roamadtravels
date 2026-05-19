const express = require("express");
const multer = require("multer");
const path = require("path");
const PackageGallery = require("../models/PackageGallery");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/package-gallery");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

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
router.post("/", upload.array("images", 50), async (req, res) => {
  try {
    const files = req.files || [];

    const saved = await PackageGallery.insertMany(
      files.map((file) => ({
        title: req.body.title || "",
        location: req.body.location || "",
        image: `/uploads/package-gallery/${file.filename}`,
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