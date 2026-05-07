const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const {
  verifyToken,
  verifyRole,
} = require("../middleware/authMiddleware");

const router = express.Router();


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      "SECRET_KEY",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      admin,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});


// CREATE ADMIN
router.post(
  "/create-admin",
  verifyToken,
  verifyRole("super_admin"),
  async (req, res) => {
    try {
      const { name, username, password, role } =
        req.body;

      const existing = await Admin.findOne({
        username,
      });

      if (existing) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const admin = new Admin({
        name,
        username,
        password: hashedPassword,
        role,
      });

      await admin.save();

      res.json({
        message: "Admin created",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
router.post("/create-super-admin", async (req, res) => {
  try {

    const existing = await Admin.findOne({
      username: "superadmin",
    });

    if (existing) {
      return res.json({
        message: "Super admin already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      name: "Super Admin",
      username: "superadmin",
      password: hashedPassword,
      role: "super_admin",
    });

    await admin.save();

    res.json({
      message: "Super admin created",
    });

  } catch (error) {

    res.status(500).json(error);

  }
});
// GET ALL ADMINS
router.get(
  "/admins",
  verifyToken,
  verifyRole("super_admin"),
  async (req, res) => {
    try {
      const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
      res.json(admins);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// DELETE ADMIN
router.delete(
  "/admins/:id",
  verifyToken,
  verifyRole("super_admin"),
  async (req, res) => {
    try {
      if (req.admin.id === req.params.id) {
        return res.status(400).json({
          message: "You cannot delete your own account",
        });
      }

      await Admin.findByIdAndDelete(req.params.id);

      res.json({
        message: "Admin deleted successfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
// UPDATE ADMIN
router.put(
  "/admins/:id",
  verifyToken,
  verifyRole("super_admin"),
  async (req, res) => {
    try {
      const { name, username, role, password } = req.body;

      const updateData = {
        name,
        username,
        role,
      };

      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await Admin.findByIdAndUpdate(req.params.id, updateData);

      res.json({
        message: "Admin updated successfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);


module.exports = router;