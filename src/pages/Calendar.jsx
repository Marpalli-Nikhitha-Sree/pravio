import { useContext, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { TaskContext } from "../context/TaskContext";

import "../styles/dashboard.css";
import "../styles/cards.css";
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
      <div className="calendar-pin">
        <i className="bi bi-pin-angle-fill icon-accent"></i>
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
                <i className="bi bi-calendar3 icon-accent"></i>
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

              <h3 className="calendar-subheading">
                <i className="bi bi-calendar-event icon-accent"></i>
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
                            className={`bi bi-flag-fill ${
                              task.priority === "High"
                                ? "icon-danger"
                                : task.priority === "Medium"
                                ? "icon-warning"
                                : "icon-success"
                            }`}
                          ></i>

                          <strong>
                            {task.title}
                          </strong>
                        </div>

                        <div className="task-status-label">
                          {task.completed ? (
                            <>
                              <i className="bi bi-check-circle-fill icon-success"></i>
                              Completed
                            </>
                          ) : (
                            <>
                              <i className="bi bi-hourglass-split icon-warning"></i>
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