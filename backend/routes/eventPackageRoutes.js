const express = require("express");
const EventPackage = require("../models/EventPackage");

const router = express.Router();

const makeSlug = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// CREATE
router.post("/", async (req, res) => {
  try {
    const slugBase = makeSlug(req.body.title);
    const slug = req.body.slug ? makeSlug(req.body.slug) : `${slugBase}-${Date.now()}`;

    const eventPackage = await EventPackage.create({
      ...req.body,
      slug,
    });

    res.status(201).json(eventPackage);
  } catch (error) {
    res.status(500).json({
      message: "Event package create failed",
      error: error.message,
    });
  }
});

// GET ALL WITH FILTER, SEARCH, PAGINATION
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      duration,
      timeSlot,
      minPrice,
      maxPrice,
      currency = "BDT",
      page = 1,
      limit = 8,
      featured,
      published = "true",
    } = req.query;

    const query = {};

    if (published !== "all") {
      query.isPublished = published === "true";
    }

    if (featured === "true") query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (duration) query.durationFilter = duration;
    if (timeSlot) query.timeSlot = timeSlot;

    const priceField = currency === "USD" ? "priceUsd" : "priceBdt";

    if (minPrice || maxPrice) {
      query[priceField] = {};
      if (minPrice) query[priceField].$gte = Number(minPrice);
      if (maxPrice) query[priceField].$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      EventPackage.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      EventPackage.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      message: "Event packages fetch failed",
      error: error.message,
    });
  }
});

// SUGGESTIONS
router.get("/suggestions", async (req, res) => {
  try {
    const items = await EventPackage.find({ isPublished: true })
      .select("title location country")
      .sort({ createdAt: -1 });

    const suggestions = [];

    items.forEach((item) => {
      if (item.location) suggestions.push(item.location);
      if (item.country) suggestions.push(item.country);
      if (item.title) suggestions.push(item.title);
    });

    res.json([...new Set(suggestions)]);
  } catch (error) {
    res.status(500).json({
      message: "Suggestions fetch failed",
      error: error.message,
    });
  }
});

// GET SINGLE BY SLUG
router.get("/:slug", async (req, res) => {
  try {
    const eventPackage = await EventPackage.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!eventPackage) {
      return res.status(404).json({ message: "Event package not found" });
    }

    res.json(eventPackage);
  } catch (error) {
    res.status(500).json({
      message: "Event package fetch failed",
      error: error.message,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.slug) {
      updateData.slug = makeSlug(req.body.slug);
    }

    const eventPackage = await EventPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!eventPackage) {
      return res.status(404).json({ message: "Event package not found" });
    }

    res.json(eventPackage);
  } catch (error) {
    res.status(500).json({
      message: "Event package update failed",
      error: error.message,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const eventPackage = await EventPackage.findByIdAndDelete(req.params.id);

    if (!eventPackage) {
      return res.status(404).json({ message: "Event package not found" });
    }

    res.json({ message: "Event package deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Event package delete failed",
      error: error.message,
    });
  }
});

module.exports = router;