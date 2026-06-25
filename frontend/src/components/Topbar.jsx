import { FaBell, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "";
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={styles.topbar}>
      <div>
        <h2 style={styles.title}>Student Records Management System</h2>
        <div style={styles.date}>
          <FaCalendarAlt />
          <span>{today}</span>
        </div>
      </div>
      <div style={styles.userSection}>
        <FaBell style={styles.bell} />
        <div style={styles.userCard}>
          <div style={styles.name}>{username}</div>
          <div style={styles.role}>{role}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  topbar: { height: "70px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 5 },
  title: { margin: 0, fontSize: "20px", color: "#111827" },
  date: { display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", color: "#6b7280", fontSize: "13px" },
  userSection: { display: "flex", alignItems: "center", gap: "16px" },
  bell: { fontSize: "18px", cursor: "pointer", color: "#374151" },
  userCard: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  name: { fontWeight: "700", color: "#111827", fontSize: "14px" },
  role: { fontSize: "12px", color: "#6b7280" },
};