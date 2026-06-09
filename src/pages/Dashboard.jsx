import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { TaskContext } from "../context/TaskContext";
import { ProjectContext } from "../context/ProjectContext";
import { useSettings } from "../context/SettingsContext";

import "../styles/dashboard.css";
import "../styles/cards.css";

function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    return null;
  }
}

function Dashboard() {
  const { tasks } =
    useContext(TaskContext);

  const { projects } =
    useContext(ProjectContext);

  const navigate = useNavigate();

  const { privacy } = useSettings();

  const user = getStoredUser();

  const today = formatLocalDate(new Date());

  const todaysTasks = tasks.filter(
    (task) => task.dueDate === today
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = todaysTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(todaysTasks.length / itemsPerPage);

  const recentActivity = useMemo(() => {
    const items = [];

    tasks
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 3)
      .forEach((task) => {
        items.push({
          key: `task-${task._id}`,
          icon:
            task.status === "Completed"
              ? "bi bi-check-circle-fill icon-success"
              : "bi bi-pencil-square icon-accent",
          text:
            task.status === "Completed"
              ? `Completed "${task.title}"`
              : `Updated task "${task.title}"`,
        });
      });

    projects
      .slice(0, 2)
      .forEach((project) => {
        items.push({
          key: `project-${project._id}`,
          icon: "bi bi-folder-fill icon-folder",
          text: `Project "${project.name}" — ${project.status}`,
        });
      });

    return items.slice(0, 5);
  }, [tasks, projects]);

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
                <p>Standalone Tasks</p>
              </div>

              <div className="stat-card">
                <h3>{projects.length}</h3>
                <p>Projects</p>
              </div>

              <div className="stat-card">
                <h3>{completedTasks}</h3>
                <p>Completed Tasks</p>
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

              {todaysTasks.length === 0 ? (
                <p>No tasks due today</p>
              ) : (
                <>
                  <ul>
                    {currentTasks.map((task) => (
                      <li key={task._id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <i
                          className={
                            task.status === "Completed"
                              ? "bi bi-check-circle-fill icon-success"
                              : "bi bi-circle icon-silver"
                          }
                        ></i>
                        <i
                          className={`bi bi-flag-fill ${
                            task.priority === "High"
                              ? "icon-danger"
                              : task.priority === "Medium"
                              ? "icon-warning"
                              : "icon-success"
                          }`}
                          title={`Priority: ${task.priority || "Medium"}`}
                          style={{ marginRight: "4px" }}
                        ></i>
                        {task.title}
                      </li>
                    ))}
                  </ul>

                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}

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

                  {recentActivity.length === 0 ? (
                    <p>No recent activity yet</p>
                  ) : (
                    <ul>
                      {recentActivity.map((item) => (
                        <li key={item.key}>
                          <i className={item.icon}></i>
                          {" "}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
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
