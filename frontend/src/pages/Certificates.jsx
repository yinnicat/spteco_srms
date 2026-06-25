import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaCertificate, FaSearch } from "react-icons/fa";

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [collectedFilter, setCollectedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const role = localStorage.getItem("role");

  useEffect(() => { fetchCertificates(); }, [page, collectedFilter]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (collectedFilter !== "") params.append("collected", collectedFilter);
      const response = await apiFetch(`/certificates/?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setCertificates(data.certificates);
      setTotal(data.total);
    } catch {
      setError("Failed to load certificates.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCollected = async (certId) => {
    if (!window.confirm("Mark this certificate as collected?")) return;
    try {
      const response = await apiFetch(`/certificates/${certId}/collect`, {
        method: "PATCH",
        body: JSON.stringify({
          collection_date: new Date().toISOString().split("T")[0],
        }),
      });
      if (response.ok) fetchCertificates();
      else alert("Failed to mark as collected.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const filtered = certificates.filter(c =>
    (c.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.student_no || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.course_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const collected = certificates.filter(c => c.collected).length;
  const uncollected = certificates.filter(c => !c.collected).length;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Certificate Collection</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Track issued certificates and collection status
            </p>
          </div>
          <FaCertificate style={styles.icon} />
        </div>

        {/* Summary cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3 style={styles.cardLabel}>Total Certificates</h3>
            <h2 style={styles.cardValue}>{total}</h2>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardLabel}>Collected</h3>
            <h2 style={{ ...styles.cardValue, color: "#166534" }}>{collected}</h2>
          </div>
          <div style={{
            ...styles.card,
            borderLeft: uncollected > 0 ? "4px solid #dc2626" : "4px solid #d1d5db"
          }}>
            <h3 style={styles.cardLabel}>Uncollected</h3>
            <h2 style={{ ...styles.cardValue, color: uncollected > 0 ? "#dc2626" : "#111827" }}>
              {uncollected}
            </h2>
          </div>
        </div>

        {/* Search and filter */}
        <div style={styles.filterRow}>
          <div style={styles.searchBox}>
            <FaSearch color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by student name, number or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <select
            value={collectedFilter}
            onChange={(e) => { setCollectedFilter(e.target.value); setPage(1); }}
            style={styles.filterSelect}
          >
            <option value="">All</option>
            <option value="false">Uncollected</option>
            <option value="true">Collected</option>
          </select>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Issue Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Collection Date</th>
                  <th style={styles.th}>Notes</th>
                  {(role === "Admin" || role === "DB Admin") && (
                    <th style={styles.th}>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.empty}>No certificates found.</td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td style={styles.td}>
                        <Link to={`/students/profile/${c.student_no}`} style={styles.studentLink}>
                          {c.student_name}
                        </Link>
                        <br />
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>{c.student_no}</span>
                      </td>
                      <td style={styles.td}>{c.course_name}</td>
                      <td style={styles.td}>{c.issue_date}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: c.collected ? "#dcfce7" : "#fee2e2",
                          color: c.collected ? "#166534" : "#991b1b",
                        }}>
                          {c.collected ? "✓ Collected" : "Not Collected"}
                        </span>
                      </td>
                      <td style={styles.td}>{c.collection_date || "—"}</td>
                      <td style={styles.td}>{c.notes || "—"}</td>
                      {(role === "Admin" || role === "DB Admin") && (
                        <td style={styles.td}>
                          {!c.collected ? (
                            <button
                              style={styles.collectBtn}
                              onClick={() => handleMarkCollected(c.id)}
                            >
                              Mark Collected
                            </button>
                          ) : (
                            <span style={{ color: "#166534", fontWeight: "600", fontSize: "13px" }}>
                              ✓ Done
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {total > limit && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </button>
            <span style={styles.pageInfo}>Page {page} — {total} total</span>
            <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={certificates.length < limit}>
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  icon: { fontSize: "40px", color: "#1e3a8a" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" },
  cardValue: { margin: 0, fontSize: "28px", color: "#111827" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchBox: { flex: 2, background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", gap: "10px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  filterSelect: { flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  studentLink: { color: "#1e3a8a", textDecoration: "none", fontWeight: "600" },
  collectBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" },
  pageBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  pageInfo: { color: "#6b7280", fontSize: "14px" },
};