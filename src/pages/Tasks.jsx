import { useContext, useState } from "react";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateTaskModal from "../components/CreateTaskModal";

import { TaskContext } from "../context/TaskContext";

import "../styles/dashboard.css";
import "../styles/cards.css";
import "../styles/projectTaskRows.css";
function Tasks() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  } = useContext(TaskContext);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [taskName, setTaskName] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const handleCreateTask = async () => {
    if (!taskName.trim()) return;

    try {
      await addTask({
        title: taskName,
        completed: false,
        priority,
        dueDate,
        projectId: null,
      });

      setTaskName("");
      setPriority("Medium");
      setDueDate("");

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create task");
    }
  };

  const handleEditTask = (task) => {
    const updatedTitle = prompt(
      "Edit Task",
      task.title
    );

    if (!updatedTitle) return;

    editTask(
      task._id,
      updatedTitle
    );
  };

  const filteredTasks = tasks
    .filter((task) => !task.projectId)
    .filter((task) =>
      task.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    )
    .filter((task) => {
      if (filter === "Completed")
        return (
          task.status ===
          "Completed"
        );

      if (filter === "Pending")
        return (
          task.status !==
          "Completed"
        );

      return true;
    });

  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">

            <div className="task-card">

              <div className="task-card-header">
                <h2>
                  <i className="bi bi-check2-square icon-accent"></i>
                  {" "}Tasks
                </h2>

                <button
                  className="create-project-btn"
                  onClick={() =>
                    setIsModalOpen(true)
                  }
                >
                  <i className="bi bi-plus-circle icon-accent"></i>
                  {" "}New Task
                </button>
              </div>

              <input
                type="text"
                className="search-box"
                placeholder="Search Tasks..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

              <div className="task-card-filters">
                <button
                  className="create-project-btn"
                  onClick={() =>
                    setFilter("All")
                  }
                >
                  All
                </button>

                <button
                  className="create-project-btn"
                  onClick={() =>
                    setFilter("Completed")
                  }
                >
                  Completed
                </button>

                <button
                  className="create-project-btn"
                  onClick={() =>
                    setFilter("Pending")
                  }
                >
                  Pending
                </button>
              </div>

              {filteredTasks.length === 0 ? (
                <p>No Matching Tasks</p>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      marginBottom: "14px",
                    }}
                  >

                    <div className="task-row">

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flex: 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            task.status ===
                            "Completed"
                          }
                          onChange={() =>
                            toggleTask(
                              task._id
                            )
                          }
                        />

                        <i
                          className={`bi bi-flag-fill ${
                            task.priority === "High"
                              ? "icon-danger"
                              : task.priority === "Medium"
                              ? "icon-warning"
                              : "icon-success"
                          }`}
                          title={`Priority: ${task.priority || "Medium"}`}
                        ></i>

                        <span
                          style={{
                            textDecoration:
                              task.status ===
                              "Completed"
                                ? "line-through"
                                : "none",

                            opacity:
                              task.status ===
                              "Completed"
                                ? 0.7
                                : 1,
                          }}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <button
                          className="icon-btn"
                          onClick={() =>
                            handleEditTask(
                              task
                            )
                          }
                        >
                          <i className="bi bi-pencil-square icon-accent"></i>
                        </button>

                        <button
                          className="icon-btn"
                          onClick={async () => {
                            if (!window.confirm("Delete this task?")) return;
                            await deleteTask(task._id);
                          }}
                        >
                          <i className="bi bi-trash3 icon-danger"></i>
                        </button>
                      </div>

                    </div>

                    {task.dueDate && (
                      <div className="task-date">
                        <i className="bi bi-calendar-event"></i>{" "}
                        Due: {task.dueDate}
                      </div>
                    )}

                  </div>
                ))
              )}

            </div>

          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        taskName={taskName}
        setTaskName={setTaskName}
        priority={priority}
        setPriority={setPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        onClose={() =>
          setIsModalOpen(false)
        }
        onCreate={handleCreateTask}
      />
    </>
  );
}

export default Tasks;