const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "Member",
    bio: user.bio || "",
    createdAt: user.createdAt,
  };
}

router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      const userExists =
        await User.findOne({
          email,
        });

      if (userExists) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        });

      res.status(201).json({
        message:
          "User Registered",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.post(
  "/login",
  async (req, res) => {
    try {
      const {
  name,
  email,
  password,
} = req.body;

console.log(req.body);

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              "User not found",
          });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            message:
              "Wrong Password",
          });
      }

      const token =
        jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        token,
        user: formatUser(user),
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.get(
  "/profile",
  protect,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(formatUser(user));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.put(
  "/profile",
  protect,
  async (req, res) => {
    try {
      const { name, role, bio } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (name?.trim()) {
        user.name = name.trim();
      }

      if (role !== undefined) {
        user.role = role.trim() || "Member";
      }

      if (bio !== undefined) {
        user.bio = bio.trim();
      }

      await user.save();

      const updatedUser = formatUser(user);

      res.json({
        message: "Profile updated",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.put(
  "/password",
  protect,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Please fill all password fields",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters",
        });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(
        newPassword,
        salt
      );

      await user.save();

      res.json({
        message: "Password updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;