import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import ThemeToggle from "../components/ThemeToggle";
import { API_BASE, isAuthenticated } from "../services/api";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async () => {
    setMessage(null);

    if (!name || !email || !password) {
      setMessage({
        text: "Please fill all fields",
        type: "error",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          text: data.message || "Registration failed",
          type: "error",
        });
        return;
      }

      setMessage({
        text: "Registration successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      setMessage({
        text: "Cannot connect to server",
        type: "error",
      });
    }
  };

  return (
    <>
      <FluidBackground />
      <ThemeToggle floating />

      <div className="auth-page">
        <div className="auth-container">
          <div className="hero-brand">
            <h1 className="brand-title">
              PRAVIO
            </h1>

            <p className="brand-tagline">
              Flow With Purpose
            </p>

            <h2 className="brand-caption">
              Begin Your Journey,
              <br />
              Turn Every Goal Into
              <span className="achievement">
                {" "}Progress
              </span>
            </h2>
          </div>

          <div className="auth-card">

            {message && (
              <div
                className={`auth-message auth-message--${message.type}`}
              >
                {message.text}
              </div>
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              onClick={handleRegister}
            >
              Register
            </button>

            <p className="auth-link">
              Already have an account?{" "}
              <Link to="/login">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
