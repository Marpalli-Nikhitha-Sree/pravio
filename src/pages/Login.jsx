import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";

import "../styles/background.css";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login button clicked");

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      console.log("Sending request...");

      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Response:", data);

      if (!response.ok) {
        alert(data.message || "Login failed");
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

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to server"
      );
    }
  };

  return (
    <>
      <FluidBackground />

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

      <div className="auth-page">
        <div className="auth-card">
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
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="auth-link">
            New to Pravio?{" "}
            <a href="/register">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;