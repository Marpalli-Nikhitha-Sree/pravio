import "./themeInit.js";
import "./settingsInit.js";
import "@fontsource/poppins";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import { SettingsProvider } from "./context/SettingsContext";
import App from "./App";
import "./styles/modal.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ProjectProvider } from "./context/ProjectContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider>
      <ProjectProvider>
        <TaskProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TaskProvider>
      </ProjectProvider>
    </SettingsProvider>
  </React.StrictMode>
);