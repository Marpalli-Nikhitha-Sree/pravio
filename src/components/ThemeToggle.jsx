import { useSettings } from "../context/SettingsContext";
import "../styles/dark/darkToggle.css";

function ThemeToggle({ floating = false }) {
  const { isDark, toggleTheme } = useSettings();

  return (
    <button
      type="button"
      className={`theme-toggle${floating ? " theme-toggle--floating" : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle__track">
        <span className={`theme-toggle__thumb${isDark ? " is-dark" : ""}`}>
          <i className={`bi ${isDark ? "bi-moon-fill" : "bi-sun-fill"}`} />
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;
