import {
  createContext,
  useState,
  useEffect,
} from "react";

import { projectService } from "../services/projectService";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();

    const interval = setInterval(() => {
      fetchProjects();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const data =
        await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      const newProject =
        await projectService.createProject(
          projectData
        );
      setProjects([
        newProject,
        ...projects,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(
        id
      );
      setProjects(
        projects.filter(
          (project) =>
            project._id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateProjectStatus = async (
    id,
    status
  ) => {
    try {
      const updatedProject =
        await projectService.updateProject(
          id,
          { status }
        );
      setProjects(
        projects.map((project) =>
          project._id === id
            ? updatedProject
            : project
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const refreshProjects = () => {
    fetchProjects();
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        addProject,
        deleteProject,
        updateProjectStatus,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}