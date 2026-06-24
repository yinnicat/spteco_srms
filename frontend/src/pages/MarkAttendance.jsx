import Layout from "../components/Layout";
import { useState } from "react";
import { FaCalendarCheck } from "react-icons/fa";

export default function MarkAttendance() {
  const [date, setDate] = useState("");

  return (
    <Layout>

      <div style={styles.container}>

        <div style={styles.header}>

          <div>

            <h1>Mark Attendance</h1>

            <p>
              Select a class and record student attendance
            </p>

          </div>

          <FaCalendarCheck style={styles.icon} />

        </div>

        <div style={styles.card}>

          <div style={styles.formGrid}>

            <div style={styles.group}>

              <label>Programme</label>

              <select style={styles.input}>

                <option>Select Programme</option>

              </select>

            </div>

            <div style={styles.group}>

              <label>Course</label>

              <select style={styles.input}>

                <option>Select Course</option>

              </select>

            </div>

            <div style={styles.group}>

              <label>Class Level</label>

              <select style={styles.input}>

                <option>Select Level</option>

              </select>

            </div>

            <div style={styles.group}>

              <label>Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.input}
              />

            </div>

          </div>

        </div>

        <div style={styles.tableCard}>

          <h2>Student Attendance List</h2>

          <table style={styles.table}>

            <thead>

              <tr>

                <th>Student Number</th>

                <th>Student Name</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td colSpan="3" style={styles.empty}>

                  Student records will appear here after backend integration.

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <div style={styles.buttonContainer}>

          <button style={styles.button}>

            Save Attendance

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
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "20px",
  },

  group: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },

  button: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};