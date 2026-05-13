const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    dayTitle: { type: String, default: "" },
    location: { type: String, default: "" },
    time: { type: String, default: "" },
    details: { type: String, default: "" },
  },
  { _id: false }
);

const optionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    priceBdt: { type: Number, default: 0 },
    priceUsd: { type: Number, default: 0 },
    details: { type: String, default: "" },
  },
  { _id: false }
);

const eventPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    category: {
      type: String,
      enum: [
        "Attractions & Shows",
        "Activities & Experiences",
        "Sightseeing & Day-Tours",
        "Day-Out Packages",
        "Adventure",
      ],
      default: "Sightseeing & Day-Tours",
    },

    location: { type: String, required: true },
    country: { type: String, default: "Bangladesh" },

    mainImage: { type: String, required: true },
    galleryImages: [{ type: String }],

    duration: { type: String, default: "" },
    durationFilter: {
      type: String,
      enum: ["Less than 6 hours", "6 - 12 hours", "12 - 24 hours", "24+ hours"],
      default: "24+ hours",
    },

    timeSlot: {
      type: String,
      enum: ["00-06", "06-12", "12-18", "18-00"],
      default: "06-12",
    },

    minimumPeople: { type: String, default: "" },

    priceBdt: { type: Number, required: true },
    priceUsd: { type: Number, default: 0 },
    currencyDefault: {
      type: String,
      enum: ["BDT", "USD"],
      default: "BDT",
    },

    shortDescription: { type: String, default: "" },
    overview: { type: String, default: "" },
    locationDetails: { type: String, default: "" },
    timingDetails: { type: String, default: "" },

    itinerary: [itinerarySchema],

    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    requirements: [{ type: String }],
    facilities: [{ type: String }],
    additionalInfo: [{ type: String }],
    travelTips: [{ type: String }],

    description: { type: String, default: "" },
    cancellationPolicy: { type: String, default: "" },
    refundPolicy: { type: String, default: "" },

    mapEmbedUrl: { type: String, default: "" },

    options: [optionSchema],

    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventPackage", eventPackageSchema);