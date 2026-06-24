import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ total: 0, active: 0, departments: 0 });

  const role = localStorage.getItem("role");

  useEffect(() => { fetchCourses(); }, [search, programmeFilter, statusFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (programmeFilter) params.append("programme_type", programmeFilter);
      if (statusFilter !== "") params.append("is_active", statusFilter);
      const response = await apiFetch(`/courses/?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setCourses(data);
      setSummary({
        total: data.length,
        active: data.filter(c => c.is_active).length,
        departments: new Set(data.map(c => c.department_id).filter(Boolean)).size,
      });
    } catch {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    const action = isActive ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this course?`)) return;
    try {
      const response = await apiFetch(`/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (response.ok) fetchCourses();
      else alert("Failed to update course.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Courses</h1>
            <p style={styles.subtitle}>Manage courses and programmes</p>
          </div>
          {(role === "Admin" || role === "DB Admin") && (
            <Link to="/courses/add">
              <button style={styles.addBtn}>+ Add Course</button>
            </Link>
          )}
        </div>

        {/* Summary cards */}
        <div style={styles.cards}>
          {[
            { label: "Total Courses", value: summary.total },
            { label: "Active Courses", value: summary.active },
            { label: "Departments", value: summary.departments },
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
            placeholder="Search by course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select value={programmeFilter} onChange={(e) => setProgrammeFilter(e.target.value)} style={styles.filterSelect}>
            <option value="">All Programmes</option>
            <option value="Long Term">Long Term</option>
            <option value="Short Term">Short Term</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.filterSelect}>
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
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
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Course Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Level</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Programme Type</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr><td colSpan="8" style={styles.empty}>No courses found.</td></tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.id}>
                      <td style={styles.td}>{c.course_code}</td>
                      <td style={styles.td}>{c.course_name}</td>
                      <td style={styles.td}>{c.department || "—"}</td>
                      <td style={styles.td}>{c.course_level || "—"}</td>
                      <td style={styles.td}>{c.duration_yrs ? `${c.duration_yrs} yr(s)` : "—"}</td>
                      <td style={styles.td}>{c.programme_type || "—"}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: c.is_active ? "#dcfce7" : "#fee2e2",
                          color: c.is_active ? "#166534" : "#991b1b",
                        }}>{c.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <Link to={`/courses/details/${c.course_code}`}>
                            <button style={styles.viewBtn}>View</button>
                          </Link>
                          {(role === "Admin" || role === "DB Admin") && (
                            <button
                              style={c.is_active ? styles.deactivateBtn : styles.activateBtn}
                              onClick={() => handleToggleActive(c.id, c.is_active)}
                            >
                              {c.is_active ? "Deactivate" : "Reactivate"}
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
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280", margin: "6px 0 0 0" },
  addBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" },
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
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};