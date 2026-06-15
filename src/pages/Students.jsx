import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Students() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Students</h1>

          <Link to="/students/add">
            <button style={styles.addBtn}>
              + Add Student
            </button>
          </Link>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search student..."
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
                <th>Student No</th>
                <th>Name</th>
                <th>Programme</th>
                <th>Faculty</th>
                <th>Status</th>
                <th>SEN</th>
                <th>OVC</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>STU001</td>
                <td>Kabelo Mokoena</td>
                <td>Electrical Engineering</td>
                <td>Engineering</td>
                <td>Active</td>
                <td>No</td>
                <td>No</td>
                <td>
                  <Link to="/students/profile">
                  <button style={styles.viewBtn}>
                   View
                   </button>
                   </Link>
                </td>
              </tr>

              <tr>
                <td>STU002</td>
                <td>Neo Phiri</td>
                <td>Business Management</td>
                <td>Business</td>
                <td>Active</td>
                <td>Yes</td>
                <td>No</td>
                <td>
                  <Link to="/students/profile">
                  <button style={styles.viewBtn}>
                    View
                   </button>
                   </Link>
                </td>
              </tr>

              <tr>
                <td>STU003</td>
                <td>Boitumelo Rapopeba</td>
                <td>Civil Engineering</td>
                <td>Engineering</td>
                <td>Active</td>
                <td>No</td>
                <td>Yes</td>
                <td>
                  <Link to="/students/profile">
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
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  searchBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#111827",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
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