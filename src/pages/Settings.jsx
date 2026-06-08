import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/dashboard.css";

function Settings() {
  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">

            <div className="task-card">
              <h2>Settings</h2>

              <p>🌙 Dark Mode</p>

              <p>🔔 Notifications</p>

              <p>🔒 Privacy</p>

              <p>🎨 Appearance</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;