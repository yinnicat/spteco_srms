import Layout from "../components/Layout";
import { useState } from "react";
import { FaBuilding, FaPlus, FaSearch } from "react-icons/fa";

export default function Departments() {
  const [search, setSearch] = useState("");

  const departments = [];

  const filteredDepartments = departments.filter(
    (department) =>
      (department.code || "").toLowerCase().includes(search.toLowerCase()) ||
      (department.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (department.faculty || "").toLowerCase().includes(search.toLowerCase())
  );

  const addDepartment = () => {
    alert("Add Department will be connected to the backend.");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Departments</h1>
            <p>Manage college departments and faculty structures</p>
          </div>

          <FaBuilding style={styles.icon} />
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Departments</h3>
            <h1>{departments.length}</h1>
          </div>

          <div style={styles.card}>
            <h3>Active Departments</h3>
            <h1>
              {departments.filter((item) => item.status === "Active").length}
            </h1>
          </div>

          <div style={styles.card}>
            <h3>Faculties</h3>
            <h1>
              {new Set(departments.map((item) => item.faculty).filter(Boolean)).size}
            </h1>
          </div>
        </div>

        <div style={styles.actionBar}>
          <div style={styles.searchBox}>
            <FaSearch />

            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button onClick={addDepartment} style={styles.addBtn}>
            <FaPlus />
            Add Department
          </button>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Department Code</th>
                <th>Department Name</th>
                <th>Faculty</th>
                <th>Head of Department</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.length === 0 && (
                <tr>
                  <td colSpan="5" style={styles.empty}>
                    Department records will appear here once connected to the backend.
                  </td>
                </tr>
              )}

              {filteredDepartments.map((department) => (
                <tr key={department.code}>
                  <td>{department.code}</td>
                  <td>{department.name}</td>
                  <td>{department.faculty}</td>
                  <td>{department.hod || "-"}</td>
                  <td>
                    <span style={styles.activeBadge}>{department.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  icon: {
    fontSize: "50px",
    color: "#1e3a8a",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  actionBar: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },

  searchBox: {
    flex: 1,
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
  },

  addBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
  },
};