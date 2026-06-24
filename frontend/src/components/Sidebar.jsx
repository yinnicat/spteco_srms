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
  FaBuilding,
  FaCalendarCheck,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const role = loggedInUser.role || "Lecturer";

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      name: "Students",
      icon: <FaUserGraduate />,
      path: "/students",
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      name: "Staff",
      icon: <FaChalkboardTeacher />,
      path: "/staff",
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      name: "Departments",
      icon: <FaBuilding />,
      path: "/departments",
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      name: "Courses",
      icon: <FaBook />,
      path: "/courses",
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      name: "Enrolments",
      icon: <FaClipboardList />,
      path: "/enrolments",
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      name: "Attendance",
      icon: <FaCalendarCheck />,
      path: "/attendance",
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      name: "Certificates",
      icon: <FaCertificate />,
      path: "/certificates",
      roles: ["Database Admin", "Admin Staff"],
    },
    {
      name: "Reports",
      icon: <FaFileAlt />,
      path: "/reports",
      roles: ["Database Admin", "Admin Staff", "Lecturer"],
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/users",
      roles: ["Database Admin"],
    },
    {
      name: "Data Migration",
      icon: <FaDatabase />,
      path: "/migration",
      roles: ["Database Admin"],
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
      roles: ["Database Admin"],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoTitle}>SPTECO</h2>
        <p style={styles.logoSubtitle}>SRMS</p>

        <div style={styles.userBox}>
          <strong>
            {loggedInUser.fullname ||
              loggedInUser.username ||
              "System User"}
          </strong>

          <span>{role}</span>
        </div>
      </div>

      <div style={styles.menu}>
        {visibleMenuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                background: active ? "#e8f0ff" : "transparent",
                color: active ? "#1e3a8a" : "#333",
                fontWeight: active ? "700" : "500",
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #ddd",
    position: "fixed",
    left: 0,
    top: 0,
    overflowY: "auto",
    zIndex: 10,
  },

  logo: {
    padding: "20px",
    borderBottom: "1px solid #ddd",
  },

  logoTitle: {
    margin: 0,
    color: "#1e3a8a",
    fontSize: "26px",
  },

  logoSubtitle: {
    fontSize: "12px",
    marginTop: "4px",
    color: "#6b7280",
  },

  userBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#f5f6fa",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
    color: "#111827",
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
  },
};