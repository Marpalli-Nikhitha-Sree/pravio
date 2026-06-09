import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FluidBackground from "../components/FluidBackground";
import ThemeToggle from "../components/ThemeToggle";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "https://pravio.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Registration failed"
        );
        return;
      }

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert("Cannot connect to server");
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

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;