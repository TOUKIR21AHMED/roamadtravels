const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");

// GET all products with category filter / search / sort / pagination
router.get("/", async (req, res) => {
  try {
    const {
      categoryId,
      search = "",
      sort = "",
      page = 1,
      limit = 9,
    } = req.query;

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 9;

    let query = { status: "active" };

    // Global search active থাকলে category ignore হবে
    if (search && search.trim().length >= 2) {
      query.name = { $regex: search.trim(), $options: "i" };
    } else if (categoryId) {
      query.categoryId = categoryId;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sort === "highToLow") {
      sortOption = { price: -1 };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / perPage);

    const products = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort(sortOption)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.json({
      products,
      currentPage,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      image,
      price,
      details,
      stock,
      status,
    } = req.body;

    if (!categoryId || !name || !slug || !image || price === undefined || !details) {
      return res.status(400).json({
        message: "Category, name, slug, image, price and details are required",
      });
    }

    const categoryExists = await ProductCategory.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    const existingSlug = await Product.findOne({ slug: slug.trim().toLowerCase() });
    if (existingSlug) {
      return res.status(400).json({ message: "Product slug already exists" });
    }

    const product = new Product({
      categoryId,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      image: image.trim(),
      price,
      details: details.trim(),
      stock: stock || 0,
      status: status || "active",
    });

    const savedProduct = await product.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate("categoryId", "name slug");

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      image,
      price,
      details,
      stock,
      status,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (categoryId) {
      const categoryExists = await ProductCategory.findById(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category selected" });
      }
      product.categoryId = categoryId;
    }

    if (name) product.name = name.trim();

    if (slug) {
      const existingSlug = await Product.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingSlug) {
        return res.status(400).json({ message: "Product slug already exists" });
      }

      product.slug = slug.trim().toLowerCase();
    }

    if (image) product.image = image.trim();
    if (price !== undefined) product.price = price;
    if (details) product.details = details.trim();
    if (stock !== undefined) product.stock = stock;
    if (status) product.status = status;

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("categoryId", "name slug");

    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

module.exports = router;