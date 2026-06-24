import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/SPTECO logo.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Invalid username or password");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      navigate("/dashboard");
    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {error && <div style={styles.errorBox}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <FaUser />
              <input type="text" placeholder="Username" style={styles.input}
                value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div style={styles.inputGroup}>
              <FaLock />
              <input type={showPassword ? "text" : "password"} placeholder="Password"
                style={styles.input} value={password}
                onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" },
  leftPanel: { flex: 1, background: "#1e3a8a", color: "#fff", display: "flex",
    flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px" },
  logo: { width: "140px", marginBottom: "20px" },
  title: { fontSize: "42px", marginBottom: "10px" },
  subtitle: { textAlign: "center", maxWidth: "350px" },
  college: { marginTop: "15px", opacity: "0.9" },
  rightPanel: { flex: 1, display: "flex", justifyContent: "center",
    alignItems: "center", background: "#f5f6fa" },
  formCard: { width: "420px", background: "#fff", padding: "40px",
    borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.1)" },
  inputGroup: { display: "flex", alignItems: "center", border: "1px solid #ddd",
    borderRadius: "8px", padding: "12px", marginBottom: "15px", gap: "10px" },
  input: { border: "none", outline: "none", flex: 1 },
  eyeButton: { border: "none", background: "transparent", cursor: "pointer",
    display: "flex", alignItems: "center" },
  loginBtn: { width: "100%", padding: "14px", background: "#111827", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px",
    borderRadius: "8px", marginBottom: "15px", fontSize: "14px" },
};