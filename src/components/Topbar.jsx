import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function Topbar() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    navigate("/");
  };

  const today = new Date().toLocaleString();

  return (
    <div style={styles.topbar}>
      <div>
        <h2 style={styles.title}>
          Student Records Management System
        </h2>

        <p style={styles.date}>
          {today}
        </p>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.userCard}>
          <strong>
            {loggedInUser?.fullname}
          </strong>

          <span style={styles.role}>
            {loggedInUser?.role}
          </span>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
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
    background: "#fff",

    padding: "15px 25px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    borderBottom: "1px solid #ddd",

    boxShadow:
      "0 2px 5px rgba(0,0,0,0.05)",
  },

  title: {
    margin: 0,

    fontSize: "24px",

    color: "#111827",
  },

  date: {
    marginTop: "5px",

    color: "#6b7280",

    fontSize: "13px",
  },

  rightSection: {
    display: "flex",

    alignItems: "center",

    gap: "20px",
  },

  userCard: {
    display: "flex",

    flexDirection: "column",

    alignItems: "flex-end",
  },

  role: {
    background: "#dbeafe",

    color: "#1e3a8a",

    padding: "4px 10px",

    borderRadius: "20px",

    fontSize: "12px",

    marginTop: "5px",
  },

  logoutBtn: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    background: "#ef4444",

    color: "#fff",

    border: "none",

    padding: "10px 15px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",
  },
};