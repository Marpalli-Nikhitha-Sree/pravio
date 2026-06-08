import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "null");
        setUserName(stored?.name || "User");
      } catch {
        setUserName("User");
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("profileupdate", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("profileupdate", syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
  <div className="navbar">

    <h2 className="logo">
      <i className="bi bi-water icon-accent"></i>
      PRAVIO
    </h2>

    <div className="nav-right">

      <ThemeToggle />

      <button
        type="button"
        className="user-badge"
        onClick={() => navigate("/profile")}
      >
        <i className="bi bi-person-circle icon-accent"></i>
        <span>{userName}</span>
      </button>

      <button
        className="create-project-btn"
        onClick={logout}
      >
        <i className="bi bi-box-arrow-right icon-danger"></i>
        Logout
      </button>

    </div>

  </div>
);
}

export default Navbar;