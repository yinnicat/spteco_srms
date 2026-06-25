import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [summary, setSummary] = useState({ active: 0, sen: 0, ovc: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [senFilter, setSenFilter] = useState("");
  const [ovcFilter, setOvcFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const role = localStorage.getItem("role");

  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => { fetchStudents(); fetchSummary(); }, [page, search, statusFilter, courseFilter, senFilter, ovcFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (courseFilter) params.append("course_id", courseFilter);
      if (senFilter !== "") params.append("sen", senFilter);
      if (ovcFilter !== "") params.append("ovc", ovcFilter);
      const response = await apiFetch(`/students/?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setStudents(data.students);
      setTotal(data.total);
    } catch {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await apiFetch("/reports/dashboard");
      const data = await response.json();
      setSummary({ active: data.active_enrolments, sen: data.sen_students, ovc: data.ovc_students });
    } catch {}
  };

  const fetchCourses = async () => {
    try {
      const response = await apiFetch("/courses/");
      const data = await response.json();
      setCourses(data);
    } catch {}
  };

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (newStatus === currentStatus) return;
    if (!window.confirm(`Change student status to ${newStatus}?`)) return;
    try {
      const response = await apiFetch(`/students/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) fetchStudents();
      else alert("Failed to update status.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const statusColor = (s) => ({
    Active: { bg: "#dcfce7", text: "#166534" },
    Completed: { bg: "#dbeafe", text: "#1e3a8a" },
    Suspended: { bg: "#fef9c3", text: "#854d0e" },
    Withdrawn: { bg: "#fee2e2", text: "#991b1b" },
  }[s] || { bg: "#f3f4f6", text: "#374151" });

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Students</h1>
          {(role === "Admin" || role === "DB Admin") && (
            <Link to="/students/add">
              <button style={styles.addBtn}>+ Add Student</button>
            </Link>
          )}
        </div>

        <div style={styles.summary}>
          {[
            { label: "Active Enrolments", value: summary.active },
            { label: "SEN Students", value: summary.sen },
            { label: "OVC Students", value: summary.ovc },
            { label: "Total Results", value: total },
          ].map((item, i) => (
            <div key={i} style={styles.summaryCard}>
              <h3 style={styles.summaryLabel}>{item.label}</h3>
              <h2 style={styles.summaryValue}>{item.value}</h2>
            </div>
          ))}
        </div>

        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by name, student number or OMANG..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={styles.searchInput}
          />
          <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }} style={styles.filterSelect}>
            <option value="">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.course_code} — {c.course_name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={styles.filterSelect}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Suspended">Suspended</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
          <select value={senFilter} onChange={(e) => { setSenFilter(e.target.value); setPage(1); }} style={styles.filterSelect}>
            <option value="">SEN — All</option>
            <option value="true">SEN — Yes</option>
            <option value="false">SEN — No</option>
          </select>
          <select value={ovcFilter} onChange={(e) => { setOvcFilter(e.target.value); setPage(1); }} style={styles.filterSelect}>
            <option value="">OVC — All</option>
            <option value="true">OVC — Yes</option>
            <option value="false">OVC — No</option>
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
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Nationality</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>SEN</th>
                  <th style={styles.th}>OVC</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan="7" style={styles.empty}>No students found.</td></tr>
                ) : (
                  students.map((s) => {
                    const sc = statusColor(s.status);
                    return (
                      <tr key={s.id}>
                        <td style={styles.td}>{s.student_no}</td>
                        <td style={styles.td}>{s.first_name} {s.last_name}</td>
                        <td style={styles.td}>{s.nationality || "—"}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: sc.bg, color: sc.text }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={styles.td}>{s.sen ? "Yes" : "No"}</td>
                        <td style={styles.td}>{s.ovc ? "Yes" : "No"}</td>
                        <td style={styles.td}>
                          <div style={styles.actionRow}>
                            <Link to={`/students/profile/${s.student_no}`}>
                              <button style={styles.viewBtn}>View</button>
                            </Link>
                            {(role === "Admin" || role === "DB Admin") && (
                              <select
                                value={s.status}
                                onChange={(e) => handleStatusChange(s.id, s.status, e.target.value)}
                                style={styles.statusSelect}
                              >
                                <option value="Suspended">Suspended</option>
                                <option value="Withdrawn">Withdrawn</option>
                                {s.status === "Active" && <option value="Active" disabled>Active (system managed)</option>}
                                {s.status === "Completed" && <option value="Completed" disabled>Completed (system managed)</option>}
                              </select>
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
            <button style={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
            <span style={styles.pageInfo}>Page {page} — {total} total</span>
            <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={students.length < limit}>Next</button>
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
  summary: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" },
  summaryCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  summaryLabel: { color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" },
  summaryValue: { fontSize: "28px", margin: 0, color: "#111827" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  searchInput: { flex: 2, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", minWidth: "200px" },
  filterSelect: { flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", minWidth: "120px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionRow: { display: "flex", gap: "8px", alignItems: "center" },
  viewBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  statusSelect: { padding: "5px 8px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" },
  pageBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  pageInfo: { color: "#6b7280", fontSize: "14px" },
};