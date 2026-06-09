const express = require("express");

const Task = require("../models/Task");
const Project = require("../models/Project");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

const TASK_STATUSES = ["Pending", "Completed"];
const TASK_PRIORITIES = ["Low", "Medium", "High"];

function pickTaskFields(body) {
  const updates = {};

  if (body.title !== undefined) {
    updates.title = body.title;
  }

  if (body.description !== undefined) {
    updates.description = body.description;
  }

  if (
    body.status !== undefined &&
    TASK_STATUSES.includes(body.status)
  ) {
    updates.status = body.status;
  }

  if (
    body.priority !== undefined &&
    TASK_PRIORITIES.includes(body.priority)
  ) {
    updates.priority = body.priority;
  }

  if (body.dueDate !== undefined) {
    updates.dueDate = body.dueDate;
  }

  return updates;
}

router.get(
  "/calendar",
  protect,
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          userId: req.user.id,
          dueDate: {
            $ne: null,
          },
        }).sort({ dueDate: 1 });

      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error fetching calendar tasks",
      });
    }
  }
);

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          userId: req.user.id,
          projectId: null,
        });

      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error fetching tasks",
      });
    }
  }
);

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const title =
        req.body.title?.trim();

      if (!title) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      const projectId =
        req.body.projectId || null;

      if (projectId) {
        const project =
          await Project.findOne({
            _id: projectId,
            userId: req.user.id,
          });

        if (!project) {
          return res
            .status(404)
            .json({
              message:
                "Project not found",
            });
        }
      }

      const status =
        TASK_STATUSES.includes(
          req.body.status
        )
          ? req.body.status
          : "Pending";

      const priority =
        TASK_PRIORITIES.includes(
          req.body.priority
        )
          ? req.body.priority
          : "Medium";

      const task =
        await Task.create({
          title,
          description:
            req.body.description ||
            "",
          status,
          priority,
          dueDate:
            req.body.dueDate || null,
          projectId,
          userId: req.user.id,
        });

      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating task",
      });
    }
  }
);

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const updates =
        pickTaskFields(req.body);

      if (
        Object.keys(updates).length ===
        0
      ) {
        return res.status(400).json({
          message:
            "No valid fields to update",
        });
      }

      const task =
        await Task.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user.id,
          },
          updates,
          { new: true }
        );

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error updating task",
      });
    }
  }
);

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const task =
        await Task.findOneAndDelete({
          _id: req.params.id,
          userId: req.user.id,
        });

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      res.json({
        message: "Task Deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error deleting task",
      });
    }
  }
);

module.exports = router;
