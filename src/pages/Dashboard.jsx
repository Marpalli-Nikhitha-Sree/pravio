import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { TaskContext } from "../context/TaskContext";
import { ProjectContext } from "../context/ProjectContext";
import { useSettings } from "../context/SettingsContext";

import "../styles/dashboard.css";
import "../styles/cards.css";
function Dashboard() {
  const { tasks } =
    useContext(TaskContext);

  const { projects } =
    useContext(ProjectContext);

  const navigate = useNavigate();

  const { privacy } = useSettings();

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
                <i className="bi bi-stars icon-accent"></i>
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

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

            </div>

            <div className="task-card">

              <h2>
                <i className="bi bi-check2-square icon-accent"></i>
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
                            ? "bi bi-check-circle-fill icon-success"
                            : "bi bi-circle icon-silver"
                        }
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
                  <i className="bi bi-plus-circle icon-accent"></i>
                  {" "}
                  Create Task
                </button>

                <button
                  onClick={() =>
                    navigate("/projects")
                  }
                >
                  <i className="bi bi-folder-plus icon-folder"></i>
                  {" "}
                  Create Project
                </button>

                <button
                  onClick={() =>
                    navigate("/calendar")
                  }
                >
                  <i className="bi bi-calendar-event icon-accent"></i>
                  {" "}
                  Open Calendar
                </button>

              </div>

              {privacy.showActivity ? (
                <>
                  <h2>
                    Recent Activity
                  </h2>

                  <ul>
                    <li>
                      <i className="bi bi-check-circle-fill icon-success"></i>
                      {" "}
                      Finished Homepage Design
                    </li>

                    <li>
                      <i className="bi bi-pencil-square icon-accent"></i>
                      {" "}
                      Added New Task
                    </li>

                    <li>
                      <i className="bi bi-folder-fill icon-folder"></i>
                      {" "}
                      Created Project "Pravio"
                    </li>

                    <li>
                      <i className="bi bi-bullseye icon-warning"></i>
                      {" "}
                      Completed Daily Goal
                    </li>
                  </ul>
                </>
              ) : (
                <p className="settings-private-note">
                  <i className="bi bi-shield-lock-fill icon-privacy"></i>
                  Recent activity is hidden based on your privacy settings.
                </p>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;