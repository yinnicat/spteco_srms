import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/SPTECO logo.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (item) =>
        item.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      alert("Invalid username or password. Please create an account first.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <img src={logo} alt="SPTECO Logo" style={styles.logo} />
        <h1 style={styles.title}>SPTECO</h1>
        <h2 style={styles.subtitle}>Student Records Management System</h2>
        <p style={styles.college}>Selebi-Phikwe Technical College</p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2>Welcome Back</h2>
          <p>Please login to continue</p>

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <FaUser />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />

              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div style={styles.forgotRow}>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" style={styles.loginBtn}>
              Login
            </button>
          </form>

          <p style={styles.signupText}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  leftPanel: {
    flex: 1,
    background: "#1e3a8a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  logo: {
    width: "140px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    maxWidth: "350px",
  },

  college: {
    marginTop: "15px",
    opacity: "0.9",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },

  formCard: {
    width: "420px",
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },

  inputGroup: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "15px",
    gap: "10px",
  },

  input: {
    border: "none",
    outline: "none",
    flex: 1,
  },

  eyeButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  forgotRow: {
    textAlign: "right",
    marginBottom: "18px",
  },

  forgotLink: {
    color: "#1e3a8a",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: "600",
  },

  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  signupText: {
    marginTop: "20px",
  },
};