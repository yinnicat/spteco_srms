import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaCog } from "react-icons/fa";

export default function Settings() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [usernameForm, setUsernameForm] = useState({
    new_username: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [unLoading, setUnLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [unError, setUnError] = useState("");
  const [unSuccess, setUnSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const response = await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPwError(data.detail || "Failed to change password.");
        return;
      }
      setPwSuccess("Password changed successfully.");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch {
      setPwError("Could not connect to server.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setUnError("");
    setUnSuccess("");
    if (!usernameForm.new_username.trim()) {
      setUnError("Username cannot be empty.");
      return;
    }
    setUnLoading(true);
    try {
      const response = await apiFetch("/auth/change-username", {
        method: "POST",
        body: JSON.stringify({ new_username: usernameForm.new_username.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setUnError(data.detail || "Failed to change username.");
        return;
      }
      localStorage.setItem("username", usernameForm.new_username.trim());
      setUnSuccess("Username changed successfully. Please log in again.");
      setUsernameForm({ new_username: "" });
      setTimeout(() => {
        localStorage.clear();
        navigate("/");
      }, 2000);
    } catch {
      setUnError("Could not connect to server.");
    } finally {
      setUnLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Settings</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Manage your account — logged in as <strong>{username}</strong>
            </p>
          </div>
          <FaCog style={{ fontSize: "40px", color: "#1e3a8a" }} />
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div style={styles.group}>
              <label style={styles.label}>Current Password *</label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>New Password *</label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="Minimum 6 characters"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Confirm New Password *</label>
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            {pwError && <div style={styles.errorBox}>{pwError}</div>}
            {pwSuccess && <div style={styles.successBox}>{pwSuccess}</div>}
            <button type="submit" style={{ ...styles.btn, opacity: pwLoading ? 0.7 : 1 }} disabled={pwLoading}>
              {pwLoading ? "Saving..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Change Username */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change Username</h2>
          <p style={styles.notice}>
            Changing your username will log you out and require you to log back in with the new username.
          </p>
          <form onSubmit={handleUsernameChange}>
            <div style={styles.group}>
              <label style={styles.label}>Current Username</label>
              <input type="text" value={username} style={{ ...styles.input, background: "#f8fafc", color: "#6b7280" }} disabled />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>New Username *</label>
              <input
                type="text"
                value={usernameForm.new_username}
                onChange={e => setUsernameForm({ new_username: e.target.value })}
                placeholder="Enter new username"
                style={styles.input}
                required
              />
            </div>
            {unError && <div style={styles.errorBox}>{unError}</div>}
            {unSuccess && <div style={styles.successBox}>{unSuccess}</div>}
            <button type="submit" style={{ ...styles.btn, opacity: unLoading ? 0.7 : 1 }} disabled={unLoading}>
              {unLoading ? "Saving..." : "Change Username"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  card: { background: "#fff", maxWidth: "600px", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  cardTitle: { margin: "0 0 20px 0", color: "#111827" },
  group: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  notice: { background: "#fefce8", borderLeft: "4px solid #eab308", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "#854d0e", marginBottom: "20px" },
  btn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px" },
  successBox: { background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px" },
};