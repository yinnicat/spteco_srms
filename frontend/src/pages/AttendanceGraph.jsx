import Layout from "../components/Layout";
import { FaChartBar } from "react-icons/fa";

export default function AttendanceGraph() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance Graph</h1>
            <p>Visual attendance trends will appear here after backend integration</p>
          </div>

          <FaChartBar style={styles.icon} />
        </div>

        <div style={styles.card}>
          <h2>Attendance Chart</h2>

          <div style={styles.graphBox}>
            Attendance graph will be generated here from backend records.
          </div>
        </div>

        <div style={styles.card}>
          <h2>Graph Data</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Programme</th>
                <th>Average Attendance</th>
                <th>Students Below Threshold</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="3" style={styles.empty}>
                  Graph data will appear here once connected to the backend.
                </td>
              </tr>
            </tbody>
          </table>
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

  graphBox: {
    height: "300px",
    background: "#f8fafc",
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#6b7280",
    fontWeight: "600",
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
};