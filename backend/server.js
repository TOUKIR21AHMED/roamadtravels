const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const divisionRoutes = require("./routes/divisionRoutes");
const districtRoutes = require("./routes/districtRoutes");
const placeRoutes = require("./routes/placeRoutes");

const productCategoryRoutes = require("./routes/productCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shopBannerRoutes = require("./routes/shopBannerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
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

app.get("/", (req, res) => {
  res.send("Travel Guide API running 🚀");
});