const Task = require("../models/Task");

async function enrichProject(project) {
  const tasks = await Task.find({
    projectId: project._id,
  });

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return {
    ...project.toObject(),
    taskCount: tasks.length,
    completedTaskCount: completedTasks,
    progress:
      tasks.length > 0
        ? Math.round(
            (completedTasks / tasks.length) * 100
          )
        : 0,
  };
}

module.exports = { enrichProject };
