import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import logo from "../assets/SPTECO logo.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      fullname: "",
      username: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.role === "") {
      alert(
        "Please select a role"
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );

      return;
    }

    let users =
      JSON.parse(
        localStorage.getItem(
          "users"
        )
      ) || [];

    const userExists =
      users.some(
        (user) =>
          user.username.toLowerCase() ===
          formData.username.toLowerCase()
      );

    if (userExists) {
      alert(
        "Username already exists"
      );

      return;
    }

    const newUser = {
      id:
        "USR" +
        Date.now(),

      fullname:
        formData.fullname,

      username:
        formData.username,

      email:
        formData.email,

      role:
        formData.role,

      password:
        formData.password,

      status:
        "Active",

      createdAt:
        new Date().toLocaleDateString(),
    };

    users.push(newUser);

    localStorage.setItem(
      "users",

      JSON.stringify(users)
    );

    alert(
      "Account Created Successfully"
    );

    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <img
          src={logo}
          alt="SPTECO Logo"
          style={styles.logo}
        />

        <h1 style={styles.title}>
          SPTECO
        </h1>

        <h2 style={styles.subtitle}>
          Student Records
          Management System
        </h2>

        <p style={styles.college}>
          Selebi-Phikwe
          Technical College
        </p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2>
            Create Account
          </h2>

          <p>
            Create your SRMS
            account
          </p>

          <form
            onSubmit={
              handleSignup
            }
          >
            <div
              style={
                styles.inputGroup
              }
            >
              <FaUser />

              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={
                  formData.fullname
                }
                onChange={
                  handleChange
                }
                style={
                  styles.input
                }
                required
              />
            </div>

            <div
              style={
                styles.inputGroup
              }
            >
              <FaUser />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                style={
                  styles.input
                }
                required
              />
            </div>

            <div
              style={
                styles.inputGroup
              }
            >
              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                style={
                  styles.input
                }
                required
              />
            </div>

            <div
              style={
                styles.inputGroup
              }
            >
              <FaUser />

              <select
                name="role"
                value={
                  formData.role
                }
                onChange={
                  handleChange
                }
                style={
                  styles.select
                }
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select Role
                </option>

                <option value="Database Admin">
                  Database Admin
                </option>

                <option value="Admin Staff">
                  Admin Staff
                </option>

                <option value="Lecturer">
                  Lecturer
                </option>
              </select>
            </div>

            <div
              style={
                styles.inputGroup
              }
            >
              <FaLock />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                style={
                  styles.input
                }
                required
              />

              <span
                style={
                  styles.eyeIcon
                }
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            <div
              style={
                styles.inputGroup
              }
            >
              <FaLock />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                style={
                  styles.input
                }
                required
              />

              <span
                style={
                  styles.eyeIcon
                }
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            <button
              type="submit"
              style={
                styles.signupBtn
              }
            >
              Create Account
            </button>
          </form>

          <p
            style={{
              marginTop:
                "20px",
            }}
          >
            Already have an
            account?{" "}

            <Link to="/">
              Login
            </Link>
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

    fontFamily:
      "Arial, sans-serif",
  },

  leftPanel: {
    flex: 1,

    background: "#1e3a8a",

    color: "#fff",

    display: "flex",

    flexDirection:
      "column",

    justifyContent:
      "center",

    alignItems:
      "center",

    padding: "40px",
  },

  logo: {
    width: "140px",

    marginBottom:
      "20px",
  },

  title: {
    fontSize: "42px",

    marginBottom:
      "10px",
  },

  subtitle: {
    textAlign: "center",

    maxWidth:
      "350px",
  },

  college: {
    marginTop:
      "15px",

    opacity: "0.9",
  },

  rightPanel: {
    flex: 1,

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    background:
      "#f5f6fa",
  },

  formCard: {
    width: "450px",

    background:
      "#fff",

    padding:
      "40px",

    borderRadius:
      "12px",

    boxShadow:
      "0 0 15px rgba(0,0,0,0.1)",
  },

  inputGroup: {
    display: "flex",

    alignItems:
      "center",

    border:
      "1px solid #ddd",

    borderRadius:
      "8px",

    padding:
      "12px",

    marginBottom:
      "15px",

    gap: "10px",
  },

  input: {
    border: "none",

    outline: "none",

    flex: 1,

    background:
      "transparent",
  },

  select: {
    border: "none",

    outline: "none",

    flex: 1,

    background:
      "transparent",

    fontSize:
      "14px",
  },

  eyeIcon: {
    cursor:
      "pointer",
  },

  signupBtn: {
    width: "100%",

    padding:
      "14px",

    background:
      "#111827",

    color: "#fff",

    border: "none",

    borderRadius:
      "8px",

    cursor:
      "pointer",

    fontSize:
      "16px",
  },
};