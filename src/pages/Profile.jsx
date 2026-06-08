import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/dashboard.css";

function Profile() {
  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">

            <div className="task-card">
              <h2>Profile</h2>

              <p>Name: Nikhitha</p>

              <p>Email: user@example.com</p>

              <p>Role: Student</p>

              <p>Member Since: 2025</p>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;