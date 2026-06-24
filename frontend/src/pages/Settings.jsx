import Layout from "../components/Layout";
import { useState } from "react";
import { FaCog } from "react-icons/fa";

export default function Settings() {

  const [settings, setSettings] = useState({
    examThreshold: 80,
    allowanceThreshold: 85,
  });

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

    alert(
      "Settings saved successfully"
    );
  };

  return (
    <Layout>

      <div style={styles.container}>

        <div style={styles.header}>

          <div>

            <h1>System Settings</h1>

            <p>
              Configure global system rules
            </p>

          </div>

          <FaCog style={styles.icon} />

        </div>

        <div style={styles.card}>

          <div style={styles.group}>

            <label>
              Exam Attendance Threshold (%)
            </label>

            <input

              type="number"

              min="0"

              max="100"

              name="examThreshold"

              value={settings.examThreshold}

              onChange={handleChange}

              style={styles.input}

            />

          </div>

          <div style={styles.group}>

            <label>
              Allowance Attendance Threshold (%)
            </label>

            <input

              type="number"

              min="0"

              max="100"

              name="allowanceThreshold"

              value={settings.allowanceThreshold}

              onChange={handleChange}

              style={styles.input}

            />

          </div>

          <div style={styles.note}>

            These values will later be
            connected to the backend
            and automatically applied
            across the system.

          </div>

          <button

            onClick={saveSettings}

            style={styles.button}

          >

            Save Settings

          </button>

        </div>

      </div>

    </Layout>
  );
}

const styles = {

  container: {
    background: "#f5f6fa",

    minHeight: "100vh",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "25px",
  },

  icon: {
    fontSize: "50px",

    color: "#1e3a8a",
  },

  card: {
    background: "#fff",

    maxWidth: "800px",

    padding: "30px",

    borderRadius: "12px",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  group: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",

    marginBottom: "25px",
  },

  input: {
    padding: "12px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    outline: "none",
  },

  note: {
    background: "#eff6ff",

    padding: "15px",

    borderRadius: "8px",

    marginBottom: "25px",

    color: "#1e3a8a",
  },

  button: {
    background: "#1e3a8a",

    color: "#fff",

    border: "none",

    padding: "12px 20px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",
  },

};