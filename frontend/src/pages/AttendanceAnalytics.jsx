import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaChartLine, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function AttendanceAnalytics() {
  const navigate = useNavigate();
  const [atRisk, setAtRisk] = useState([]);
  const [moduleFilter, setModuleFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchModules(); }, []);
  useEffect(() => { fetchAtRisk(); }, [moduleFilter, semesterFilter, yearFilter]);

  const fetchModules = async () => {
    try {
      const response = await apiFetch("/modules/?is_active=true");
      const data = await response.json();
      setModules(data);
    } catch {}
  };

  const fetchAtRisk = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (moduleFilter) params.append("module_id", moduleFilter);
      if (semesterFilter) params.append("semester", semesterFilter);
      if (yearFilter) params.append("academic_year", yearFilter);
      const response = await apiFetch(`/attendance/at-risk?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setAtRisk(data);
    } catch {
      setError("Failed to load at-risk data.");
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    const el = document.getElementById("at-risk-table");
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>At-Risk Students Report</title><style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background: #1e3a8a; color: white; }
      h2 { color: #1e3a8a; }
    </style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const currentYear = new Date().getFullYear();
  const years = [`${currentYear - 1}/${currentYear}`, `${currentYear}/${currentYear + 1}`];

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance Analytics</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Students at risk of failing attendance requirements
            </p>
          </div>
          <FaChartLine style={{ fontSize: "40px", color: "#1e3a8a" }} />
        </div>

        {/* Summary cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3 style={styles.cardLabel}>Total At-Risk</h3>
            <h2 style={{ ...styles.cardValue, color: atRisk.length > 0 ? "#dc2626" : "#166534" }}>
              {atRisk.length}
            </h2>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardLabel}>Modules Affected</h3>
            <h2 style={styles.cardValue}>
              {new Set(atRisk.map(s => s.module_id)).size}
            </h2>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardLabel}>Status</h3>
            <h2 style={{ fontSize: "16px", margin: 0, color: atRisk.length > 0 ? "#dc2626" : "#166534", display: "flex", alignItems: "center", gap: "8px" }}>
              {atRisk.length > 0
                ? <><FaExclamationTriangle /> Action Required</>
                : <><FaCheckCircle /> All Clear</>
              }
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterRow}>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} style={styles.filterSelect}>
            <option value="">All Modules</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.module_code} — {m.module_name}</option>)}
          </select>
          <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)} style={styles.filterSelect}>
            <option value="">All Semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Inter-semester">Inter-semester</option>
          </select>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={styles.filterSelect}>
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button style={styles.printBtn} onClick={printReport}>🖨 Print</button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.tableCard}>
          <div id="at-risk-table">
            <h2>At-Risk Students</h2>
            {loading ? (
              <div style={styles.empty}>Loading...</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student No</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Module</th>
                    <th style={styles.th}>Hours Attended</th>
                    <th style={styles.th}>Threshold</th>
                    <th style={styles.th}>Attendance %</th>
                    <th style={styles.th}>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.length === 0 ? (
                    <tr><td colSpan="7" style={styles.empty}>No at-risk students found for the selected filters.</td></tr>
                  ) : (
                    atRisk.map((s, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{s.student_no}</td>
                        <td style={styles.td}>{s.student_name}</td>
                        <td style={styles.td}>{s.module_name}</td>
                        <td style={styles.td}>{s.hours_attended} hrs</td>
                        <td style={styles.td}>{s.attendance_threshold} hrs</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: s.attendance_percentage < 50 ? "#fee2e2" : "#fef9c3",
                            color: s.attendance_percentage < 50 ? "#991b1b" : "#854d0e",
                          }}>
                            {s.attendance_percentage}%
                          </span>
                        </td>
                        <td style={styles.td}>
                          <Link to={`/students/profile/${s.student_no}`}>
                            <button style={styles.viewBtn}>View</button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={styles.linkRow}>
          <Link to="/attendance/graph" style={styles.graphLink}>
            View Attendance Graphs →
          </Link>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" },
  cardValue: { margin: 0, fontSize: "28px", color: "#111827" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  filterSelect: { flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", minWidth: "160px" },
  printBtn: { background: "#f3f4f6", border: "1px solid #d1d5db", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  viewBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  linkRow: { textAlign: "right" },
  graphLink: { color: "#1e3a8a", textDecoration: "none", fontWeight: "600", fontSize: "14px" },
};