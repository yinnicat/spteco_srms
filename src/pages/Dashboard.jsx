import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarCheck,
  FaCertificate,
  FaExclamationTriangle,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { defaultStudents } from "../data/studentData";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedStudents =
      JSON.parse(localStorage.getItem("students")) || defaultStudents;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    setStudents(savedStudents);
    setLoggedInUser(user);
  }, []);

  const role = loggedInUser?.role || "User";

  const attendanceData = students.map((student, index) => {
    const attendance = 60 + ((index * 9) % 40);

    return {
      ...student,
      attendance,
    };
  });

  const atRiskStudents = attendanceData.filter(
    (student) => student.attendance < 80
  );

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  );

  const cards = [
    {
      title: "Total Students",
      value: students.length,
      icon: <FaUserGraduate />,
    },
    {
      title: "Active Students",
      value: activeStudents.length,
      icon: <FaClipboardList />,
    },
    {
      title: "Attendance Risk",
      value: atRiskStudents.length,
      icon: <FaExclamationTriangle />,
    },
    {
      title: "Exam Threshold",
      value: "80%",
      icon: <FaCalendarCheck />,
    },
    {
      title: "Allowance Threshold",
      value: "85%",
      icon: <FaCertificate />,
    },
    {
      title: "Courses",
      value: "12",
      icon: <FaBook />,
    },
    {
      title: "Staff",
      value: "24",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "System Users",
      value: JSON.parse(localStorage.getItem("users"))?.length || 0,
      icon: <FaUsers />,
      dbOnly: true,
    },
  ];

  const visibleCards = cards.filter(
    (card) => !card.dbOnly || role === "Database Admin"
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back, {loggedInUser?.fullname || "User"} — {role}
            </p>
          </div>

          <div style={styles.roleBadge}>{role}</div>
        </div>

        <div style={styles.cards}>
          {visibleCards.map((card, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardIcon}>{card.icon}</div>

              <div>
                <h3>{card.title}</h3>
                <h2>{card.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.grid}>
          <div style={styles.panel}>
            <h2>Students Below Attendance Threshold</h2>

            {atRiskStudents.length === 0 ? (
              <p style={styles.goodText}>
                All students currently meet attendance requirements.
              </p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Student No</th>
                    <th>Name</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {atRiskStudents.slice(0, 5).map((student, index) => (
                    <tr key={index}>
                      <td>{student.studentNo}</td>
                      <td>
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.attendance}%</td>
                      <td style={styles.riskText}>At Risk</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <Link to="/attendance">
              <button style={styles.secondaryBtn}>View Attendance</button>
            </Link>
          </div>

          <div style={styles.panel}>
            <h2>Quick Actions</h2>

            <div style={styles.actions}>
              {(role === "Database Admin" || role === "Admin Staff") && (
                <>
                  <Link to="/students/add">
                    <button style={styles.actionBtn}>+ Add Student</button>
                  </Link>

                  <Link to="/enrolments">
                    <button style={styles.actionBtn}>Manage Enrolments</button>
                  </Link>

                  <Link to="/certificates">
                    <button style={styles.actionBtn}>Certificate Collection</button>
                  </Link>
                </>
              )}

              <Link to="/attendance">
                <button style={styles.actionBtn}>Attendance Dashboard</button>
              </Link>

              <Link to="/reports">
                <button style={styles.actionBtn}>Generate Reports</button>
              </Link>

              {role === "Database Admin" && (
                <Link to="/users">
                  <button style={styles.actionBtn}>Manage Users</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div style={styles.activityPanel}>
          <h2>Recent Activity</h2>

          <ul style={styles.activityList}>
            <li>Student records module loaded successfully.</li>
            <li>Attendance threshold monitoring enabled.</li>
            <li>Role-based access active for {role}.</li>
            <li>System operating in local frontend mode.</li>
          </ul>
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

  title: {
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
  },

  roleBadge: {
    background: "#dbeafe",
    color: "#1e3a8a",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  cardIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#e8f0ff",
    color: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  panel: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "15px",
  },

  riskText: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  goodText: {
    color: "#16a34a",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  actionBtn: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },

  secondaryBtn: {
    padding: "10px 14px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  activityPanel: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },

  activityList: {
    lineHeight: "1.8",
  },
};