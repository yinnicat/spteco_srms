import Layout from "../components/Layout";
import {
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

export default function AttendanceAnalytics() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance Analytics</h1>
            <p>
              Analyse attendance performance, eligibility, and students at risk
            </p>
          </div>

          <FaChartLine style={styles.icon} />
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Average Attendance</h3>
            <h1>0%</h1>
            <p>Will be calculated from backend attendance records</p>
          </div>

          <div style={styles.card}>
            <h3>Exam Eligible</h3>
            <h1>0</h1>
            <p>Students meeting exam attendance threshold</p>
          </div>

          <div style={styles.warningCard}>
            <h3>At Risk</h3>
            <h1>0</h1>
            <p>Students below required attendance threshold</p>
          </div>
        </div>

        <div style={styles.tableCard}>
          <h2>Attendance Risk Analysis</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Student Name</th>
                <th>Programme</th>
                <th>Attendance %</th>
                <th>Exam Status</th>
                <th>Allowance Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="6" style={styles.empty}>
                  Attendance analytics will appear here once connected to the backend.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={styles.noticeCard}>
          <FaExclamationTriangle style={styles.noticeIcon} />

          <div>
            <h3>Backend Calculation</h3>
            <p>
              The backend will calculate attendance percentages using total
              classes attended divided by total scheduled classes.
            </p>
          </div>
        </div>

        <div style={styles.noticeCard}>
          <FaCheckCircle style={styles.noticeIcon} />

          <div>
            <h3>Eligibility Rules</h3>
            <p>
              Exam and allowance eligibility will be based on the thresholds
              configured in System Settings.
            </p>
          </div>
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

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  warningCard: {
    background: "#fee2e2",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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

  noticeCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    borderLeft: "5px solid #1e3a8a",
    marginBottom: "15px",
  },

  noticeIcon: {
    color: "#1e3a8a",
    fontSize: "26px",
  },
};