import { FaBell } from "react-icons/fa";

export default function Topbar() {
  return (
    <div style={styles.topbar}>
      <h2>Student Records Management System</h2>

      <div style={styles.user}>
        <FaBell />

        <div>
          <div style={{ fontWeight: "600" }}>
            Admin User
          </div>

          <div style={{ fontSize: "12px" }}>
            Administrator
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "70px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    borderBottom: "1px solid #ddd",
  },

  user: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
};