import { useContext, useState } from "react";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateProjectModal from "../components/CreateProjectModal";

import { ProjectContext } from "../context/ProjectContext";

import "../styles/dashboard.css";
import "../styles/projectTaskRows.css";

function Projects() {
  const {
    projects,
    addProject,
    deleteProject,
    updateProjectStatus,
  } = useContext(ProjectContext);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [projectName, setProjectName] =
    useState("");

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    addProject({
      id: Date.now(),
      name: projectName,
      status: "In Progress",
    });

    setProjectName("");
    setIsModalOpen(false);
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

              <button
                className="create-project-btn"
                onClick={() =>
                  setIsModalOpen(true)
                }
              >
                <i className="bi bi-folder-plus"></i>
                New Project
              </button>

              <h2>
                <i className="bi bi-folder-fill"></i>
                Projects
              </h2>

              {projects.length === 0 ? (
                <p>No Projects Yet</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="project-row"
                  >
                    <div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <i
                          className="bi bi-folder-fill"
                          style={{
                            color: "#00a7c7",
                          }}
                        ></i>

                        <strong>
                          {project.name}
                        </strong>
                      </div>

                      <select
                        className="project-select"
                        value={
                          project.status
                        }
                        onChange={(e) =>
                          updateProjectStatus(
                            project.id,
                            e.target.value
                          )
                        }
                      >
                        <option>
                          To Do
                        </option>

                        <option>
                          In Progress
                        </option>

                        <option>
                          Completed
                        </option>
                      </select>

                    </div>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        deleteProject(
                          project.id
                        )
                      }
                    >
                      <i className="bi bi-trash3"></i>
                    </button>

                  </div>
                ))
              )}

            </div>

          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        projectName={projectName}
        setProjectName={setProjectName}
        onClose={() =>
          setIsModalOpen(false)
        }
        onCreate={handleCreateProject}
      />
    </>
  );
}

export default Projects;