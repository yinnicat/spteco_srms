import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedStaff = JSON.parse(localStorage.getItem("staff")) || [];
    setStaff(savedStaff);
  }, []);

  const deleteStaff = (staffId) => {
    const confirmDelete = window.confirm("Delete this staff member?");
    if (!confirmDelete) return;

    const updatedStaff = staff.filter((item) => item.staffId !== staffId);

    localStorage.setItem("staff", JSON.stringify(updatedStaff));
    setStaff(updatedStaff);
  };

  const filteredStaff = staff.filter((item) => {
    const fullName =
      item.name || `${item.firstName || ""} ${item.lastName || ""}`;

    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      (item.staffId || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.department || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.position || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Staff Management</h1>

          <Link to="/staff/add">
            <button style={styles.addBtn}>+ Add Staff</button>
          </Link>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Email</th>
                <th>Status</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="8" style={styles.empty}>
                    Staff records will appear here once added or connected to the backend.
                  </td>
                </tr>
              )}

              {filteredStaff.map((item) => {
                const fullName =
                  item.name || `${item.firstName || ""} ${item.lastName || ""}`;

                return (
                  <tr key={item.staffId}>
                    <td>{item.staffId}</td>
                    <td>{fullName}</td>
                    <td>{item.department || "-"}</td>
                    <td>{item.position || "-"}</td>
                    <td>{item.email || "-"}</td>

                    <td>
                      <span style={styles.active}>
                        {item.status || "Active"}
                      </span>
                    </td>

                    <td>
                      <Link to={`/staff/profile/${item.staffId}`}>
                        <button style={styles.viewBtn}>View</button>
                      </Link>
                    </td>

                    <td>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteStaff(item.staffId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

  addBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  searchSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  searchInput: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  active: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
  },
};