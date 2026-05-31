const express = require("express");
const Testimonial = require("../models/Testimonial");
const {
  imageUpload,
  runMiddleware,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

const router = express.Router();

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

router.post("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const uploadedImage = req.file
      ? await uploadSingleImage(req.file, "roamad-travels/testimonials")
      : null;

    const testimonial = await Testimonial.create({
      name: req.body.name,
      location: req.body.location,
      message: req.body.message,
      rating: Number(req.body.rating || 5),
      image: uploadedImage?.secure_url || "",
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