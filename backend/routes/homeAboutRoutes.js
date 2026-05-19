const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const HomeAbout = require("../models/HomeAbout");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/home-about");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

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

router.put("/", upload.single("image"), async (req, res) => {
  try {
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
      updateData.image = `/uploads/home-about/${req.file.filename}`;
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