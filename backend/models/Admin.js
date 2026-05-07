const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "shop_admin", "tourism_admin"],
      default: "shop_admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);