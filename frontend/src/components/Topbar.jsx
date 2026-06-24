import {
  FaBell,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const loggedInUser =
    JSON.parse(
      localStorage.getItem("loggedInUser")
    ) || {};

  const today =
    new Date().toLocaleDateString();

  const handleLogout = () => {
    localStorage.removeItem(
      "loggedInUser"
    );

    navigate("/");
  };

  return (
    <div style={styles.topbar}>
      <div>
        <h2 style={styles.title}>
          Student Records Management System
        </h2>

        <div style={styles.date}>
          <FaCalendarAlt />

          <span>{today}</span>
        </div>
      </div>

      <div style={styles.userSection}>
        <FaBell style={styles.bell} />

        <div style={styles.userCard}>
          <div style={styles.name}>
            {loggedInUser.fullname ||
              "System User"}
          </div>

          <div style={styles.role}>
            {loggedInUser.role ||
              "User"}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
        >
          <FaSignOutAlt />

          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "75px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    borderBottom: "1px solid #ddd",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    color: "#111827",
  },

  date: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "14px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  bell: {
    fontSize: "20px",
    cursor: "pointer",
    color: "#374151",
  },

  userCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },

  name: {
    fontWeight: "700",
    color: "#111827",
  },

  role: {
    fontSize: "13px",
    color: "#6b7280",
  },

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};