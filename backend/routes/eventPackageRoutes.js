const express = require("express");
const multer = require("multer");
const path = require("path");
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/events");
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

const parseArray = (value) => {
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

// CREATE
router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const slugBase = makeSlug(req.body.title);
      const slug = req.body.slug
        ? makeSlug(req.body.slug)
        : `${slugBase}-${Date.now()}`;

      const mainImage = req.files?.mainImage?.[0]
        ? `/uploads/events/${req.files.mainImage[0].filename}`
        : "";

      const galleryImages = req.files?.galleryImages
        ? req.files.galleryImages.map(
            (file) => `/uploads/events/${file.filename}`
          )
        : [];

      if (!mainImage) {
        return res.status(400).json({
          message: "Main image is required",
        });
      }

      const eventPackage = await EventPackage.create({
        title: req.body.title,
        slug,

        category: req.body.category,
        location: req.body.location,
        country: req.body.country,

        mainImage,
        galleryImages,

        duration: req.body.duration,
        durationFilter: req.body.durationFilter,
        timeSlot: req.body.timeSlot,
        minimumPeople: req.body.minimumPeople,

priceBdt: isNaN(Number(req.body.priceBdt))
  ? 0
  : Number(req.body.priceBdt),

priceUsd: isNaN(Number(req.body.priceUsd))
  ? 0
  : Number(req.body.priceUsd),
        currencyDefault: req.body.currencyDefault,

        shortDescription: req.body.shortDescription,
        overview: req.body.overview,
        locationDetails: req.body.locationDetails,
        timingDetails: req.body.timingDetails,
        description: req.body.description,

        mapEmbedUrl: req.body.mapEmbedUrl,
        cancellationPolicy: req.body.cancellationPolicy,
        refundPolicy: req.body.refundPolicy,

        inclusions: parseArray(req.body.inclusions),
        exclusions: parseArray(req.body.exclusions),
        requirements: parseArray(req.body.requirements),
        facilities: parseArray(req.body.facilities),
        additionalInfo: parseArray(req.body.additionalInfo),
        travelTips: parseArray(req.body.travelTips),

        itinerary: parseArray(req.body.itinerary),
        options: parseArray(req.body.options),

        isFeatured: req.body.isFeatured === "true",
        isPublished: req.body.isPublished === "true",
      });

      res.status(201).json(eventPackage);
    } catch (error) {
      console.log("Event package create error:", error);

      res.status(500).json({
        message: "Event package create failed",
        error: error.message,
      });
    }
  }
);

// GET ALL
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

// UPDATE old JSON update thaklo
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