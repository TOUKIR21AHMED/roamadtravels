const express = require("express");
const EventRequest = require("../models/EventRequest");

const router = express.Router();

// CREATE REQUEST
router.post("/", async (req, res) => {
  try {
    const request = await EventRequest.create(req.body);
    res.status(201).json({
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Request submit failed",
      error: error.message,
    });
  }
});

// GET ALL REQUESTS FOR ADMIN
router.get("/", async (req, res) => {
  try {
    const requests = await EventRequest.find()
      .populate("eventPackageId", "title slug")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Requests fetch failed",
      error: error.message,
    });
  }
});

// UPDATE REQUEST STATUS
router.put("/:id", async (req, res) => {
  try {
    const request = await EventRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: "Request update failed",
      error: error.message,
    });
  }
});

// DELETE REQUEST
router.delete("/:id", async (req, res) => {
  try {
    const request = await EventRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Request delete failed",
      error: error.message,
    });
  }
});

module.exports = router;