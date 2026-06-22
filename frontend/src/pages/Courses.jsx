import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Courses() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Courses</h1>

          <Link to="/courses/add">
            <button style={styles.addBtn}>
              + Add Course
            </button>
          </Link>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search course..."
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
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                <th>Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>EE-N6</td>
                <td>Electrical Engineering</td>
                <td>Engineering</td>
                <td>N6</td>
                <td>Active</td>
                <td>
                  <Link to="/courses/details">
                    <button style={styles.viewBtn}>
                      View
                    </button>
                  </Link>
                </td>
              </tr>

              <tr>
                <td>BM-N4</td>
                <td>Business Management</td>
                <td>Business</td>
                <td>N4</td>
                <td>Active</td>
                <td>
                  <Link to="/courses/details">
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
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  addBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
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
  },
};