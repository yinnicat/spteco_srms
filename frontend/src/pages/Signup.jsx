import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/SPTECO logo.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select a role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const usernameExists = users.some(
      (user) =>
        user.username.trim().toLowerCase() ===
        formData.username.trim().toLowerCase()
    );

    if (usernameExists) {
      alert("Username already exists");
      return;
    }

    const newUser = {
      id: "USR" + Date.now(),
      fullname: formData.fullname,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      status: "Active",
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    alert("Account created successfully. Please login.");
    navigate("/");
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
          <h2>Create Account</h2>
          <p>Fill in the details to create your account</p>

          <form onSubmit={handleSignup}>
            <div style={styles.inputGroup}>
              <FaUser />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaUser />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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

            <div style={styles.inputGroup}>
              <FaLock />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Role</option>
              <option value="Database Admin">Database Admin</option>
              <option value="Admin Staff">Admin Staff</option>
              <option value="Lecturer">Lecturer</option>
            </select>

            <button type="submit" style={styles.signupBtn}>
              Create Account
            </button>
          </form>

          <p style={styles.loginText}>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
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
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
    padding: "30px",
  },

  formCard: {
    width: "500px",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },

  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "15px",
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    background: "#fff",
  },

  eyeButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  signupBtn: {
    width: "100%",
    padding: "14px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  loginText: {
    marginTop: "20px",
    textAlign: "center",
  },
};