import { useState } from "react";
import api from "../api";

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/token/", {
        username,
        password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      sessionStorage.setItem(
        "access_token",
        accessToken
      );

      sessionStorage.setItem(
        "refresh_token",
        refreshToken
      );

      sessionStorage.setItem(
        "username",
        username
      );

      if (onLogin) {
        await onLogin();
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          "Login failed. Check that the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          ◆
        </div>

        <h1>OrderFlow CI/CD v2</h1>

        <p className="login-subtitle">
          Order Management System
        </p>

        <h2>Welcome back</h2>

        <p className="login-description">
          Sign in to manage your orders and inventory.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter username"
            autoComplete="username"
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In →"}
          </button>

        </form>

        <div className="register-link">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={onRegister}
          >
            Create account
          </button>

        </div>

        <div className="login-footer">
          OrderFlow • Secure Login
        </div>

      </div>

    </div>
  );
}

export default Login;
