import { apiFetch } from "./api";

export const projectService = {
  getProjects: () =>
    apiFetch("/projects"),

  getProjectTasks: (projectId) =>
    apiFetch(
      `/projects/${projectId}/tasks`
    ),

  createProject: (projectData) =>
    apiFetch("/projects", {
      method: "POST",
      body: JSON.stringify(
        projectData
      ),
    }),

  updateProject: (id, projectData) =>
    apiFetch(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(
        projectData
      ),
    }),

  deleteProject: (id) =>
    apiFetch(`/projects/${id}`, {
      method: "DELETE",
    }),
};
