const mongoose = require("mongoose");

const eventRequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["consultation", "custom-tour"],
      default: "consultation",
    },

    eventPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventPackage",
      default: null,
    },

    destination: { type: String, default: "" },
    journeyDate: { type: String, default: "" },

    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    phoneCode: { type: String, default: "+880" },
    phone: { type: String, required: true },
    email: { type: String, default: "" },

    additionalRequirement: { type: String, default: "" },

    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventRequest", eventRequestSchema);