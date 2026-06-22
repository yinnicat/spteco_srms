import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Staff() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Staff Management</h1>

          <Link to="/staff/add">
            <button style={styles.addBtn}>
              + Add Staff
            </button>
          </Link>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search staff..."
            style={styles.searchInput}
          />

          <button style={styles.searchBtn}>
            Search
          </button>
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>EMP001</td>
                <td>John Smith</td>
                <td>Engineering</td>
                <td>Lecturer</td>
                <td>john@spteco.ac.bw</td>
                <td>Active</td>
                <td>
                  <Link to="/staff/profile">
                    <button style={styles.viewBtn}>
                      View
                    </button>
                  </Link>
                </td>
              </tr>

              <tr>
                <td>EMP002</td>
                <td>Mary Dube</td>
                <td>Business</td>
                <td>HOD</td>
                <td>mary@spteco.ac.bw</td>
                <td>Active</td>
                <td>
                  <Link to="/staff/profile">
                    <button style={styles.viewBtn}>
                      View
                    </button>
                  </Link>
                </td>
              </tr>
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
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  addBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  searchSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  searchInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },

  searchBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};