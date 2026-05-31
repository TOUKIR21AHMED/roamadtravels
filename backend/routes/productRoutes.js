const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const {
  imageUpload,
  runMiddleware,
  uploadSingleImage,
} = require("../utils/uploadToCloudinary");

// GET all products
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
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// CREATE product with image upload
router.post("/", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const {
      categoryId,
      name,
      slug,
      price,
      details,
      stock,
      status,
    } = req.body;

    const cleanCategoryId = String(categoryId || "").trim();
    const cleanName = String(name || "").trim();
    const cleanSlug = String(slug || "").trim().toLowerCase();
    const cleanDetails = String(details || "").trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock || 0);

    if (!mongoose.Types.ObjectId.isValid(cleanCategoryId)) {
      return res.status(400).json({
        message: "Invalid category selected",
      });
    }

    const uploadedImage = req.file
      ? await uploadSingleImage(req.file, "roamad-travels/products")
      : null;

    const image = uploadedImage?.secure_url || "";

    if (
      !cleanCategoryId ||
      !cleanName ||
      !cleanSlug ||
      !image ||
      !Number.isFinite(parsedPrice) ||
      !cleanDetails
    ) {
      return res.status(400).json({
        message:
          "Category, name, slug, image, price and details are required",
      });
    }

    const categoryExists = await ProductCategory.findById(cleanCategoryId);

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category selected",
      });
    }

    const existingSlug = await Product.findOne({
      slug: cleanSlug,
    });

    if (existingSlug) {
      return res.status(400).json({
        message: "Product slug already exists",
      });
    }

    const product = new Product({
      categoryId: cleanCategoryId,
      name: cleanName,
      slug: cleanSlug,
      image,
      price: parsedPrice,
      details: cleanDetails,
      stock: Number.isFinite(parsedStock) ? parsedStock : 0,
      status: status || "active",
    });

    const savedProduct = await product.save();

    const populatedProduct = await Product.findById(
      savedProduct._id
    ).populate("categoryId", "name slug");

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Product create error:", error);
    console.error("Product create error message:", error.message);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    await runMiddleware(imageUpload.single("image"), req, res);

    const {
      categoryId,
      name,
      slug,
      price,
      details,
      stock,
      status,
    } = req.body;

    const cleanCategoryId = categoryId ? String(categoryId).trim() : "";
    const cleanName = name ? String(name).trim() : "";
    const cleanSlug = slug ? String(slug).trim().toLowerCase() : "";
    const cleanDetails = details ? String(details).trim() : "";
    const parsedPrice = price !== undefined ? Number(price) : undefined;
    const parsedStock = stock !== undefined ? Number(stock) : undefined;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (cleanCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(cleanCategoryId)) {
        return res.status(400).json({
          message: "Invalid category selected",
        });
      }

      const categoryExists = await ProductCategory.findById(cleanCategoryId);

      if (!categoryExists) {
        return res.status(400).json({
          message: "Invalid category selected",
        });
      }

      product.categoryId = cleanCategoryId;
    }

    if (cleanName) product.name = cleanName;

    if (cleanSlug) {
      const existingSlug = await Product.findOne({
        slug: cleanSlug,
        _id: { $ne: req.params.id },
      });

      if (existingSlug) {
        return res.status(400).json({
          message: "Product slug already exists",
        });
      }

      product.slug = cleanSlug;
    }

    if (req.file) {
      const uploadedImage = await uploadSingleImage(
        req.file,
        "roamad-travels/products"
      );

      product.image = uploadedImage?.secure_url || "";
    }

    if (parsedPrice !== undefined) {
      if (!Number.isFinite(parsedPrice)) {
        return res.status(400).json({
          message: "Price must be a valid number",
        });
      }

      product.price = parsedPrice;
    }

    if (cleanDetails) {
      product.details = cleanDetails;
    }

    if (parsedStock !== undefined) {
      if (!Number.isFinite(parsedStock)) {
        return res.status(400).json({
          message: "Stock must be a valid number",
        });
      }

      product.stock = parsedStock;
    }

    if (status) {
      product.status = status;
    }

    const updatedProduct = await product.save();

    const populatedProduct = await Product.findById(
      updatedProduct._id
    ).populate("categoryId", "name slug");

    res.json(populatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    console.error("Product update error message:", error.message);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

module.exports = router;