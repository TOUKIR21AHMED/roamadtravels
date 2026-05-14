const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["visa", "flight"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    destination: {
      type: String,
    },
    travelDate: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "booked", "canceled"],
  default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);