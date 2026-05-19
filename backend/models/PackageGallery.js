const mongoose = require("mongoose");

const packageGallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    location: { type: String, default: "" },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PackageGallery", packageGallerySchema);