const express = require("express");

const Project = require("../models/Project");
const Task = require("../models/Task");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const projects =
        await Project.find({
          userId: req.user.id,
        }).sort({ createdAt: -1 });

      // Add task counts to each project
      const projectsWithCounts =
        await Promise.all(
          projects.map(
            async (project) => {
              const tasks =
                await Task.find({
                  projectId:
                    project._id,
                });

              const completedTasks =
                tasks.filter(
                  (task) =>
                    task.status ===
                    "Completed"
                ).length;

              return {
                ...project.toObject(),
                taskCount: tasks.length,
                completedTaskCount:
                  completedTasks,
                progress:
                  tasks.length > 0
                    ? Math.round(
                        (completedTasks /
                          tasks.length) *
                          100
                      )
                    : 0,
              };
            }
          )
        );

      res.json(projectsWithCounts);
    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching projects",
        error: error.message,
      });
    }
  }
);

router.get(
  "/:id/tasks",
  protect,
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          projectId:
            req.params.id,
          userId: req.user.id,
        }).sort({ createdAt: -1 });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching project tasks",
        error: error.message,
      });
    }
  }
);

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const project =
        await Project.create({
          name: req.body.name,
          description:
            req.body.description ||
            "",
          status:
            req.body.status ||
            "In Progress",
          color:
            req.body.color ||
            "#6366f1",
          dueDate:
            req.body.dueDate ||
            null,
          userId: req.user.id,
        });

      res.json(project);
    } catch (error) {
      res.status(500).json({
        message:
          "Error creating project",
        error: error.message,
      });
    }
  }
);

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const project =
        await Project.findByIdAndUpdate(
          req.params.id,
          req.body,
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

      res.json(project);
    } catch (error) {
      res.status(500).json({
        message:
          "Error updating project",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      // Delete all tasks associated with the project
      await Task.deleteMany({
        projectId: req.params.id,
      });

      // Delete the project
      await Project.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Project and associated tasks deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Error deleting project",
        error: error.message,
      });
    }
  }
);

module.exports = router;
