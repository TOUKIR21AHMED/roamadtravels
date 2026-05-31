const express = require("express");
const router = express.Router();
const HomeAbout = require("../models/HomeAbout");
const {
  imageUpload,
  runMiddleware,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

router.get("/", async (req, res) => {
  try {
    let about = await HomeAbout.findOne().sort({ createdAt: -1 });

    if (!about) {
      about = await HomeAbout.create({
        paragraphOne:
          "We help travelers plan flights, visa support, travel guides, events and premium travel experiences.",
        paragraphTwo:
          "Our goal is to make travel planning easier, smarter and more reliable for every client.",
        features: [
          "Flight Support",
          "Visa Assistance",
          "Events & Packages",
          "Travel Guide",
          "Custom Event Planning",
          "24/7 Service",
        ],
      });
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch home about",
      error: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    let about = await HomeAbout.findOne().sort({ createdAt: -1 });

    const updateData = {
      sectionLabel: req.body.sectionLabel,
      titleBeforeHighlight: req.body.titleBeforeHighlight,
      highlightedTitle: req.body.highlightedTitle,
      paragraphOne: req.body.paragraphOne,
      paragraphTwo: req.body.paragraphTwo,
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink,
      features: JSON.parse(req.body.features || "[]"),
    };

    if (req.file) {
      const uploadedImage = await uploadSingleImage(
        req.file,
        "roamad-travels/home-about"
      );

      updateData.image = uploadedImage?.secure_url || "";
    }

    if (!about) {
      about = await HomeAbout.create(updateData);
    } else {
      about = await HomeAbout.findByIdAndUpdate(about._id, updateData, {
        new: true,
      });
    }

    res.json({
      message: "Home about updated successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update home about",
      error: error.message,
    });
  }
});

module.exports = router;