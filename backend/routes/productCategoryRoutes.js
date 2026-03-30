const express = require("express");
const router = express.Router();
const ProductCategory = require("../models/ProductCategory");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await ProductCategory.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error: error.message });
  }
});

// POST create category
router.post("/", async (req, res) => {
  try {
    const { name, slug, status } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const existingName = await ProductCategory.findOne({ name: name.trim() });
    if (existingName) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const existingSlug = await ProductCategory.findOne({ slug: slug.trim().toLowerCase() });
    if (existingSlug) {
      return res.status(400).json({ message: "Category slug already exists" });
    }

    const category = new ProductCategory({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      status: status || "active",
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  try {
    const { name, slug, status } = req.body;

    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      const existingName = await ProductCategory.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });
      if (existingName) {
        return res.status(400).json({ message: "Category name already exists" });
      }
      category.name = name.trim();
    }

    if (slug) {
      const existingSlug = await ProductCategory.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (existingSlug) {
        return res.status(400).json({ message: "Category slug already exists" });
      }
      category.slug = slug.trim().toLowerCase();
    }

    if (status) {
      category.status = status;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await ProductCategory.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
});

module.exports = router;