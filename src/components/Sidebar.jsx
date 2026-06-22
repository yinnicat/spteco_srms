import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaCalendarCheck,
  FaCertificate,
  FaFileAlt,
  FaUsers,
  FaDatabase,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const role = loggedInUser?.role;

  const allMenuItems = [
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

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2>SPTECO</h2>
        <p>SRMS</p>

        {loggedInUser && (
          <div style={styles.userBox}>
            <strong>{loggedInUser.fullname}</strong>
            <span>{loggedInUser.role}</span>
          </div>
        )}
      </div>

      <div>
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
              color:
                location.pathname === item.path
                  ? "#1e3a8a"
                  : "#333",
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
    background: "#fff",
    borderRight: "1px solid #ddd",
    minHeight: "100vh",
  },

  logo: {
    padding: "20px",
    borderBottom: "1px solid #ddd",
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
  },

  link: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "12px 20px",
    textDecoration: "none",
    margin: "5px",
    borderRadius: "6px",
    fontWeight: "500",
  },
};