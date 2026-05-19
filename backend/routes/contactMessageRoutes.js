const express = require("express");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);

    res.status(201).json({
      message: "Your message has been sent successfully.",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
});

module.exports = router;