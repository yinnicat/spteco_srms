import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaCertificate,
  FaExclamationTriangle,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const role = loggedInUser.role || "Lecturer";

  const students =
    JSON.parse(localStorage.getItem("students")) || [];

  const staff =
    JSON.parse(localStorage.getItem("staff")) || [];

  const courses =
    JSON.parse(localStorage.getItem("courses")) || [];

  const enrolments =
    JSON.parse(localStorage.getItem("enrolments")) || [];

  const certificates =
    JSON.parse(localStorage.getItem("certificates")) || [];

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: <FaUserGraduate />,
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      title: "Total Staff",
      value: staff.length,
      icon: <FaChalkboardTeacher />,
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      title: "Courses",
      value: courses.length,
      icon: <FaBook />,
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      title: "Active Enrolments",
      value: enrolments.filter((item) => item.status === "Active").length,
      icon: <FaClipboardList />,
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      title: "Certificates Issued",
      value: certificates.length,
      icon: <FaCertificate />,
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      title: "Uncollected Certificates",
      value: certificates.filter((item) => item.status === "Uncollected").length,
      icon: <FaExclamationTriangle />,
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      title: "SEN Students",
      value: students.filter((item) => item.sen === "Yes").length,
      icon: <FaUsers />,
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      title: "OVC Students",
      value: students.filter((item) => item.ovc === "Yes").length,
      icon: <FaUsers />,
      roles: ["Database Admin", "Admin Staff"],
    },
  ];

  const visibleStats = stats.filter((item) =>
    item.roles.includes(role)
  );

  const recentEnrolments = enrolments.slice(0, 3);

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>

            <p style={styles.subheading}>
              Welcome back, {loggedInUser.fullname || loggedInUser.username || "System User"} — {role}
            </p>
          </div>

          <span style={styles.roleBadge}>{role}</span>
        </div>

        <div style={styles.cardsGrid}>
          {visibleStats.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.iconBox}>{item.icon}</div>

              <div>
                <p style={styles.cardTitle}>{item.title}</p>
                <h2 style={styles.cardValue}>{item.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h2>Recent Enrolments</h2>

              <Link to="/enrolments" style={styles.viewAll}>
                View all
              </Link>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Programme</th>
                  <th>Enrolment Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentEnrolments.length === 0 && (
                  <tr>
                    <td colSpan="4" style={styles.empty}>
                      Recent enrolments will appear here once records are added or connected to the backend.
                    </td>
                  </tr>
                )}

                {recentEnrolments.map((item) => (
                  <tr key={item.enrolmentId}>
                    <td>
                      {item.studentNo}
                      <br />
                      <strong>{item.studentName}</strong>
                    </td>

                    <td>{item.programme}</td>
                    <td>{item.enrolmentDate}</td>

                    <td>
                      <span style={styles.activeBadge}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.quickCard}>
            <h2>Quick Actions</h2>

            <div style={styles.actions}>
              {(role === "Database Admin" || role === "Admin Staff") && (
                <>
                  <Link to="/students/add">
                    <button style={styles.actionBtn}>Add Student</button>
                  </Link>

                  <Link to="/enrolments/add">
                    <button style={styles.actionBtn}>New Enrolment</button>
                  </Link>

                  <Link to="/certificates">
                    <button style={styles.actionBtn}>Certificate Collection</button>
                  </Link>
                </>
              )}

              <Link to="/attendance">
                <button style={styles.actionBtn}>Attendance</button>
              </Link>

              <Link to="/reports">
                <button style={styles.actionBtn}>Reports</button>
              </Link>

              {role === "Database Admin" && (
                <>
                  <Link to="/users">
                    <button style={styles.actionBtn}>User Management</button>
                  </Link>

                  <Link to="/migration">
                    <button style={styles.actionBtn}>Data Migration</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={styles.noticeCard}>
          <FaFileAlt style={styles.noticeIcon} />

          <div>
            <h3>System Notice</h3>
            <p>
              Dashboard data is prepared for backend integration. Once the backend is connected, these values will update automatically from the database.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  heading: {
    margin: 0,
    color: "#111827",
  },

  subheading: {
    marginTop: "6px",
    color: "#6b7280",
  },

  roleBadge: {
    background: "#dbeafe",
    color: "#1e3a8a",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "700",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  iconBox: {
    width: "46px",
    height: "46px",
    background: "#e8f0ff",
    color: "#1e3a8a",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px",
  },

  cardTitle: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "8px",
  },

  cardValue: {
    fontSize: "30px",
    margin: 0,
    color: "#111827",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  viewAll: {
    color: "#1e3a8a",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  quickCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  actionBtn: {
    width: "100%",
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "600",
  },

  noticeCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    borderLeft: "5px solid #1e3a8a",
  },

  noticeIcon: {
    fontSize: "28px",
    color: "#1e3a8a",
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
  },
};