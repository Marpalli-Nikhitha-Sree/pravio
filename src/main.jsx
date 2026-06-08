import "@fontsource/poppins";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import App from "./App";
import "./styles/modal.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ProjectProvider } from "./context/ProjectContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProjectProvider>
  <TaskProvider>

    <BrowserRouter>
      <App />
    </BrowserRouter>

  </TaskProvider>
</ProjectProvider>
  </React.StrictMode>
);