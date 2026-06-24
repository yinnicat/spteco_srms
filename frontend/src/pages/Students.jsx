import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students")) || [];
    setStudents(savedStudents);
  }, []);

  const deleteStudent = (studentNo) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    const updatedStudents = students.filter(
      (student) => student.studentNo !== studentNo
    );

    localStorage.setItem("students", JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter((student) => {
    const fullName =
      student.name || `${student.firstName || ""} ${student.lastName || ""}`;

    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      (student.studentNo || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.programme || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.faculty || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Students</h1>

          <Link to="/students/add">
            <button style={styles.addBtn}>+ Add Student</button>
          </Link>
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryCard}>
            <h3>Total Students</h3>
            <h2>{students.length}</h2>
          </div>

          <div style={styles.summaryCard}>
            <h3>SEN Students</h3>
            <h2>{students.filter((s) => s.sen === "Yes").length}</h2>
          </div>

          <div style={styles.summaryCard}>
            <h3>OVC Students</h3>
            <h2>{students.filter((s) => s.ovc === "Yes").length}</h2>
          </div>

          <div style={styles.summaryCard}>
            <h3>Active Students</h3>
            <h2>{students.filter((s) => s.status === "Active").length}</h2>
          </div>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
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
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="9" style={styles.empty}>
                    Student records will appear here once added or connected to
                    the backend.
                  </td>
                </tr>
              )}

              {filteredStudents.map((student) => {
                const fullName =
                  student.name ||
                  `${student.firstName || ""} ${student.lastName || ""}`;

                return (
                  <tr key={student.studentNo}>
                    <td>{student.studentNo}</td>
                    <td>{fullName}</td>
                    <td>{student.programme}</td>
                    <td>{student.faculty}</td>
                    <td>
                      <span style={styles.active}>{student.status}</span>
                    </td>
                    <td>{student.sen}</td>
                    <td>{student.ovc}</td>
                    <td>
                      <Link to={`/students/profile/${student.studentNo}`}>
                        <button style={styles.viewBtn}>View</button>
                      </Link>
                    </td>
                    <td>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteStudent(student.studentNo)}
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

  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  summaryCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
  },

  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    overflowX: "auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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