import { useState } from "react";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSettings } from "../context/SettingsContext";

import "../styles/dashboard.css";
import "../styles/cards.css";
import "../styles/settings.css";

const TEXT_SIZES = ["small", "medium", "large"];
const TEXT_SIZE_LABELS = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

function TextSizeControl({ value, onChange }) {
  const currentIndex = TEXT_SIZES.indexOf(value);

  return (
    <div className="text-size-control">
      <button
        type="button"
        className="text-size-btn"
        aria-label="Decrease text size"
        disabled={currentIndex === 0}
        onClick={() => onChange(TEXT_SIZES[currentIndex - 1])}
      >
        <i className="bi bi-dash-lg"></i>
      </button>

      <span className="text-size-label">
        {TEXT_SIZE_LABELS[value]}
      </span>

      <button
        type="button"
        className="text-size-btn"
        aria-label="Increase text size"
        disabled={currentIndex === TEXT_SIZES.length - 1}
        onClick={() => onChange(TEXT_SIZES[currentIndex + 1])}
      >
        <i className="bi bi-plus-lg"></i>
      </button>
    </div>
  );
}

function SettingRow({ icon, iconClass, title, description, checked, onChange }) {
  return (
    <div className="settings-item">
      <div className="settings-item__info">
        <i className={`bi ${icon} ${iconClass}`}></i>
        <div className="settings-item__text">
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>

      <label className="settings-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="settings-switch__slider"></span>
      </label>
    </div>
  );
}

function Settings() {
  const {
    isDark,
    setTheme,
    notifications,
    privacy,
    appearance,
    updateNotifications,
    updatePrivacy,
    updateAppearance,
  } = useSettings();

  const [savedHint, setSavedHint] = useState(false);

  const showSaved = () => {
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2500);
  };

  const handleToggle = (updater) => (value) => {
    updater(value);
    showSaved();
  };

  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">
            <div className="task-card">
              <h2>
                <i className="bi bi-gear-fill icon-accent"></i>
                Settings
              </h2>

              <div className="settings-section">
                <h3>
                  <i className="bi bi-moon-stars icon-theme"></i>
                  Theme
                </h3>

                <SettingRow
                  icon="bi-moon-stars-fill"
                  iconClass="icon-theme"
                  title="Dark mode"
                  description="Switch between light and dark color schemes."
                  checked={isDark}
                  onChange={(value) => {
                    setTheme(value ? "dark" : "light");
                    showSaved();
                  }}
                />
              </div>

              <div className="settings-section">
                <h3>
                  <i className="bi bi-bell-fill icon-notify"></i>
                  Notifications
                </h3>

                <SettingRow
                  icon="bi-alarm-fill"
                  iconClass="icon-notify"
                  title="Task reminders"
                  description="Get notified when tasks are due soon."
                  checked={notifications.taskReminders}
                  onChange={handleToggle((value) =>
                    updateNotifications("taskReminders", value)
                  )}
                />

                <SettingRow
                  icon="bi-folder-symlink-fill"
                  iconClass="icon-folder"
                  title="Project updates"
                  description="Receive alerts when project status changes."
                  checked={notifications.projectUpdates}
                  onChange={handleToggle((value) =>
                    updateNotifications("projectUpdates", value)
                  )}
                />

                <SettingRow
                  icon="bi-envelope-fill"
                  iconClass="icon-accent"
                  title="Email alerts"
                  description="Send summary updates to your email."
                  checked={notifications.emailAlerts}
                  onChange={handleToggle((value) =>
                    updateNotifications("emailAlerts", value)
                  )}
                />
              </div>

              <div className="settings-section">
                <h3>
                  <i className="bi bi-shield-lock-fill icon-privacy"></i>
                  Privacy
                </h3>

                <SettingRow
                  icon="bi-person-badge-fill"
                  iconClass="icon-privacy"
                  title="Show profile"
                  description="Allow others to view your profile details."
                  checked={privacy.showProfile}
                  onChange={handleToggle((value) =>
                    updatePrivacy("showProfile", value)
                  )}
                />

                <SettingRow
                  icon="bi-activity"
                  iconClass="icon-silver"
                  title="Show activity"
                  description="Display your recent activity on the dashboard."
                  checked={privacy.showActivity}
                  onChange={handleToggle((value) =>
                    updatePrivacy("showActivity", value)
                  )}
                />
              </div>

              <div className="settings-section">
                <h3>
                  <i className="bi bi-palette-fill icon-appearance"></i>
                  Appearance
                </h3>

                <div className="settings-item">
                  <div className="settings-item__info">
                    <i className="bi bi-type icon-appearance"></i>
                    <div className="settings-item__text">
                      <strong>Text size</strong>
                      <p>
                        Make interface text smaller or larger across the app.
                      </p>
                    </div>
                  </div>

                  <TextSizeControl
                    value={appearance.textSize}
                    onChange={(size) => {
                      updateAppearance("textSize", size);
                      showSaved();
                    }}
                  />
                </div>

                <SettingRow
                  icon="bi-pause-circle-fill"
                  iconClass="icon-warning"
                  title="Reduce motion"
                  description="Minimize background animations and transitions."
                  checked={appearance.reduceMotion}
                  onChange={handleToggle((value) =>
                    updateAppearance("reduceMotion", value)
                  )}
                />
              </div>

              {savedHint && (
                <div className="settings-saved">
                  <i className="bi bi-check-circle-fill icon-success"></i>
                  Settings saved
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
