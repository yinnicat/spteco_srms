import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function Enrolments() {
  const navigate = useNavigate();
  const [enrolments, setEnrolments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [page, setPage] = useState(1);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef(null);
  const limit = 20;

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchEnrolments();
    fetchTotals();
  }, [page, statusFilter, search]);

  // Close add menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchEnrolments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      const response = await apiFetch(`/enrolments/?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setEnrolments(data.enrolments);
      setTotal(data.total);
    } catch {
      setError("Failed to load enrolments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotals = async () => {
    try {
      const [activeRes, completedRes, withdrawnRes] = await Promise.all([
        apiFetch("/enrolments/?status=Active&limit=1"),
        apiFetch("/enrolments/?status=Completed&limit=1"),
        apiFetch("/enrolments/?status=Withdrawn&limit=1"),
      ]);
      const [a, c, w] = await Promise.all([
        activeRes.json(), completedRes.json(), withdrawnRes.json()
      ]);
      setTotalActive(a.total);
      setTotalCompleted(c.total);
      setTotalWithdrawn(w.total);
    } catch {}
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this enrolment?")) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await apiFetch(`/enrolments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Withdrawn", completion_date: today }),
      });
      if (response.ok) { fetchEnrolments(); fetchTotals(); }
      else alert("Failed to withdraw enrolment.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const statusColor = (status) => ({
    Active: { bg: "#dcfce7", text: "#166534" },
    Completed: { bg: "#dbeafe", text: "#1e3a8a" },
    Withdrawn: { bg: "#fee2e2", text: "#991b1b" },
  }[status] || { bg: "#f3f4f6", text: "#374151" });

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Enrolments</h1>
            <p style={styles.subtitle}>Manage student course enrolments</p>
          </div>
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.addWrapper} ref={addMenuRef}>
              <button
                style={styles.addBtn}
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                + Add ▾
              </button>
              {showAddMenu && (
                <div style={styles.addMenu}>
                  <Link to="/students/add" style={styles.addMenuItem} onClick={() => setShowAddMenu(false)}>
                    <strong>New Student</strong>
                    <span style={styles.addMenuDesc}>Register a new student</span>
                  </Link>
                  <div style={styles.addMenuDivider} />
                  <Link to="/enrolments/add" style={styles.addMenuItem} onClick={() => setShowAddMenu(false)}>
                    <strong>New Enrolment</strong>
                    <span style={styles.addMenuDesc}>Enrol an existing student</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div style={styles.cards}>
          {[
            { label: "Total", value: total },
            { label: "Active", value: totalActive },
            { label: "Completed", value: totalCompleted },
            { label: "Withdrawn", value: totalWithdrawn },
          ].map((item, i) => (
            <div key={i} style={styles.card}>
              <h3 style={styles.cardLabel}>{item.label}</h3>
              <h2 style={styles.cardValue}>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Search and filters */}
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by student name, number or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Withdrawn">Withdrawn</option>
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
                  <th style={styles.th}>Student No</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Enrolment Date</th>
                  <th style={styles.th}>Completion Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Certificate</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrolments.length === 0 ? (
                  <tr><td colSpan="8" style={styles.empty}>No enrolments found.</td></tr>
                ) : (
                  enrolments.map((e) => {
                    const sc = statusColor(e.status);
                    return (
                      <tr key={e.id}>
                        <td style={styles.td}>{e.student_no}</td>
                        <td style={styles.td}>{e.student_name}</td>
                        <td style={styles.td}>
                          {e.course_name}
                          <br />
                          <span style={{ color: "#6b7280", fontSize: "12px" }}>{e.course_code}</span>
                        </td>
                        <td style={styles.td}>{e.enrolment_date}</td>
                        <td style={styles.td}>{e.completion_date || "—"}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: sc.bg, color: sc.text }}>
                            {e.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {e.has_certificate
                            ? <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Issued</span>
                            : "—"
                          }
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionRow}>
                            <Link to={`/enrolments/details/${e.id}`}>
                              <button style={styles.viewBtn}>View</button>
                            </Link>
                            {(role === "Admin" || role === "DB Admin") && e.status === "Active" && (
                              <button style={styles.withdrawBtn} onClick={() => handleWithdraw(e.id)}>
                                Withdraw
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={enrolments.length < limit}>
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
  title: { margin: 0, color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280", margin: "6px 0 0 0" },
  addWrapper: { position: "relative" },
  addBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  addMenu: { position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", zIndex: 20, minWidth: "220px", overflow: "hidden" },
  addMenuItem: { display: "flex", flexDirection: "column", gap: "2px", padding: "14px 16px", textDecoration: "none", color: "#111827", cursor: "pointer" },
  addMenuDesc: { fontSize: "12px", color: "#6b7280", fontWeight: "400" },
  addMenuDivider: { height: "1px", background: "#f3f4f6" },
  cards: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "25px" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" },
  cardValue: { margin: 0, fontSize: "28px", color: "#111827" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchInput: { flex: 2, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" },
  filterSelect: { flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionRow: { display: "flex", gap: "8px" },
  viewBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  withdrawBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" },
  pageBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  pageInfo: { color: "#6b7280", fontSize: "14px" },
};