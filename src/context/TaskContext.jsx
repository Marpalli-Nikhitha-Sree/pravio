import {
  createContext,
  useState,
  useEffect,
} from "react";

export const TaskContext = createContext();

const API_URL =
  "https://pravio.onrender.com/api/tasks";

export function TaskProvider({
  children,
}) {
  const [tasks, setTasks] =
    useState([]);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response =
        await fetch(
          API_URL,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (
    task
  ) => {
    try {
      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title: task.title,
              description: "",
              status:
                task.completed
                  ? "Completed"
                  : "Pending",
            }),
          }
        );

      const newTask =
        await response.json();

      setTasks([
        ...tasks,
        {
          ...newTask,
          completed: false,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask =
    async (id) => {
      const task =
        tasks.find(
          (t) =>
            t._id === id
        );

      if (!task) return;

      const updatedStatus =
        task.status ===
        "Completed"
          ? "Pending"
          : "Completed";

      try {
        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status:
                  updatedStatus,
              }),
            }
          );

        const updatedTask =
          await response.json();

        setTasks(
          tasks.map((t) =>
            t._id === id
              ? updatedTask
              : t
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const deleteTask =
    async (id) => {
      try {
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setTasks(
          tasks.filter(
            (task) =>
              task._id !== id
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const editTask =
    async (
      id,
      newTitle
    ) => {
      try {
        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                title:
                  newTitle,
              }),
            }
          );

        const updatedTask =
          await response.json();

        setTasks(
          tasks.map((task) =>
            task._id === id
              ? updatedTask
              : task
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}