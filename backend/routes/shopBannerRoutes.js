const express = require("express");
const router = express.Router();
const ShopBanner = require("../models/ShopBanner");

// GET all banners (admin)
router.get("/", async (req, res) => {
  try {
    const banners = await ShopBanner.find().sort({ serial: 1, createdAt: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shop banners", error: error.message });
  }
});

// GET only active banners (shop page)
router.get("/active/list", async (req, res) => {
  try {
    const banners = await ShopBanner.find({ status: "active" }).sort({ serial: 1, createdAt: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active shop banners", error: error.message });
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
    res.status(500).json({ message: "Failed to fetch banner", error: error.message });
  }
});

// POST create banner
router.post("/", async (req, res) => {
  try {
    const { title, image, serial, status } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const banner = new ShopBanner({
      title: title ? title.trim() : "",
      image: image.trim(),
      serial: serial || 0,
      status: status || "active",
    });

    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ message: "Failed to create banner", error: error.message });
  }
});

// PUT update banner
router.put("/:id", async (req, res) => {
  try {
    const { title, image, serial, status } = req.body;

    const banner = await ShopBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (title !== undefined) banner.title = title.trim();
    if (image) banner.image = image.trim();
    if (serial !== undefined) banner.serial = serial;
    if (status) banner.status = status;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: "Failed to update banner", error: error.message });
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
    res.status(500).json({ message: "Failed to delete banner", error: error.message });
  }
});

module.exports = router;