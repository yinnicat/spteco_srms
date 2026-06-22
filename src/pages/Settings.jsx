import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  FaCog,
  FaSave,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

export default function Settings() {
  const [settings, setSettings] = useState({
    examThreshold: 80,
    allowanceThreshold: 85,
    sessionTimeout: 30,
    backupFrequency: "Daily",
    passwordPolicy: "Strong",
    systemMode: "LAN Only",
  });

  useEffect(() => {
    const savedSettings =
      JSON.parse(localStorage.getItem("systemSettings"));

    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = () => {
    localStorage.setItem(
      "systemSettings",
      JSON.stringify(settings)
    );

    alert("System settings saved successfully");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>System Settings</h1>
            <p>
              Configure system rules, thresholds, security, and
              local operation settings
            </p>
          </div>

          <div style={styles.headerIcon}>
            <FaCog />
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2>
              <FaClock /> Attendance Rules
            </h2>

            <label>Exam Attendance Threshold (%)</label>
            <input
              type="number"
              name="examThreshold"
              value={settings.examThreshold}
              onChange={handleChange}
              style={styles.input}
            />

            <label>Allowance Attendance Threshold (%)</label>
            <input
              type="number"
              name="allowanceThreshold"
              value={settings.allowanceThreshold}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.card}>
            <h2>
              <FaShieldAlt /> Security Settings
            </h2>

            <label>Session Timeout (Minutes)</label>
            <input
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              style={styles.input}
            />

            <label>Password Policy</label>
            <select
              name="passwordPolicy"
              value={settings.passwordPolicy}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Basic">Basic</option>
              <option value="Strong">Strong</option>
              <option value="Very Strong">Very Strong</option>
            </select>
          </div>

          <div style={styles.card}>
            <h2>Backup & Local Network</h2>

            <label>Backup Frequency</label>
            <select
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            <label>System Operation Mode</label>
            <select
              name="systemMode"
              value={settings.systemMode}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="LAN Only">LAN Only</option>
              <option value="Local Computer">Local Computer</option>
            </select>
          </div>
        </div>

        <button style={styles.saveBtn} onClick={saveSettings}>
          <FaSave /> Save Settings
        </button>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  headerIcon: {
    fontSize: "50px",
    color: "#2563eb",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    fontWeight: "600",
  },
};