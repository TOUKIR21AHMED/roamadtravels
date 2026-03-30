const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// GET all packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch packages", error: error.message });
  }
});

// GET single package
router.get("/:id", async (req, res) => {
  try {
    const singlePackage = await Package.findById(req.params.id);

    if (!singlePackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(singlePackage);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch package", error: error.message });
  }
});

// POST create package
router.post("/", async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: "Failed to create package", error: error.message });
  }
});

// DELETE package
router.delete("/:id", async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete package", error: error.message });
  }
});

module.exports = router;