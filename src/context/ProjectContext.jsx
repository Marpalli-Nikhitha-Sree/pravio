import {
  createContext,
  useState,
  useEffect,
} from "react";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {

  const [projects, setProjects] = useState(() => {
    const savedProjects =
      localStorage.getItem("projects");

    return savedProjects
      ? JSON.parse(savedProjects)
      : [];
  });

  const addProject = (project) => {
    setProjects([
      ...projects,
      project,
    ]);
  };

  const deleteProject = (id) => {
    setProjects(
      projects.filter(
        (project) => project.id !== id
      )
    );
  };
  const updateProjectStatus = (
  id,
  status
) => {
  setProjects(
    projects.map((project) =>
      project.id === id
        ? {
            ...project,
            status,
          }
        : project
    )
  );
};

  useEffect(() => {
    localStorage.setItem(
      "projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        deleteProject,
        updateProjectStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}