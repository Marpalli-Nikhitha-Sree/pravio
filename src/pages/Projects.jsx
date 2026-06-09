import { useContext, useState } from "react";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateTaskModal from "../components/CreateTaskModal";

import { ProjectContext } from "../context/ProjectContext";
import { TaskContext } from "../context/TaskContext";

import "../styles/dashboard.css";
import "../styles/cards.css";
import "../styles/projectTaskRows.css";

function Projects() {
  const {
    projects,
    loading,
    addProject,
    deleteProject,
    updateProjectStatus,
    refreshProjects,
  } = useContext(ProjectContext);

  const {
    addTask,
    toggleTask,
    deleteTask,
    getTasksByProject,
    fetchProjectTasks,
    removeProjectTasks,
  } = useContext(TaskContext);

  const [isProjectModalOpen, setIsProjectModalOpen] =
    useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);
  const [projectName, setProjectName] =
    useState("");
  const [selectedProjectId, setSelectedProjectId] =
    useState(null);
  const [expandedProjects, setExpandedProjects] =
    useState(new Set());

  const [taskName, setTaskName] =
    useState("");
  const [priority, setPriority] =
    useState("Medium");
  const [dueDate, setDueDate] =
    useState("");

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    await addProject({
      name: projectName,
      status: "In Progress",
    });

    setProjectName("");
    setIsProjectModalOpen(false);
    refreshProjects();
  };

  const handleCreateTask = async () => {
    if (!taskName.trim()) return;

    await addTask({
      title: taskName,
      completed: false,
      priority,
      dueDate,
      projectId: selectedProjectId,
    });

    setTaskName("");
    setPriority("Medium");
    setDueDate("");
    setIsTaskModalOpen(false);
    refreshProjects();
  };

  const toggleProjectExpand = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    const isExpanding = !newExpanded.has(projectId);

    if (isExpanding) {
      newExpanded.add(projectId);
      fetchProjectTasks(projectId);
    } else {
      newExpanded.delete(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleTaskToggle = async (taskId) => {
    await toggleTask(taskId);
    refreshProjects();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    await deleteTask(taskId);
    refreshProjects();
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;

    await deleteProject(projectId);
    removeProjectTasks(projectId);
    refreshProjects();
  };

  if (loading) {
    return (
      <>
        <FluidBackground />
        <div className="dashboard-layout">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <div className="dashboard-content">
              <p>Loading projects...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">
            <div className="task-card">
              <div className="task-card-header">
                <h2>
                  <i className="bi bi-folder-fill icon-folder"></i>
                  Projects
                </h2>

                <button
                  className="create-project-btn"
                  onClick={() =>
                    setIsProjectModalOpen(
                      true
                    )
                  }
                >
                  <i className="bi bi-folder-plus icon-accent"></i>
                  New Project
                </button>
              </div>

              {projects.length === 0 ? (
                <p>No Projects Yet</p>
              ) : (
                projects.map((project) => {
                  const projectTasks =
                    getTasksByProject(
                      project._id
                    );
                  const isExpanded =
                    expandedProjects.has(
                      project._id
                    );

                  return (
                    <div
                      key={project._id}
                      className="project-card"
                    >
                      <div className="project-header">
                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "10px",
                              marginBottom:
                                "8px",
                            }}
                          >
                            <i className="bi bi-folder-fill icon-folder"></i>
                            <strong>
                              {
                                project.name
                              }
                            </strong>
                            <button
                              className="icon-btn"
                              onClick={() =>
                                toggleProjectExpand(
                                  project._id
                                )
                              }
                            >
                              <i
                                className={`bi bi-chevron-${
                                  isExpanded
                                    ? "up"
                                    : "down"
                                }`}
                              ></i>
                            </button>
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "15px",
                              fontSize:
                                "0.9rem",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap:
                                  "5px",
                              }}
                            >
                              <i className="bi bi-check2-circle icon-success"></i>
                              <span>
                                {
                                  project.completedTaskCount
                                }
                                /
                                {
                                  project.taskCount
                                }{" "}
                                tasks
                              </span>
                            </div>

                            <div
                              style={{
                                flex: 1,
                                maxWidth:
                                  "200px",
                              }}
                            >
                              <div
                                style={{
                                  height:
                                    "8px",
                                  backgroundColor:
                                    "#e5e7eb",
                                  borderRadius:
                                    "4px",
                                  overflow:
                                    "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height:
                                      "100%",
                                    width: `${project.progress}%`,
                                    backgroundColor:
                                      project.progress ===
                                      100
                                        ? "#10b981"
                                        : "#6366f1",
                                    transition:
                                      "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                              <span
                                style={{
                                  fontSize:
                                    "0.8rem",
                                  color:
                                    "#6b7280",
                                }}
                              >
                                {
                                  project.progress
                                }
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "10px",
                            alignItems:
                              "center",
                          }}
                        >
                          <select
                            className="project-select"
                            value={
                              project.status
                            }
                            onChange={(
                              e
                            ) =>
                              updateProjectStatus(
                                project._id,
                                e.target
                                  .value
                              )
                            }
                          >
                            <option>
                              To Do
                            </option>
                            <option>
                              In Progress
                            </option>
                            <option>
                              Completed
                            </option>
                          </select>

                          <button
                            className="icon-btn"
                            onClick={() => {
                              setSelectedProjectId(
                                project._id
                              );
                              setIsTaskModalOpen(
                                true
                              );
                            }}
                          >
                            <i className="bi bi-plus-circle icon-accent"></i>
                          </button>

                          <button
                            className="icon-btn"
                            onClick={() =>
                              handleDeleteProject(
                                project._id
                              )
                            }
                          >
                            <i className="bi bi-trash3 icon-danger"></i>
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="project-tasks">
                          {projectTasks.length ===
                          0 ? (
                            <p
                              style={{
                                fontSize:
                                  "0.9rem",
                                color:
                                  "#6b7280",
                                padding:
                                  "10px 0",
                              }}
                            >
                              No tasks in this
                              project
                            </p>
                          ) : (
                            projectTasks.map(
                              (task) => (
                                <div
                                  key={
                                    task._id
                                  }
                                  className="task-row"
                                >
                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      gap:
                                        "10px",
                                      flex: 1,
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        task.status ===
                                        "Completed"
                                      }
                                      onChange={() =>
                                        handleTaskToggle(
                                          task._id
                                        )
                                      }
                                    />

                                    <i
                                      className={`bi bi-flag-fill ${
                                        task.priority ===
                                        "High"
                                          ? "icon-danger"
                                          : task.priority ===
                                            "Medium"
                                          ? "icon-warning"
                                          : "icon-success"
                                      }`}
                                      title={`Priority: ${task.priority}`}
                                    ></i>

                                    <span
                                      style={{
                                        textDecoration:
                                          task.status ===
                                          "Completed"
                                            ? "line-through"
                                            : "none",
                                        opacity:
                                          task.status ===
                                          "Completed"
                                            ? 0.7
                                            : 1,
                                      }}
                                    >
                                      {
                                        task.title
                                      }
                                    </span>
                                  </div>

                                  <button
                                    className="icon-btn"
                                    onClick={() =>
                                      handleDeleteTask(
                                        task._id
                                      )
                                    }
                                  >
                                    <i className="bi bi-trash3 icon-danger"></i>
                                  </button>
                                </div>
                              )
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        projectName={projectName}
        setProjectName={setProjectName}
        onClose={() =>
          setIsProjectModalOpen(
            false
          )
        }
        onCreate={handleCreateProject}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        taskName={taskName}
        setTaskName={setTaskName}
        priority={priority}
        setPriority={setPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        onClose={() =>
          setIsTaskModalOpen(
            false
          )
        }
        onCreate={handleCreateTask}
      />
    </>
  );
}

export default Projects;