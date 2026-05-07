const express = require("express");
const nodemailer = require("nodemailer");
const Inquiry = require("../models/Inquiry");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    try {
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

        await transporter.sendMail({
          from: `"Roamad Travels" <${process.env.SMTP_EMAIL}>`,
          to: process.env.ADMIN_EMAIL || "roamad@gmail.com",
          subject: `New ${req.body.type} inquiry from ${req.body.name}`,
          html: `
            <h2>New ${req.body.type} inquiry</h2>
            <p><b>Name:</b> ${req.body.name}</p>
            <p><b>Email:</b> ${req.body.email}</p>
            <p><b>Phone:</b> ${req.body.phone || "N/A"}</p>
            <p><b>Destination:</b> ${req.body.destination || "N/A"}</p>
            <p><b>Travel Date:</b> ${req.body.travelDate || "N/A"}</p>
            <p><b>Message:</b> ${req.body.message || "N/A"}</p>
          `,
        });
      }
    } catch (mailError) {
      console.log("Email sending failed:", mailError.message);
    }

    res.json({
      message: "Your request has been submitted successfully.",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit request",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
});

module.exports = router;