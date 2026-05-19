const express = require("express");
const multer = require("multer");
const path = require("path");
const Testimonial = require("../models/Testimonial");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/testimonials"),
  filename: (req, file, cb) => {
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

router.get("/active", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const testimonial = await Testimonial.create({
      name: req.body.name,
      location: req.body.location,
      message: req.body.message,
      rating: Number(req.body.rating || 5),
      image: req.file ? `/uploads/testimonials/${req.file.filename}` : "",
      isActive: true,
    });

    res.status(201).json({
      message: "Testimonial added successfully",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add testimonial",
      error: error.message,
    });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
});

module.exports = router;