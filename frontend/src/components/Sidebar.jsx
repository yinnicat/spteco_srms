import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaCertificate,
  FaFileAlt,
  FaUsers,
  FaDatabase,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Students", icon: <FaUserGraduate />, path: "/students" },
    { name: "Staff", icon: <FaChalkboardTeacher />, path: "/staff" },
    { name: "Courses", icon: <FaBook />, path: "/courses" },
    { name: "Enrolments", icon: <FaClipboardList />, path: "/enrolments" },
    { name: "Certificates", icon: <FaCertificate />, path: "/certificates" },
    { name: "Reports", icon: <FaFileAlt />, path: "/reports" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Data Migration", icon: <FaDatabase />, path: "/migration" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2>SPTECO</h2>
        <p style={{ fontSize: "12px" }}>SRMS</p>
      </div>

      <div style={styles.menu}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              background:
                location.pathname === item.path
                  ? "#e8f0ff"
                  : "transparent",
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #ddd",
    position: "fixed",
    left: 0,
    top: 0,
  },

  logo: {
    padding: "20px",
    borderBottom: "1px solid #ddd",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    marginBottom: "5px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
};