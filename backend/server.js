const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const divisionRoutes = require("./routes/divisionRoutes");
const districtRoutes = require("./routes/districtRoutes");
const placeRoutes = require("./routes/placeRoutes");

const productCategoryRoutes = require("./routes/productCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shopBannerRoutes = require("./routes/shopBannerRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const eventPackageRoutes = require("./routes/eventPackageRoutes");
const eventRequestRoutes = require("./routes/eventRequestRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ uploaded images public korar jonno
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

app.use("/api/divisions", divisionRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/places", placeRoutes);

app.use("/api/product-categories", productCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shop-banners", shopBannerRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/event-packages", eventPackageRoutes);
app.use("/api/event-requests", eventRequestRoutes);

app.get("/", (req, res) => {
  res.send("Travel Guide API running 🚀");
});