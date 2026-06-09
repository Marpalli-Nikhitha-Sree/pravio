import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { TaskContext } from "../context/TaskContext";
import { ProjectContext } from "../context/ProjectContext";
import { useSettings } from "../context/SettingsContext";

import "../styles/dashboard.css";
import "../styles/cards.css";
import "../styles/settings.css";
import "../styles/profile.css";

import { apiFetch, getToken } from "../services/api";
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";
}

function formatMemberSince(dateString) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function Profile() {
  const navigate = useNavigate();
  const { privacy } = useSettings();
  const { tasks } = useContext(TaskContext);
  const { projects } = useContext(ProjectContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = getToken();

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const syncStoredUser = (profile) => {
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    window.dispatchEvent(new Event("profileupdate"));
  };

  const loadProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const data = await apiFetch("/auth/profile");

      syncStoredUser(data);
      setForm({
        name: data.name || "",
        role: data.role || "Member",
        bio: data.bio || "",
      });
    } catch {
      const stored = JSON.parse(localStorage.getItem("user") || "null");

      if (stored) {
        setUser(stored);
        setForm({
          name: stored.name || "",
          role: stored.role || "Member",
          bio: stored.bio || "",
        });
      }

      setMessage({
        text: "Cannot connect to server",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!form.name.trim()) {
      setMessage({ text: "Name is required", type: "error" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const data = await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name.trim(),
          bio: form.bio.trim(),
        }),
      });

      syncStoredUser(data.user);
      setEditing(false);
      setMessage({ text: "Profile updated successfully", type: "success" });
    } catch {
      setMessage({
        text: "Cannot connect to server",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        text: "Please fill all password fields",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        text: "New passwords do not match",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        text: "New password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const data = await apiFetch("/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setMessage({ text: "Password updated successfully", type: "success" });
    } catch {
      setMessage({
        text: "Cannot connect to server",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    setForm({
      name: user?.name || "",
      role: user?.role || "Member",
      bio: user?.bio || "",
    });
    setEditing(true);
    setMessage(null);
  };

  const cancelEditing = () => {
    setEditing(false);
    setForm({
      name: user?.name || "",
      role: user?.role || "Member",
      bio: user?.bio || "",
    });
  };

  return (
    <>
      <FluidBackground />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="dashboard-content profile-page">
            {message && (
              <div className={`profile-message profile-message--${message.type}`}>
                <i
                  className={`bi ${message.type === "success"
                      ? "bi-check-circle-fill"
                      : "bi-exclamation-circle-fill"
                    }`}
                ></i>
                {message.text}
              </div>
            )}

            <div className="profile-header welcome-card">
              <div className="profile-header__main">
                <div className="profile-avatar">
                  {getInitials(user?.name)}
                </div>

                <div className="profile-header__info">
                  <h1>{user?.name || "Your Profile"}</h1>
                  <p className="profile-header__email">
                    <i className="bi bi-envelope icon-silver"></i>
                    {user?.email || "—"}
                  </p>
                  <span className="profile-role-badge">
                    {user?.role || "Member"}
                  </span>
                </div>
              </div>

              {!loading && !editing && (
                <button
                  type="button"
                  className="profile-edit-btn"
                  onClick={startEditing}
                >
                  <i className="bi bi-pencil-square"></i>
                  Edit Profile
                </button>
              )}
            </div>

            <div className="profile-stats stats-grid">
              <div className="stat-card">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
              </div>

              <div className="stat-card">
                <h3>{projects.length}</h3>
                <p>Projects</p>
              </div>

              <div className="stat-card">
                <h3>{completedTasks}</h3>
                <p>Completed Tasks</p>
              </div>

              <div className="stat-card">
                <h3>{completionRate}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="task-card profile-card">
                <h2>
                  <i className="bi bi-person-lines-fill icon-accent"></i>
                  {editing ? "Edit Details" : "Account Details"}
                </h2>

                {loading ? (
                  <p className="profile-loading">Loading profile...</p>
                ) : editing ? (
                  <div className="profile-form">
                    <label className="profile-field">
                      <span>Full Name</span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your name"
                      />
                    </label>

                    <label className="profile-field">
                      <span>Role</span>
                      <input
                        type="text"
                        value={form.role}
                        readOnly
                        disabled
                      />
                    </label>

                    <label className="profile-field">
                      <span>Bio</span>
                      <textarea
                        value={form.bio}
                        onChange={(e) =>
                          setForm({ ...form, bio: e.target.value })
                        }
                        placeholder="Tell us a little about yourself"
                        rows={4}
                      />
                    </label>

                    <div className="profile-form__actions">
                      <button
                        type="button"
                        className="profile-btn profile-btn--ghost"
                        onClick={cancelEditing}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="profile-btn profile-btn--primary"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-details">
                    <div className="profile-detail-row">
                      <span className="profile-detail-label">Name</span>
                      <span>{user?.name || "—"}</span>
                    </div>

                    <div className="profile-detail-row">
                      <span className="profile-detail-label">Email</span>
                      <span>{user?.email || "—"}</span>
                    </div>

                    <div className="profile-detail-row">
                      <span className="profile-detail-label">Role</span>
                      <span>{user?.role || "Member"}</span>
                    </div>

                    <div className="profile-detail-row">
                      <span className="profile-detail-label">Member Since</span>
                      <span>{formatMemberSince(user?.createdAt)}</span>
                    </div>

                    <div className="profile-detail-row profile-detail-row--bio">
                      <span className="profile-detail-label">Bio</span>
                      <span>
                        {user?.bio?.trim()
                          ? user.bio
                          : "No bio added yet."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="task-card profile-card">
                <h2>
                  <i className="bi bi-shield-lock icon-accent"></i>
                  Security
                </h2>

                <p className="profile-security-note">
                  Keep your account secure with a strong password.
                </p>

                {!showPasswordForm ? (
                  <button
                    type="button"
                    className="profile-btn profile-btn--outline"
                    onClick={() => {
                      setShowPasswordForm(true);
                      setMessage(null);
                    }}
                  >
                    <i className="bi bi-key"></i>
                    Change Password
                  </button>
                ) : (
                  <div className="profile-form">
                    <label className="profile-field">
                      <span>Current Password</span>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                      />
                    </label>

                    <label className="profile-field">
                      <span>New Password</span>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="At least 6 characters"
                      />
                    </label>

                    <label className="profile-field">
                      <span>Confirm New Password</span>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Re-enter new password"
                      />
                    </label>

                    <div className="profile-form__actions">
                      <button
                        type="button"
                        className="profile-btn profile-btn--ghost"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="profile-btn profile-btn--primary"
                        onClick={handleChangePassword}
                        disabled={saving}
                      >
                        {saving ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="profile-summary-list">
                  <div className="profile-summary-item">
                    <i className="bi bi-folder-check icon-folder"></i>
                    <span>{completedProjects} completed projects</span>
                  </div>

                  <div className="profile-summary-item">
                    <i className="bi bi-check2-all icon-success"></i>
                    <span>{completedTasks} tasks finished</span>
                  </div>
                </div>
              </div>
            </div>

            {!privacy.showProfile && (
              <p className="settings-private-note profile-privacy-note">
                <i className="bi bi-shield-lock-fill icon-privacy"></i>
                Your profile is hidden from others. You can change this in Settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
