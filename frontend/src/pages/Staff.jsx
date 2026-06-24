import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function Staff() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const role = localStorage.getItem("role");

  useEffect(() => { fetchStaff(); }, [page, search]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append("search", search);
      const response = await apiFetch(`/staff/?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setStaff(data);
      setTotal(data.length);
    } catch (err) {
      setError("Failed to load staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const action = newStatus === "Inactive" ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this staff member?`)) return;
    try {
      const response = await apiFetch(`/staff/${id}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      if (response.ok) fetchStaff();
      else {
        const data = await response.json();
        alert(data.detail || "Failed to update status.");
      }
    } catch {
      alert("Could not connect to server.");
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Staff Management</h1>
          {(role === "Admin" || role === "DB Admin") && (
            <Link to="/staff/add">
              <button style={styles.addBtn}>+ Add Staff</button>
            </Link>
          )}
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search by name, staff number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={styles.searchInput}
          />
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Staff No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr><td colSpan="6" style={styles.empty}>No staff records found.</td></tr>
                ) : (
                  staff.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>{item.staff_no}</td>
                      <td style={styles.td}>{item.first_name} {item.last_name}</td>
                      <td style={styles.td}>{item.department || "—"}</td>
                      <td style={styles.td}>{item.email || "—"}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: item.status === "Active" ? "#dcfce7" : "#fee2e2",
                          color: item.status === "Active" ? "#166534" : "#991b1b",
                        }}>{item.status}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <Link to={`/staff/profile/${item.id}`}>
                            <button style={styles.viewBtn}>View</button>
                          </Link>
                          {(role === "Admin" || role === "DB Admin") && (
                            <button
                              style={item.status === "Active" ? styles.deactivateBtn : styles.activateBtn}
                              onClick={() => handleDeactivate(item.id, item.status)}
                            >
                              {item.status === "Active" ? "Deactivate" : "Reactivate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {total > limit && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </button>
            <span style={styles.pageInfo}>Page {page}</span>
            <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={staff.length < limit}>
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  addBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  searchSection: { marginBottom: "20px" },
  searchInput: { width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", boxSizing: "border-box" },
  tableCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionRow: { display: "flex", gap: "8px" },
  viewBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" },
  pageBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  pageInfo: { color: "#6b7280", fontSize: "14px" },
};