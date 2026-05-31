const express = require("express");
const router = express.Router();
const ShopBanner = require("../models/ShopBanner");
const {
  imageUpload,
  runMiddleware,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

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
router.post("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const { title, serial, status } = req.body;

    const uploadedImage = req.file
      ? await uploadSingleImage(req.file, "roamad-travels/shop-banners")
      : null;

    const image = uploadedImage?.secure_url || "";

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
router.put("/:id", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const { title, serial, status } = req.body;

    const banner = await ShopBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (title !== undefined) banner.title = title.trim();

    if (req.file) {
      const uploadedImage = await uploadSingleImage(
        req.file,
        "roamad-travels/shop-banners"
      );

      banner.image = uploadedImage?.secure_url || "";
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