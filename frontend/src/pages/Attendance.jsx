import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

export default function Attendance() {
  const attendanceStats = [
    {
      title: "Exam Threshold",
      value: "80%",
      description: "Minimum attendance required for exam eligibility",
    },

    {
      title: "Allowance Threshold",
      value: "85%",
      description: "Minimum attendance required for allowance eligibility",
    },

    {
      title: "Students Below Threshold",
      value: "0",
      description: "Backend data will update this value",
    },
  ];

  return (
    <Layout>
      <div style={styles.container}>

        <div style={styles.header}>

          <div>

            <h1>Attendance Management</h1>

            <p>
              Monitor student attendance, eligibility and attendance risks
            </p>

          </div>

          <FaCalendarCheck style={styles.headerIcon} />

        </div>

        <div style={styles.cardsGrid}>

          {attendanceStats.map((item, index) => (

            <div key={index} style={styles.card}>

              <h3>{item.title}</h3>

              <h1>{item.value}</h1>

              <p>{item.description}</p>

            </div>

          ))}

        </div>

        <div style={styles.actions}>

          <Link to="/attendance/mark">

            <button style={styles.primaryBtn}>

              Mark Attendance

            </button>

          </Link>

          <Link to="/attendance/analytics">

            <button style={styles.secondaryBtn}>

              Attendance Analytics

            </button>

          </Link>

          <Link to="/attendance/graph">

            <button style={styles.secondaryBtn}>

              Attendance Graph

            </button>

          </Link>

        </div>

        <div style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <h2>Attendance Overview</h2>

            <FaChartLine style={styles.tableIcon} />

          </div>

          <table style={styles.table}>

            <thead>

              <tr>

                <th>Student</th>

                <th>Programme</th>

                <th>Attendance</th>

                <th>Exam Eligibility</th>

                <th>Allowance Eligibility</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td colSpan="5" style={styles.empty}>

                  Attendance records will appear here once connected to the backend.

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <div style={styles.noticeCard}>

          <FaClipboardList style={styles.noticeIcon} />

          <div>

            <h3>Attendance Rule</h3>

            <p>

              A student must meet the minimum threshold before being allowed to write exams or receive allowance.

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

  headerIcon: {
    fontSize: "50px",
    color: "#1e3a8a",
  },

  cardsGrid: {
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

  actions: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },

  primaryBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  tableIcon: {
    color: "#1e3a8a",
    fontSize: "24px",
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
  },

  noticeIcon: {
    color: "#1e3a8a",
    fontSize: "28px",
  },
};