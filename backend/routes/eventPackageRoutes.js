const express = require("express");
const EventPackage = require("../models/EventPackage");
const {
  imageUpload,
  runMiddleware,
  uploadMultipleImages,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

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

const parseArray = (value) => {
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

const parseNumber = (value, fallback = 0) => {
  const normalized = Array.isArray(value) ? value[value.length - 1] : value;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? fallback : parsed;
};

// CREATE
router.post("/", async (req, res) => {
  try {
    await runMiddleware(
      imageUpload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 20 },
      ]),
      req,
      res
    );

    console.log("Event package create body:", req.body);

    const slugBase = makeSlug(req.body.title);
    const slug = req.body.slug
      ? makeSlug(req.body.slug)
      : `${slugBase}-${Date.now()}`;

    const mainImageFile = req.files?.mainImage?.[0];
    const galleryFiles = req.files?.galleryImages || [];

    const mainImageResult = mainImageFile
      ? await uploadSingleImage(mainImageFile, "roamad-travels/event-packages")
      : null;

    const galleryImageResults = await uploadMultipleImages(
      galleryFiles,
      "roamad-travels/event-packages"
    );

    if (!mainImageResult?.secure_url) {
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

      mainImage: mainImageResult.secure_url,
      galleryImages: galleryImageResults.map((item) => item.secure_url),

      duration: req.body.duration,
      durationFilter: req.body.durationFilter,
      timeSlot: req.body.timeSlot,
      minimumPeople: req.body.minimumPeople,

      priceBdt: parseNumber(req.body.priceBdt),
      priceUsd: parseNumber(req.body.priceUsd),
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
});

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

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    await runMiddleware(
      imageUpload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 20 },
      ]),
      req,
      res
    );

    console.log("Event package update body:", req.body);

    const eventPackage = await EventPackage.findById(req.params.id);

    if (!eventPackage) {
      return res.status(404).json({ message: "Event package not found" });
    }

    const updateData = {
      title: req.body.title,
      slug: req.body.slug ? makeSlug(req.body.slug) : eventPackage.slug,
      category: req.body.category,
      location: req.body.location,
      country: req.body.country,
      duration: req.body.duration,
      durationFilter: req.body.durationFilter,
      timeSlot: req.body.timeSlot,
      minimumPeople: req.body.minimumPeople,
      priceBdt: parseNumber(req.body.priceBdt),
      priceUsd: parseNumber(req.body.priceUsd),
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
    };

    const mainImageFile = req.files?.mainImage?.[0];
    if (mainImageFile) {
      const uploadedMainImage = await uploadSingleImage(
        mainImageFile,
        "roamad-travels/event-packages"
      );

      updateData.mainImage = uploadedMainImage?.secure_url || eventPackage.mainImage;
    }

    const oldGalleryImages = parseArray(req.body.oldGalleryImages);
    const newGalleryFiles = req.files?.galleryImages || [];

    if (newGalleryFiles.length > 0) {
      const uploadedGalleryImages = await uploadMultipleImages(
        newGalleryFiles,
        "roamad-travels/event-packages"
      );

      updateData.galleryImages = [
        ...oldGalleryImages,
        ...uploadedGalleryImages.map((item) => item.secure_url),
      ];
    } else if (req.body.oldGalleryImages) {
      updateData.galleryImages = oldGalleryImages;
    }

    const updatedEventPackage = await EventPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedEventPackage);
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