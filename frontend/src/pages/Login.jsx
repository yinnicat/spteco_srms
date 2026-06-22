import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import logo from "../assets/SPTECO logo.jpg";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <img src={logo} alt="SPTECO Logo" style={styles.logo} />

        <h1 style={styles.title}>SPTECO</h1>

        <h2 style={styles.subtitle}>
          Student Records Management System
        </h2>

        <p style={styles.college}>
          Selebi-Phikwe Technical College
        </p>
      </div>

      {/* Right Panel */}
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
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
              />
              <FaEye />
            </div>

            <div style={styles.options}>
              <label>
                <input type="checkbox" />
                Remember Me
              </label>

              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" style={styles.loginBtn}>
              Login
            </button>
          </form>

          <p style={{ marginTop: "20px" }}>
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
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

  options: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "14px",
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
};