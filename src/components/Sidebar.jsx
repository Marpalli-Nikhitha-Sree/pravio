import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">

      <h2 className="logo">
      <i className="bi bi-water"></i>
        {" "}
        PRAVIO
      </h2>

      <ul>

        <li>
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-house-fill"></i>
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/projects"
            className={
              location.pathname === "/projects"
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-folder-fill"></i>
            Projects
          </Link>
        </li>

        <li>
          <Link
            to="/calendar"
            className={
              location.pathname === "/calendar"
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-calendar-event-fill"></i>
            Calendar
          </Link>
        </li>

        <li>
          <Link
            to="/tasks"
            className={
              location.pathname === "/tasks"
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-check2-square"></i>
            Tasks
          </Link>
        </li>

        <li>
          <Link
            to="/profile"
            className={
              location.pathname === "/profile"
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-person-circle"></i>
            Profile
          </Link>
        </li>

        <li>
          <Link
            to="/settings"
            className={
              location.pathname === "/settings"
                ? "active-link"
                : ""
            }
          >
            <i className="bi bi-gear-fill"></i>
            Settings
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;