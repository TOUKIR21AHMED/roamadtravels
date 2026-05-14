const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      price,
      details,
      stock,
      status,
    } = req.body;

    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : "";

    if (
      !categoryId ||
      !name ||
      !slug ||
      !image ||
      price === undefined ||
      !details
    ) {
      return res.status(400).json({
        message:
          "Category, name, slug, image, price and details are required",
      });
    }

    const categoryExists = await ProductCategory.findById(categoryId);

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category selected",
      });
    }

    const existingSlug = await Product.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingSlug) {
      return res.status(400).json({
        message: "Product slug already exists",
      });
    }

    const product = new Product({
      categoryId,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      image,
      price: Number(price),
      details: details.trim(),
      stock: Number(stock || 0),
      status: status || "active",
    });

    const savedProduct = await product.save();

    const populatedProduct = await Product.findById(
      savedProduct._id
    ).populate("categoryId", "name slug");

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// UPDATE product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      price,
      details,
      stock,
      status,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (categoryId) {
      const categoryExists = await ProductCategory.findById(categoryId);

      if (!categoryExists) {
        return res.status(400).json({
          message: "Invalid category selected",
        });
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
        return res.status(400).json({
          message: "Product slug already exists",
        });
      }

      product.slug = slug.trim().toLowerCase();
    }

    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (details) {
      product.details = details.trim();
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
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