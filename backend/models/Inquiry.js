const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    filename: { type: String, default: "" },
    originalName: { type: String, default: "" },
    path: { type: String, default: "" },
    mimetype: { type: String, default: "" },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["flight", "visa"],
      required: true,
    },

    // common fields
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    destination: { type: String, default: "" },
    travelDate: { type: String, default: "" },
    message: { type: String, default: "" },

    // flight fields
    tripType: { type: String, default: "" },
    from: { type: String, default: "" },
    returnDate: { type: String, default: "" },

    // visa fields
    visaType: { type: String, default: "" },
    processingType: { type: String, default: "" },
    passportNumber: { type: String, default: "" },

    // uploaded documents
    documents: [documentSchema],

    // admin status
    status: {
      type: String,
      enum: ["pending", "booked", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);