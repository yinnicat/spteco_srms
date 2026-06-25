import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook,
  FaClipboardList, FaCertificate, FaFileAlt, FaUsers,
  FaDatabase, FaCog, FaBuilding, FaCalendarCheck, FaCubes,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "Lecturer";
  const username = localStorage.getItem("username") || "User";

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard", roles: ["DB Admin", "Admin", "Lecturer"] },
    { name: "Students", icon: <FaUserGraduate />, path: "/students", roles: ["DB Admin", "Admin", "Lecturer"] },
    { name: "Staff", icon: <FaChalkboardTeacher />, path: "/staff", roles: ["DB Admin", "Admin"] },
    { name: "Departments", icon: <FaBuilding />, path: "/departments", roles: ["DB Admin", "Admin"] },
    { name: "Courses", icon: <FaBook />, path: "/courses", roles: ["DB Admin", "Admin", "Lecturer"] },
    { name: "Modules", icon: <FaCubes />, path: "/modules", roles: ["DB Admin", "Admin", "Lecturer"] },
    { name: "Enrolments", icon: <FaClipboardList />, path: "/enrolments", roles: ["DB Admin", "Admin"] },
    { name: "Attendance", icon: <FaCalendarCheck />, path: "/attendance", roles: ["DB Admin", "Admin", "Lecturer"] },
    { name: "Certificates", icon: <FaCertificate />, path: "/certificates", roles: ["DB Admin", "Admin"] },
    { name: "Reports", icon: <FaFileAlt />, path: "/reports", roles: ["DB Admin", "Admin", "Lecturer"] },
    { name: "Users", icon: <FaUsers />, path: "/users", roles: ["DB Admin"] },
    { name: "Data Migration", icon: <FaDatabase />, path: "/migration", roles: ["DB Admin", "Admin"] },
    { name: "Settings", icon: <FaCog />, path: "/settings", roles: ["DB Admin", "Admin", "Lecturer"] },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const visible = menuItems.filter(item => item.roles.includes(role));

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoTitle}>SPTECO</h2>
        <p style={styles.logoSubtitle}>Student Records Management System</p>
        <div style={styles.userBox}>
          <strong>{username}</strong>
          <span style={styles.roleBadge}>{role}</span>
        </div>
      </div>

      <div style={styles.menu}>
        {visible.map((item) => {
          const active = location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                background: active ? "#e8f0ff" : "transparent",
                color: active ? "#1e3a8a" : "#374151",
                fontWeight: active ? "700" : "500",
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div style={styles.logoutSection}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: { width: "260px", height: "100vh", background: "#fff", borderRight: "1px solid #e5e7eb", position: "fixed", left: 0, top: 0, overflowY: "auto", zIndex: 10, display: "flex", flexDirection: "column" },
  logo: { padding: "20px", borderBottom: "1px solid #e5e7eb" },
  logoTitle: { margin: 0, color: "#1e3a8a", fontSize: "24px" },
  logoSubtitle: { fontSize: "11px", marginTop: "4px", color: "#6b7280" },
  userBox: { marginTop: "12px", padding: "10px", background: "#f5f6fa", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" },
  roleBadge: { background: "#dbeafe", color: "#1e3a8a", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", width: "fit-content" },
  menu: { display: "flex", flexDirection: "column", padding: "10px", flex: 1 },
  link: { display: "flex", alignItems: "center", gap: "10px", padding: "11px 12px", marginBottom: "3px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", transition: "background 0.15s" },
  logoutSection: { padding: "16px", borderTop: "1px solid #e5e7eb" },
  logoutBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#fee2e2", color: "#dc2626", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", width: "100%", fontSize: "14px" },
};