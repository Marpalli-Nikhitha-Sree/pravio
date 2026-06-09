import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { getToken } from "../services/api";
import { projectService } from "../services/projectService";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    try {
      const data =
        await projectService.getProjects();

      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();

    const interval = setInterval(() => {
      if (getToken()) {
        fetchProjects();
      }
    }, 30000);

    const handleAuthLogin = () => {
      setLoading(true);
      fetchProjects();
    };

    const handleAuthLogout = () => {
      setProjects([]);
      setLoading(false);
    };

    window.addEventListener(
      "auth-login",
      handleAuthLogin
    );
    window.addEventListener(
      "auth-logout",
      handleAuthLogout
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "auth-login",
        handleAuthLogin
      );
      window.removeEventListener(
        "auth-logout",
        handleAuthLogout
      );
    };
  }, [fetchProjects]);

  const addProject = async (projectData) => {
    const newProject =
      await projectService.createProject(
        projectData
      );

    setProjects((prev) => [
      newProject,
      ...prev,
    ]);

    return newProject;
  };

  const deleteProject = async (id) => {
    await projectService.deleteProject(
      id
    );

    setProjects((prev) =>
      prev.filter(
        (project) =>
          project._id !== id
      )
    );
  };

  const updateProjectStatus = async (
    id,
    status
  ) => {
    const updatedProject =
      await projectService.updateProject(
        id,
        { status }
      );

    setProjects((prev) =>
      prev.map((project) =>
        project._id === id
          ? updatedProject
          : project
      )
    );
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
