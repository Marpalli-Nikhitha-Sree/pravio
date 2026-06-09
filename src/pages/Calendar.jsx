import { useContext, useEffect, useState } from "react";

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

function parseLocalDate(dateStr) {
  const [year, month, day] =
    dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatLocalDate(d) {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CalendarPage() {
  const { calendarTasks } =
    useContext(TaskContext);

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  useEffect(() => {
    const firstTaskWithDate =
      calendarTasks.find(
        (task) => task.dueDate
      );

    if (firstTaskWithDate) {
      setSelectedDate(
        parseLocalDate(
          firstTaskWithDate.dueDate
        )
      );
    }
  }, [calendarTasks]);

  const tasksWithDates =
    calendarTasks.filter(
      (task) => task.dueDate
    );

  const selectedDateString = formatLocalDate(selectedDate);

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

    const dayString = formatLocalDate(date);

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
                      key={task._id}
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

                          {task.projectId && (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#6b7280",
                              }}
                            >
                              (Project)
                            </span>
                          )}
                        </div>

                        <div className="task-status-label">
                          {task.status === "Completed" ? (
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
