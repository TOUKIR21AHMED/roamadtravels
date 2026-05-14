const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ShopBanner = require("../models/ShopBanner");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/shop-banners");
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

// GET all banners
router.get("/", async (req, res) => {
  try {
    const banners = await ShopBanner.find().sort({ serial: 1, createdAt: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch shop banners",
      error: error.message,
    });
  }
});

// GET active banners
router.get("/active/list", async (req, res) => {
  try {
    const banners = await ShopBanner.find({ status: "active" }).sort({
      serial: 1,
      createdAt: 1,
    });

    res.json(banners);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch active shop banners",
      error: error.message,
    });
  }
});

// GET single banner
router.get("/:id", async (req, res) => {
  try {
    const banner = await ShopBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(banner);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banner",
      error: error.message,
    });
  }
});

// CREATE banner
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, serial, status } = req.body;

    const image = req.file
      ? `/uploads/shop-banners/${req.file.filename}`
      : "";

    if (!image) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const banner = new ShopBanner({
      title: title ? title.trim() : "",
      image,
      serial: Number(serial || 0),
      status: status || "active",
    });

    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create banner",
      error: error.message,
    });
  }
});

// UPDATE banner
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, serial, status } = req.body;

    const banner = await ShopBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (title !== undefined) banner.title = title.trim();

    if (req.file) {
      banner.image = `/uploads/shop-banners/${req.file.filename}`;
    }

    if (serial !== undefined) banner.serial = Number(serial || 0);
    if (status) banner.status = status;

    const updatedBanner = await banner.save();

    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update banner",
      error: error.message,
    });
  }
});

// DELETE banner
router.delete("/:id", async (req, res) => {
  try {
    const deletedBanner = await ShopBanner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete banner",
      error: error.message,
    });
  }
});

module.exports = router;