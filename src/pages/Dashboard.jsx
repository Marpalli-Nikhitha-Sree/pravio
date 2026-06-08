import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { TaskContext } from "../context/TaskContext";
import { ProjectContext } from "../context/ProjectContext";

import "../styles/cards.css";

function Dashboard() {
  const { tasks } =
    useContext(TaskContext);

  const { projects } =
    useContext(ProjectContext);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const completedProjects =
    projects.filter(
      (project) =>
        project.status === "Completed"
    ).length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );

  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">

            <div className="stats-grid">

              <div className="stat-card">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>

              <div className="stat-card">
                <h3>{projects.length}</h3>
                <p>Projects</p>
              </div>

              <div className="stat-card">
                <h3>{completedTasks}</h3>
                <p>Completed</p>
              </div>

              <div className="stat-card">
                <h3>{completedProjects}</h3>
                <p>Completed Projects</p>
              </div>

            </div>

            <div className="welcome-card">

              <h1>
                <i className="bi bi-stars"></i>
                {" "}
                Welcome Back,
                {" "}
                {user?.name || "User"}
              </h1>

              <p>
                Stay focused and keep progressing.
              </p>

              <br />

              <h3>
                Progress: {progress}%
              </h3>

              <div
                style={{
                  width: "100%",
                  height: "12px",
                  background:
                    "rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(to right,#4ade80,#22c55e)",
                    transition:
                      "0.4s ease",
                  }}
                />
              </div>

            </div>

            <div className="task-card">

              <h2>
                Today's Tasks
              </h2>

              <ul>

                {tasks
                  .slice(0, 5)
                  .map((task) => (
                    <li key={task._id}>
                      <i
                        className={
                          task.status ===
                          "Completed"
                            ? "bi bi-check-circle-fill"
                            : "bi bi-circle"
                        }
                        style={{
                          marginRight:
                            "8px",
                        }}
                      ></i>

                      {task.title}
                    </li>
                  ))}

              </ul>

            </div>

            <div className="activity-card">

              <div className="quick-card">

                <h2>
                  Quick Actions
                </h2>

                <button
                  onClick={() =>
                    navigate("/tasks")
                  }
                >
                  <i className="bi bi-plus-circle"></i>
                  {" "}
                  Create Task
                </button>

                <button
                  onClick={() =>
                    navigate("/projects")
                  }
                >
                  <i className="bi bi-folder-plus"></i>
                  {" "}
                  Create Project
                </button>

                <button
                  onClick={() =>
                    navigate("/calendar")
                  }
                >
                  <i className="bi bi-calendar-event"></i>
                  {" "}
                  Open Calendar
                </button>

              </div>

              <h2>
                Recent Activity
              </h2>

              <ul>

                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  {" "}
                  Finished Homepage Design
                </li>

                <li>
                  <i className="bi bi-pencil-square"></i>
                  {" "}
                  Added New Task
                </li>

                <li>
                  <i className="bi bi-folder-fill"></i>
                  {" "}
                  Created Project "Pravio"
                </li>

                <li>
                  <i className="bi bi-bullseye"></i>
                  {" "}
                  Completed Daily Goal
                </li>

              </ul>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;