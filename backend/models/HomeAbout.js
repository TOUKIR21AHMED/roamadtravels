const mongoose = require("mongoose");

const homeAboutSchema = new mongoose.Schema(
  {
    sectionLabel: { type: String, default: "About Us" },
    titleBeforeHighlight: { type: String, default: "Welcome to" },
    highlightedTitle: { type: String, default: "Tourist" },

    paragraphOne: { type: String, default: "" },
    paragraphTwo: { type: String, default: "" },

    features: [{ type: String }],

    buttonText: { type: String, default: "Read More" },
    buttonLink: { type: String, default: "/about" },

    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeAbout", homeAboutSchema);