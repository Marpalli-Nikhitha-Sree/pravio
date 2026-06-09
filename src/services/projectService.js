const API_URL =
  "http://localhost:5001/api/projects";

const getToken = () =>
  localStorage.getItem("token");

export const projectService = {
  getProjects: async () => {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  getProjectTasks: async (projectId) => {
    const response = await fetch(
      `${API_URL}/${projectId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.json();
  },

  createProject: async (projectData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(projectData),
    });
    return response.json();
  },

  updateProject: async (id, projectData) => {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(projectData),
      }
    );
    return response.json();
  },

  deleteProject: async (id) => {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.json();
  },
};
