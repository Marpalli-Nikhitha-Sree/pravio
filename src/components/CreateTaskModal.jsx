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

        <h2>Create Task</h2>

        <input
          type="text"
          value={taskName}
          onChange={(e) =>
            setTaskName(e.target.value)
          }
          placeholder="Task Name"
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="High">
            🔴 High Priority
          </option>

          <option value="Medium">
            🟡 Medium Priority
          </option>

          <option value="Low">
            🟢 Low Priority
          </option>
        </select>

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