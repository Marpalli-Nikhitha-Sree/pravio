import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
  <div className="navbar">

    <h2 className="logo">
      <i className="bi bi-water"></i>
      PRAVIO
    </h2>

    <div className="nav-right">

      <div className="user-badge">
        <i className="bi bi-person-circle"></i>
        <span>Nikhitha</span>
      </div>

      <button
        className="create-project-btn"
        onClick={logout}
      >
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>

    </div>

  </div>
);
}

export default Navbar;