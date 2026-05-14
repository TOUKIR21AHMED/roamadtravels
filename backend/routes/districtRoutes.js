const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const District = require("../models/District");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/districts");
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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const image = req.file ? `/uploads/districts/${req.file.filename}` : "";

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
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      divisionId: req.body.divisionId,
      nameBn: req.body.nameBn,
      slug: req.body.slug,
      shortDescription: req.body.shortDescription,
    };

    if (req.file) {
      updateData.image = `/uploads/districts/${req.file.filename}`;
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