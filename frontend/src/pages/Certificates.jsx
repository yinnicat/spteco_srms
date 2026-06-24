import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { FaCertificate, FaSearch } from "react-icons/fa";

export default function Certificates() {
  const [search, setSearch] = useState("");
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const savedCertificates =
      JSON.parse(localStorage.getItem("certificates")) || [];

    setCertificates(savedCertificates);
  }, []);

  const markCollected = (id) => {
    const updatedCertificates = certificates.map((certificate) =>
      certificate.id === id
        ? {
            ...certificate,
            status: "Collected",
            collectionDate: new Date().toLocaleDateString(),
            collectedBy: certificate.studentName || "Student",
          }
        : certificate
    );

    localStorage.setItem("certificates", JSON.stringify(updatedCertificates));
    setCertificates(updatedCertificates);
  };

  const filteredCertificates = certificates.filter(
    (certificate) =>
      (certificate.studentNo || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (certificate.studentName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (certificate.programme || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const collectedCount = certificates.filter(
    (certificate) => certificate.status === "Collected"
  ).length;

  const uncollectedCount = certificates.filter(
    (certificate) => certificate.status === "Uncollected"
  ).length;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Certificate Collection</h1>
            <p>Track issued certificates and collection status</p>
          </div>

          <FaCertificate style={styles.icon} />
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Certificates</h3>
            <h1>{certificates.length}</h1>
          </div>

          <div style={styles.card}>
            <h3>Collected</h3>
            <h1>{collectedCount}</h1>
          </div>

          <div style={styles.cardDanger}>
            <h3>Uncollected</h3>
            <h1>{uncollectedCount}</h1>
          </div>
        </div>

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            type="text"
            placeholder="Search certificate..."
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
                <th>Issue Date</th>
                <th>Collection Date</th>
                <th>Collected By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCertificates.length === 0 && (
                <tr>
                  <td colSpan="8" style={styles.empty}>
                    Certificate records will appear here once added or connected
                    to the backend.
                  </td>
                </tr>
              )}

              {filteredCertificates.map((certificate) => (
                <tr key={certificate.id}>
                  <td>{certificate.studentNo}</td>
                  <td>{certificate.studentName}</td>
                  <td>{certificate.programme}</td>
                  <td>{certificate.issueDate || "-"}</td>
                  <td>{certificate.collectionDate || "-"}</td>
                  <td>{certificate.collectedBy || "-"}</td>

                  <td>
                    <span
                      style={
                        certificate.status === "Collected"
                          ? styles.goodBadge
                          : styles.badBadge
                      }
                    >
                      {certificate.status}
                    </span>
                  </td>

                  <td>
                    {certificate.status === "Uncollected" ? (
                      <button
                        style={styles.collectBtn}
                        onClick={() => markCollected(certificate.id)}
                      >
                        Mark Collected
                      </button>
                    ) : (
                      <span style={styles.doneText}>Done</span>
                    )}
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

  cardDanger: {
    background: "#fee2e2",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  searchBox: {
    background: "#fff",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #d1d5db",
  },

  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    overflowX: "auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  goodBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  badBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  collectBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  doneText: {
    color: "#166534",
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
  },
};