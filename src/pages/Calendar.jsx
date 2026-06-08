import { useContext, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { TaskContext } from "../context/TaskContext";

import "../styles/calendar.css";
import "../styles/projectTaskRows.css";

function CalendarPage() {
  const { tasks } =
    useContext(TaskContext);

  const [selectedDate, setSelectedDate] =
    useState(
      tasks.find(
        (task) => task.dueDate
      )
        ? new Date(
            tasks.find(
              (task) =>
                task.dueDate
            ).dueDate
          )
        : new Date()
    );

  const tasksWithDates =
    tasks.filter(
      (task) => task.dueDate
    );

  const selectedDateString =
    selectedDate
      .toISOString()
      .split("T")[0];

  const selectedTasks =
    tasksWithDates.filter(
      (task) =>
        task.dueDate ===
        selectedDateString
    );

  const tileContent = ({
    date,
    view,
  }) => {
    if (view !== "month")
      return null;

    const dayString = date
      .toISOString()
      .split("T")[0];

    const hasTask =
      tasksWithDates.some(
        (task) =>
          task.dueDate === dayString
      );

    return hasTask ? (
      <div
        style={{
          textAlign: "center",
          fontSize: "10px",
          color: "#00a7c7",
        }}
      >
        <i className="bi bi-pin-angle-fill"></i>
      </div>
    ) : null;
  };

  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content">

            <div
              className="task-card"
              style={{
                width: "100%",
              }}
            >

              <h2>
                <i className="bi bi-calendar3"></i>
                Calendar
              </h2>

              <Calendar
                onChange={
                  setSelectedDate
                }
                value={
                  selectedDate
                }
                tileContent={
                  tileContent
                }
              />

              <br />

              <h3
                style={{
                  color: "#1b3b6f",
                }}
              >
                <i className="bi bi-calendar-event"></i>
                Tasks for{" "}
                {selectedDateString}
              </h3>

              {selectedTasks.length ===
              0 ? (
                <p>
                  No tasks scheduled
                  for this date
                </p>
              ) : (
                selectedTasks.map(
                  (task) => (
                    <div
                      key={task.id}
                      className="task-row"
                    >
                      <div>

                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "10px",
                          }}
                        >
                          <i
                            className="bi bi-flag-fill"
                            style={{
                              color:
                                task.priority ===
                                "High"
                                  ? "#ef4444"
                                  : task.priority ===
                                    "Medium"
                                  ? "#f59e0b"
                                  : "#22c55e",
                            }}
                          ></i>

                          <strong>
                            {task.title}
                          </strong>
                        </div>

                        <div
                          style={{
                            marginTop:
                              "8px",
                            color:
                              "#4a6fa5",
                          }}
                        >
                          {task.completed ? (
                            <>
                              <i className="bi bi-check-circle-fill"></i>
                              Completed
                            </>
                          ) : (
                            <>
                              <i className="bi bi-hourglass-split"></i>
                              Pending
                            </>
                          )}
                        </div>

                      </div>
                    </div>
                  )
                )
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarPage;