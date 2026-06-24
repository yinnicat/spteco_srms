import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Enrolments() {
  const [enrolments, setEnrolments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedEnrolments = JSON.parse(localStorage.getItem("enrolments")) || [];
    setEnrolments(savedEnrolments);
  }, []);

  const deleteEnrolment = (enrolmentId) => {
    const confirmDelete = window.confirm("Delete this enrolment?");

    if (!confirmDelete) return;

    const updatedEnrolments = enrolments.filter(
      (enrolment) => enrolment.enrolmentId !== enrolmentId
    );

    localStorage.setItem("enrolments", JSON.stringify(updatedEnrolments));
    setEnrolments(updatedEnrolments);
  };

  const filteredEnrolments = enrolments.filter(
    (enrolment) =>
      (enrolment.studentNo || "").toLowerCase().includes(search.toLowerCase()) ||
      (enrolment.studentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (enrolment.programme || "").toLowerCase().includes(search.toLowerCase()) ||
      (enrolment.level || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Enrolments</h1>
            <p style={styles.subtitle}>
              Manage student programme enrolments and academic status
            </p>
          </div>

          <Link to="/enrolments/add">
            <button style={styles.addBtn}>+ New Enrolment</button>
          </Link>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Enrolments</h3>
            <h1>{enrolments.length}</h1>
          </div>

          <div style={styles.card}>
            <h3>Active Enrolments</h3>
            <h1>{enrolments.filter((item) => item.status === "Active").length}</h1>
          </div>

          <div style={styles.cardWarning}>
            <h3>Deferred</h3>
            <h1>{enrolments.filter((item) => item.status === "Deferred").length}</h1>
          </div>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search by student number, name, programme, or level..."
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
                <th>Student Name</th>
                <th>Programme</th>
                <th>Faculty</th>
                <th>Level</th>
                <th>Enrolment Date</th>
                <th>Status</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnrolments.length === 0 && (
                <tr>
                  <td colSpan="9" style={styles.empty}>
                    Enrolment records will appear here once added or connected to the backend.
                  </td>
                </tr>
              )}

              {filteredEnrolments.map((enrolment) => (
                <tr key={enrolment.enrolmentId}>
                  <td>{enrolment.studentNo}</td>
                  <td>{enrolment.studentName}</td>
                  <td>{enrolment.programme}</td>
                  <td>{enrolment.faculty}</td>
                  <td>{enrolment.level}</td>
                  <td>{enrolment.enrolmentDate}</td>

                  <td>
                    <span
                      style={
                        enrolment.status === "Active"
                          ? styles.activeBadge
                          : styles.warningBadge
                      }
                    >
                      {enrolment.status}
                    </span>
                  </td>

                  <td>
                    <Link to={`/enrolments/details/${enrolment.enrolmentId}`}>
                      <button style={styles.viewBtn}>View</button>
                    </Link>
                  </td>

                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteEnrolment(enrolment.enrolmentId)}
                    >
                      Delete
                    </button>
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
  container: { background: "#f5f6fa", minHeight: "100vh" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: { margin: 0, color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280" },
  addBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
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
  cardWarning: {
    background: "#ffedd5",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  searchSection: { marginBottom: "20px" },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    overflowX: "auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  warningBadge: {
    background: "#ffedd5",
    color: "#9a3412",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  viewBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};