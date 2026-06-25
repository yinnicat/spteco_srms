import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import {
  FaChalkboardTeacher, FaBook, FaClipboardList,
  FaCertificate, FaUsers, FaCheckCircle, FaExclamationTriangle,
} from "react-icons/fa";

function AtRiskNotice() {
  const [atRiskCount, setAtRiskCount] = useState(0);

  useEffect(() => {
    apiFetch("/attendance/at-risk")
      .then((r) => r.json())
      .then((data) => setAtRiskCount(data.length))
      .catch(() => {});
  }, []);

  return (
    <div style={{ ...styles.noticeCard, borderColor: atRiskCount > 0 ? "#dc2626" : "#16a34a" }}>
      {atRiskCount > 0
        ? <FaExclamationTriangle style={{ fontSize: "28px", color: "#dc2626" }} />
        : <FaCheckCircle style={{ fontSize: "28px", color: "#16a34a" }} />
      }
      <div>
        {atRiskCount > 0 ? (
          <>
            <h3 style={{ color: "#dc2626", margin: "0 0 4px 0" }}>Attendance Alert</h3>
            <p style={{ margin: 0 }}>
              {atRiskCount} student(s) are below the attendance threshold.{" "}
              <Link to="/attendance/analytics" style={{ color: "#dc2626", fontWeight: "600" }}>
                View at-risk students →
              </Link>
            </p>
          </>
        ) : (
          <>
            <h3 style={{ color: "#16a34a", margin: "0 0 4px 0" }}>All Clear</h3>
            <p style={{ margin: 0 }}>No students are currently below the attendance threshold.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role") || "Lecturer";
  const username = localStorage.getItem("username") || "User";

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiFetch("/reports/dashboard");
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div style={styles.center}>Loading...</div></Layout>;
  if (error) return <Layout><div style={styles.center}>{error}</div></Layout>;

  const statCards = [
    { title: "Total Staff", value: stats.total_staff, icon: <FaChalkboardTeacher />, roles: ["DB Admin", "Admin"] },
    { title: "Courses", value: stats.total_courses, icon: <FaBook />, roles: ["DB Admin", "Admin", "Lecturer"] },
    { title: "Active Enrolments", value: stats.active_enrolments, icon: <FaClipboardList />, roles: ["DB Admin", "Admin"] },
    { title: "Uncollected Certificates", value: stats.uncollected_certificates, icon: <FaCertificate />, roles: ["DB Admin", "Admin"] },
    { title: "SEN Students", value: stats.sen_students, icon: <FaUsers />, roles: ["DB Admin", "Admin"] },
    { title: "OVC Students", value: stats.ovc_students, icon: <FaUsers />, roles: ["DB Admin", "Admin"] },
  ];

  const visibleStats = statCards.filter((item) => item.roles.includes(role));

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subheading}>Welcome back, {username} — {role}</p>
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
              <Link to="/enrolments" style={styles.viewAll}>View all</Link>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Enrolment Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_enrolments.length === 0 ? (
                  <tr><td colSpan="4" style={styles.empty}>No recent enrolments</td></tr>
                ) : (
                  stats.recent_enrolments.map((e) => (
                    <tr key={e.id}>
                      <td style={styles.td}>{e.student_no}<br /><strong>{e.student_name}</strong></td>
                      <td style={styles.td}>{e.course_name}</td>
                      <td style={styles.td}>{e.enrolment_date}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: e.status === "Active" ? "#dcfce7" : "#fee2e2",
                          color: e.status === "Active" ? "#166534" : "#991b1b",
                        }}>{e.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.quickCard}>
            <h2>Quick Actions</h2>
            <div style={styles.actions}>
              {(role === "DB Admin" || role === "Admin") && (
                <>
                  <Link to="/students/add"><button style={styles.actionBtn}>Add Student</button></Link>
                  <Link to="/enrolments/add"><button style={styles.actionBtn}>New Enrolment</button></Link>
                  <Link to="/certificates"><button style={styles.actionBtn}>Certificate Collection</button></Link>
                </>
              )}
              <Link to="/attendance">
  <button style={styles.actionBtn}>Mark Attendance</button>
</Link>
<Link to="/attendance/analytics">
  <button style={styles.actionBtn}>Attendance Analytics</button>
</Link>
              <Link to="/reports"><button style={styles.actionBtn}>Reports</button></Link>
              {role === "DB Admin" && (
                <>
                  <Link to="/users"><button style={styles.actionBtn}>User Management</button></Link>
                  <Link to="/migration"><button style={styles.actionBtn}>Data Migration</button></Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Alert — Lecturers only */}
        {role === "Lecturer" && <AtRiskNotice />}

      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  heading: { margin: 0, color: "#111827" },
  subheading: { marginTop: "6px", color: "#6b7280" },
  roleBadge: { background: "#dbeafe", color: "#1e3a8a", padding: "8px 16px", borderRadius: "20px", fontWeight: "700" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "25px" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "15px" },
  iconBox: { width: "46px", height: "46px", background: "#e8f0ff", color: "#1e3a8a", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "22px" },
  cardTitle: { color: "#6b7280", fontSize: "14px", marginBottom: "8px" },
  cardValue: { fontSize: "30px", margin: 0, color: "#111827" },
  contentGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" },
  tableCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", overflowX: "auto" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  viewAll: { color: "#1e3a8a", textDecoration: "none", fontSize: "14px", fontWeight: "700" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  quickCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  actions: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" },
  actionBtn: { width: "100%", background: "#1e3a8a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "600", fontSize: "14px" },
  noticeCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "flex", gap: "15px", alignItems: "center", borderLeft: "5px solid" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "16px", color: "#6b7280" },
};