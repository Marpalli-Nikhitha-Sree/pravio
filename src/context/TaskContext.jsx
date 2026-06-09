import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { apiFetch, getToken } from "../services/api";
import { projectService } from "../services/projectService";

export const TaskContext = createContext();

export function TaskProvider({
  children,
}) {
  const [tasks, setTasks] =
    useState([]);
  const [calendarTasks, setCalendarTasks] =
    useState([]);
  const [projectTasks, setProjectTasks] =
    useState({});

  const clearAll = useCallback(() => {
    setTasks([]);
    setCalendarTasks([]);
    setProjectTasks({});
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!getToken()) return;

    try {
      const data = await apiFetch("/tasks");

      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchCalendarTasks =
    useCallback(async () => {
      if (!getToken()) return;

      try {
        const data =
          await apiFetch(
            "/tasks/calendar"
          );

        if (Array.isArray(data)) {
          setCalendarTasks(data);
        }
      } catch (error) {
        console.error(error);
      }
    }, []);

  useEffect(() => {
    fetchTasks();
    fetchCalendarTasks();

    const interval = setInterval(() => {
      if (getToken()) {
        fetchTasks();
        fetchCalendarTasks();
      }
    }, 30000);

    const handleAuthLogin = () => {
      fetchTasks();
      fetchCalendarTasks();
    };

    const handleAuthLogout = () => {
      clearAll();
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
  }, [
    fetchTasks,
    fetchCalendarTasks,
    clearAll,
  ]);

  const fetchProjectTasks = async (
    projectId
  ) => {
    try {
      const data =
        await projectService.getProjectTasks(
          projectId
        );

      if (Array.isArray(data)) {
        setProjectTasks((prev) => ({
          ...prev,
          [projectId]: data,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const findProjectTask = (id) => {
    for (const [
      projectId,
      projectTaskList,
    ] of Object.entries(
      projectTasks
    )) {
      const task =
        projectTaskList.find(
          (t) => t._id === id
        );

      if (task) {
        return { task, projectId };
      }
    }

    return null;
  };

  const addTask = async (
    task
  ) => {
    const newTask = await apiFetch(
      "/tasks",
      {
        method: "POST",
        body: JSON.stringify({
          title: task.title,
          description: "",
          status:
            task.completed
              ? "Completed"
              : "Pending",
          priority: task.priority,
          dueDate: task.dueDate,
          projectId:
            task.projectId || null,
        }),
      }
    );

    if (task.projectId) {
      setProjectTasks((prev) => ({
        ...prev,
        [task.projectId]: [
          ...(prev[task.projectId] || []),
          newTask,
        ],
      }));
    } else {
      setTasks((prev) => [
        ...prev,
        newTask,
      ]);
    }

    if (newTask.dueDate) {
      setCalendarTasks((prev) => [
        ...prev,
        newTask,
      ]);
    }

    return newTask;
  };

  const toggleTask =
    async (id) => {
      const standaloneTask =
        tasks.find(
          (t) =>
            t._id === id
        );

      const projectMatch =
        findProjectTask(id);

      const task =
        standaloneTask ||
        projectMatch?.task;

      if (!task) return;

      const updatedStatus =
        task.status ===
        "Completed"
          ? "Pending"
          : "Completed";

      const updatedTask =
        await apiFetch(
          `/tasks/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              status:
                updatedStatus,
            }),
          }
        );

      if (projectMatch) {
        setProjectTasks((prev) => ({
          ...prev,
          [projectMatch.projectId]:
            prev[
              projectMatch.projectId
            ].map((t) =>
              t._id === id
                ? updatedTask
                : t
            ),
        }));
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === id
              ? updatedTask
              : t
          )
        );
      }

      setCalendarTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? updatedTask
            : t
        )
      );
    };

  const deleteTask =
    async (id) => {
      await apiFetch(
        `/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const projectMatch =
        findProjectTask(id);

      if (projectMatch) {
        setProjectTasks((prev) => ({
          ...prev,
          [projectMatch.projectId]:
            prev[
              projectMatch.projectId
            ].filter(
              (task) =>
                task._id !== id
            ),
        }));
      } else {
        setTasks((prev) =>
          prev.filter(
            (task) =>
              task._id !== id
          )
        );
      }

      setCalendarTasks((prev) =>
        prev.filter(
          (task) =>
            task._id !== id
        )
      );
    };

  const editTask =
    async (
      id,
      newTitle
    ) => {
      const updatedTask =
        await apiFetch(
          `/tasks/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title:
                newTitle,
            }),
          }
        );

      const projectMatch =
        findProjectTask(id);

      if (projectMatch) {
        setProjectTasks((prev) => ({
          ...prev,
          [projectMatch.projectId]:
            prev[
              projectMatch.projectId
            ].map((task) =>
              task._id === id
                ? updatedTask
                : task
            ),
        }));
      } else {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id
              ? updatedTask
              : task
          )
        );
      }

      setCalendarTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? updatedTask
            : task
        )
      );
    };

  const refreshTasks = () => {
    fetchTasks();
    fetchCalendarTasks();
  };

  const removeProjectTasks = (
    projectId
  ) => {
    setProjectTasks((prev) => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });

    setCalendarTasks((prev) =>
      prev.filter(
        (task) =>
          task.projectId !==
          projectId
      )
    );
  };

  const getTasksByProject = (projectId) => {
    return projectTasks[projectId] || [];
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        calendarTasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        refreshTasks,
        fetchProjectTasks,
        removeProjectTasks,
        getTasksByProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
