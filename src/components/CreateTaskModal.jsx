const PRIORITIES = [
  {
    value: "High",
    label: "High",
    icon: "bi-flag-fill",
    colorClass: "icon-danger",
  },
  {
    value: "Medium",
    label: "Medium",
    icon: "bi-flag-fill",
    colorClass: "icon-warning",
  },
  {
    value: "Low",
    label: "Low",
    icon: "bi-flag-fill",
    colorClass: "icon-success",
  },
];

function CreateTaskModal({
  isOpen,
  taskName,
  setTaskName,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  onClose,
  onCreate,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <h2>
          <i className="bi bi-clipboard-plus icon-accent"></i>
          Create Task
        </h2>

        <input
          type="text"
          value={taskName}
          onChange={(e) =>
            setTaskName(e.target.value)
          }
          placeholder="Task Name"
        />

        <div className="priority-picker">
          <label>Priority</label>

          <div className="priority-options">
            {PRIORITIES.map((item) => (
              <button
                key={item.value}
                type="button"
                className={
                  priority === item.value
                    ? "priority-option is-active"
                    : "priority-option"
                }
                onClick={() =>
                  setPriority(item.value)
                }
              >
                <i
                  className={`bi ${item.icon} ${item.colorClass}`}
                ></i>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <div className="modal-actions">

          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={onCreate}>
            Create
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateTaskModal;
