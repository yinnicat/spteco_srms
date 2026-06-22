import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { defaultStudents } from "../data/studentData";
import {
  FaCalendarCheck,
  FaChartLine,
  FaExclamationTriangle,
  FaClipboardList,
} from "react-icons/fa";

export default function Attendance() {
  const students =
    JSON.parse(localStorage.getItem("students")) ||
    defaultStudents;

  const settings =
    JSON.parse(localStorage.getItem("systemSettings")) || {
      examThreshold: 80,
      allowanceThreshold: 85,
    };

  const examThreshold = Number(settings.examThreshold);
  const allowanceThreshold = Number(settings.allowanceThreshold);

  const attendanceSummary = students.map((student, index) => {
    const requiredHours = 120;
    const attendedHours = 65 + ((index * 11) % 50);
    const percentage = Math.round(
      (attendedHours / requiredHours) * 100
    );

    return {
      ...student,
      requiredHours,
      attendedHours,
      percentage,
      examEligible: percentage >= examThreshold,
      allowanceEligible: percentage >= allowanceThreshold,
    };
  });

  const atRiskStudents = attendanceSummary.filter(
    (student) => !student.examEligible
  );

  const averageAttendance =
    attendanceSummary.length > 0
      ? Math.round(
          attendanceSummary.reduce(
            (total, student) => total + student.percentage,
            0
          ) / attendanceSummary.length
        )
      : 0;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance Management</h1>
            <p>
              Monitor attendance hours, eligibility, and students below
              required thresholds.
            </p>
          </div>

          <div style={styles.headerIcon}>
            <FaCalendarCheck />
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <FaChartLine style={styles.cardIcon} />
            <h3>Average Attendance</h3>
            <h2>{averageAttendance}%</h2>
          </div>

          <div style={styles.card}>
            <FaClipboardList style={styles.cardIcon} />
            <h3>Exam Threshold</h3>
            <h2>{examThreshold}%</h2>
            <p>Minimum required for exam eligibility</p>
          </div>

          <div style={styles.card}>
            <FaClipboardList style={styles.cardIcon} />
            <h3>Allowance Threshold</h3>
            <h2>{allowanceThreshold}%</h2>
            <p>Minimum required for allowance eligibility</p>
          </div>

          <div style={styles.warningCard}>
            <FaExclamationTriangle style={styles.warningIcon} />
            <h3>At-Risk Students</h3>
            <h2>{atRiskStudents.length}</h2>
            <p>Below attendance threshold</p>
          </div>
        </div>

        <div style={styles.buttons}>
          <Link to="/attendance/mark">
            <button style={styles.btn}>Mark Attendance</button>
          </Link>

          <Link to="/attendance/analytics">
            <button style={styles.btn}>Attendance Analytics</button>
          </Link>

          <Link to="/attendance/graph">
            <button style={styles.btn}>Attendance Graph</button>
          </Link>
        </div>

        <div style={styles.tableCard}>
          <h2>Attendance Overview</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student No</th>
                <th>Name</th>
                <th>Required Hours</th>
                <th>Attended Hours</th>
                <th>Attendance %</th>
                <th>Exam Eligibility</th>
                <th>Allowance Eligibility</th>
              </tr>
            </thead>

            <tbody>
              {attendanceSummary.map((student) => (
                <tr key={student.studentNo}>
                  <td>{student.studentNo}</td>

                  <td>
                    {student.firstName} {student.lastName}
                  </td>

                  <td>{student.requiredHours}</td>

                  <td>{student.attendedHours}</td>

                  <td>
                    <span
                      style={
                        student.percentage >= examThreshold
                          ? styles.goodBadge
                          : styles.badBadge
                      }
                    >
                      {student.percentage}%
                    </span>
                  </td>

                  <td>
                    <span
                      style={
                        student.examEligible
                          ? styles.goodText
                          : styles.badText
                      }
                    >
                      {student.examEligible
                        ? "Eligible"
                        : "Not Eligible"}
                    </span>
                  </td>

                  <td>
                    <span
                      style={
                        student.allowanceEligible
                          ? styles.goodText
                          : styles.badText
                      }
                    >
                      {student.allowanceEligible
                        ? "Eligible"
                        : "Not Eligible"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.riskCard}>
          <h2>⚠ Students Below Attendance Threshold</h2>

          {atRiskStudents.length === 0 ? (
            <p>All students meet attendance requirements.</p>
          ) : (
            <ul>
              {atRiskStudents.map((student) => (
                <li key={student.studentNo}>
                  {student.studentNo} - {student.firstName}{" "}
                  {student.lastName} ({student.percentage}%)
                </li>
              ))}
            </ul>
          )}
        </div>
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

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  warningCard: {
    background: "#fff7ed",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #fed7aa",
  },

  cardIcon: {
    fontSize: "28px",
    color: "#2563eb",
  },

  warningIcon: {
    fontSize: "28px",
    color: "#ea580c",
  },

  buttons: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  btn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  goodBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  badBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  goodText: {
    color: "#166534",
    fontWeight: "bold",
  },

  badText: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  riskCard: {
    background: "#fff3cd",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ffeeba",
  },
};