const express = require("express");

const Task = require("../models/Task");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/",
  protect,
  async (req, res) => {
    const tasks =
      await Task.find({
        userId: req.user.id,
      });

    res.json(tasks);
  }
);

router.post(
  "/",
  protect,
  async (req, res) => {
    const task =
      await Task.create({
        title: req.body.title,
        description:
          req.body.description,
        status: req.body.status,
        userId: req.user.id,
      });

    res.json(task);
  }
);

router.put(
  "/:id",
  protect,
  async (req, res) => {
    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(task);
  }
);

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Task Deleted",
    });
  }
);

module.exports = router;