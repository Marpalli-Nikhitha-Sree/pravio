function CreateProjectModal({
  isOpen,
  projectName,
  setProjectName,
  onClose,
  onCreate,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Create Project</h2>

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
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

export default CreateProjectModal;