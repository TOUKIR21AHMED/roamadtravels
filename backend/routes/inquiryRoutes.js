const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const Inquiry = require("../models/Inquiry");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/inquiries");
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
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post("/", upload.array("documents", 10), async (req, res) => {
  try {
    const uploadedDocuments = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          path: `/uploads/inquiries/${file.filename}`,
          mimetype: file.mimetype,
        }))
      : [];

    const inquiry = await Inquiry.create({
      ...req.body,
      documents: uploadedDocuments,
    });

    try {
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 2525,
          secure: false,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });

        await transporter.sendMail({
          from: `"Roamad Travels" <${process.env.SMTP_EMAIL}>`,
          to: process.env.ADMIN_EMAIL || "roamad@gmail.com",
          subject: `New ${req.body.type} inquiry from ${req.body.name}`,
          html: `
            <h2>New ${req.body.type} inquiry</h2>
            <p><b>Trip Type:</b> ${req.body.tripType || "N/A"}</p>
            <p><b>Name:</b> ${req.body.name || "N/A"}</p>
            <p><b>Email:</b> ${req.body.email || "N/A"}</p>
            <p><b>Phone:</b> ${req.body.phone || "N/A"}</p>
            <p><b>From:</b> ${req.body.from || "N/A"}</p>
            <p><b>Destination:</b> ${req.body.destination || "N/A"}</p>
            <p><b>Travel Date:</b> ${req.body.travelDate || "N/A"}</p>
            <p><b>Return Date:</b> ${req.body.returnDate || "N/A"}</p>
            <p><b>Message:</b> ${req.body.message || "N/A"}</p>
            <p><b>Documents:</b> ${uploadedDocuments.length} file(s) uploaded</p>
          `,
          attachments: uploadedDocuments.map((doc) => ({
            filename: doc.originalName,
            path: path.join(__dirname, "..", doc.path),
          })),
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
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "booked", "canceled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found",
      });
    }

    res.json({
      message: "Status updated successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
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