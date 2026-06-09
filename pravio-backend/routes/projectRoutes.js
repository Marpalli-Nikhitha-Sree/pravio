const express = require("express");
const mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");
const { enrichProject } = require("../utils/projectHelpers");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

const PROJECT_STATUSES = [
  "To Do",
  "In Progress",
  "Completed",
];

function pickProjectFields(body) {
  const updates = {};

  if (body.name?.trim()) {
    updates.name = body.name.trim();
  }

  if (body.description !== undefined) {
    updates.description = body.description;
  }

  if (
    body.status !== undefined &&
    PROJECT_STATUSES.includes(body.status)
  ) {
    updates.status = body.status;
  }

  if (body.color !== undefined) {
    updates.color = body.color;
  }

  if (body.dueDate !== undefined) {
    updates.dueDate = body.dueDate;
  }

  return updates;
}

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const projects =
        await Project.find({
          userId: req.user.id,
        }).sort({ createdAt: -1 });

      const projectsWithCounts =
        await Promise.all(
          projects.map(enrichProject)
        );

      res.json(projectsWithCounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Error fetching projects",
      });
    }
  }
);

router.get(
  "/:id/tasks",
  protect,
  async (req, res) => {
    try {
      const project =
        await Project.findOne({
          _id: req.params.id,
          userId: req.user.id,
        });

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const tasks =
        await Task.find({
          projectId:
            req.params.id,
          userId: req.user.id,
        }).sort({ createdAt: -1 });

      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Error fetching project tasks",
      });
    }
  }
);

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const name =
        req.body.name?.trim();

      if (!name) {
        return res.status(400).json({
          message: "Project name is required",
        });
      }

      const status =
        PROJECT_STATUSES.includes(
          req.body.status
        )
          ? req.body.status
          : "In Progress";

      const project =
        await Project.create({
          name,
          description:
            req.body.description ||
            "",
          status,
          color:
            req.body.color ||
            "#6366f1",
          dueDate:
            req.body.dueDate ||
            null,
          userId: req.user.id,
        });

      res.json(
        await enrichProject(project)
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Error creating project",
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
        pickProjectFields(req.body);

      if (
        Object.keys(updates).length ===
        0
      ) {
        return res.status(400).json({
          message:
            "No valid fields to update",
        });
      }

      const project =
        await Project.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user.id,
          },
          updates,
          { new: true }
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      res.json(
        await enrichProject(project)
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Error updating project",
      });
    }
  }
);

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    const session =
      await mongoose.startSession();

    try {
      let deleted = false;

      await session.withTransaction(
        async () => {
          const project =
            await Project.findOne({
              _id: req.params.id,
              userId: req.user.id,
            }).session(session);

          if (!project) {
            return;
          }

          await Task.deleteMany(
            {
              projectId:
                req.params.id,
              userId: req.user.id,
            },
            { session }
          );

          await Project.deleteOne(
            {
              _id: req.params.id,
              userId: req.user.id,
            },
            { session }
          );

          deleted = true;
        }
      );

      if (!deleted) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      res.json({
        message:
          "Project and associated tasks deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Error deleting project",
      });
    } finally {
      await session.endSession();
    }
  }
);

module.exports = router;
