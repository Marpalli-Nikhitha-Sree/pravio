import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import ThemeToggle from "../components/ThemeToggle";
import { API_BASE, isAuthenticated } from "../services/api";

import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    setMessage(null);

    if (!email || !password) {
      setMessage({
        text: "Please fill all fields",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          text: data.message || "Login failed",
          type: "error",
        });
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      window.dispatchEvent(
        new CustomEvent("auth-login")
      );

      setMessage({
        text: "Login successful!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
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
              When Focus Meets Intention,
              <br />
              Every Task Becomes
              <span className="achievement">
                {" "}
                Achievement
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

            <button onClick={handleLogin}>
              Login
            </button>

            <p className="auth-link">
              New to Pravio?{" "}
              <Link to="/register">
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
