import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaCalendarCheck, FaChartLine, FaChartBar } from "react-icons/fa";

function detectSemester() {
  const month = new Date().getMonth() + 1;
  return month >= 7 ? "Semester 1" : "Semester 2";
}

export default function Attendance() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [pastSessions, setPastSessions] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    module_id: "",
    date: new Date().toISOString().split("T")[0],
    start_time: "",
    end_time: "",
    room: "",
    semester: detectSemester(),
  });

  useEffect(() => { fetchModules(); }, []);

  const fetchModules = async () => {
    try {
      // Backend auto-filters by lecturer if role is Lecturer
      const response = await apiFetch("/modules/?is_active=true");
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setModules(data);
    } catch {}
  };

  const fetchPastSessions = async () => {
    setLoadingPast(true);
    try {
      // Lecturers see sessions they marked, admins see all
      const response = await apiFetch("/attendance/sessions");
      const data = await response.json();
      setPastSessions(data.slice(0, 20));
    } catch {} finally {
      setLoadingPast(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.end_time <= form.start_time) { alert("End time must be after start time."); return; }
    setSaving(true);
    try {
      const response = await apiFetch("/attendance/sessions", {
        method: "POST",
        body: JSON.stringify({
          module_id: parseInt(form.module_id),
          date: form.date,
          start_time: form.start_time,
          end_time: form.end_time,
          room: form.room || null,
          semester: form.semester,
        }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.detail || "Failed to create session."); return; }
      navigate(`/attendance/mark?session=${data.id}`);
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Mark Attendance</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              {role === "Lecturer"
                ? "Create a session for your modules and mark attendance"
                : "Create a session and mark attendance in one go"
              }
            </p>
          </div>
          <div style={styles.headerLinks}>
            <Link to="/attendance/analytics" style={styles.headerLink}>
              <FaChartLine /> Analytics
            </Link>
            <Link to="/attendance/graph" style={styles.headerLink}>
              <FaChartBar /> Graphs
            </Link>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            <FaCalendarCheck style={{ marginRight: "10px", color: "#1e3a8a" }} />
            New Session
          </h2>
          <p style={styles.formSubtitle}>
            Fill in the session details and you'll be taken straight to marking attendance.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={{ ...styles.group, gridColumn: "span 2" }}>
                <label style={styles.label}>Module *</label>
                <select
                  value={form.module_id}
                  onChange={e => setForm({ ...form, module_id: e.target.value })}
                  style={styles.input} required
                >
                  <option value="">Select module</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.module_code} — {m.module_name} {m.course_name ? `(${m.course_name})` : ""}
                    </option>
                  ))}
                </select>
                {modules.length === 0 && (
                  <p style={{ color: "#dc2626", fontSize: "13px", margin: "4px 0 0 0" }}>
                    No modules available. {role === "Lecturer" ? "You have no assigned modules yet." : "Please add modules first."}
                  </p>
                )}
              </div>

              <div style={styles.group}>
                <label style={styles.label}>Date *</label>
                <input type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  style={styles.input} required />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>Room <span style={styles.optional}>(optional)</span></label>
                <input type="text" value={form.room}
                  onChange={e => setForm({ ...form, room: e.target.value })}
                  placeholder="e.g. Lab A" style={styles.input} />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>Start Time *</label>
                <input type="time" value={form.start_time}
                  onChange={e => {
                    const start = e.target.value;
                    const [h, m] = start.split(":").map(Number);
                    const endH = String(Math.min(h + 1, 23)).padStart(2, "0");
                    setForm({ ...form, start_time: start, end_time: `${endH}:${String(m).padStart(2, "0")}` });
                  }}
                  style={styles.input} required />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>End Time *</label>
                <input type="time" value={form.end_time}
                  onChange={e => setForm({ ...form, end_time: e.target.value })}
                  style={styles.input} required />
              </div>

              <div style={{ ...styles.group, gridColumn: "span 2" }}>
                <label style={styles.label}>
                  Semester <span style={styles.optional}>(override if needed)</span>
                </label>
                <select value={form.semester}
                  onChange={e => setForm({ ...form, semester: e.target.value })}
                  style={styles.input}>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Inter-semester">Inter-semester</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1 }}
              disabled={saving || modules.length === 0}
            >
              {saving ? "Creating session..." : "Create Session & Mark Attendance →"}
            </button>
          </form>
        </div>

        {/* Past sessions */}
        <div style={styles.pastSection}>
          <button
            style={styles.pastToggle}
            onClick={() => {
              setShowPast(!showPast);
              if (!showPast && pastSessions.length === 0) fetchPastSessions();
            }}
          >
            {showPast ? "▲ Hide past sessions" : "▼ View past sessions"}
          </button>

          {showPast && (
            <div style={styles.pastCard}>
              {loadingPast ? (
                <p style={styles.empty}>Loading...</p>
              ) : pastSessions.length === 0 ? (
                <p style={styles.empty}>No past sessions found.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Module</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>Room</th>
                      <th style={styles.th}>Semester</th>
                      <th style={styles.th}>Marked</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastSessions.map(s => (
                      <tr key={s.id}>
                        <td style={styles.td}>{s.module_name}</td>
                        <td style={styles.td}>{s.date}</td>
                        <td style={styles.td}>{s.start_time} — {s.end_time}</td>
                        <td style={styles.td}>{s.room || "—"}</td>
                        <td style={styles.td}>{s.semester || "—"}</td>
                        <td style={styles.td}>{s.attendance_count} students</td>
                        <td style={styles.td}>
                          <div style={styles.actionRow}>
                            <Link to={`/attendance/mark?session=${s.id}`}>
                              <button style={styles.markBtn}>Mark</button>
                            </Link>
                            {(role === "Admin" || role === "DB Admin") && (
                              <button
                                style={styles.deleteBtn}
                                onClick={async () => {
                                  if (!window.confirm("Delete this session and all its attendance records?")) return;
                                  await apiFetch(`/attendance/sessions/${s.id}`, { method: "DELETE" });
                                  fetchPastSessions();
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  headerLinks: { display: "flex", gap: "12px" },
  headerLink: { display: "flex", alignItems: "center", gap: "6px", background: "#fff", color: "#1e3a8a", padding: "8px 14px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  formCard: { background: "#fff", padding: "32px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  formTitle: { margin: "0 0 6px 0", color: "#111827", display: "flex", alignItems: "center" },
  formSubtitle: { color: "#6b7280", fontSize: "14px", margin: "0 0 24px 0" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  optional: { color: "#9ca3af", fontWeight: "400", fontSize: "12px" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  submitBtn: { width: "100%", padding: "16px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "16px" },
  pastSection: { marginTop: "8px" },
  pastToggle: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "14px", padding: "8px 0" },
  pastCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginTop: "12px", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  actionRow: { display: "flex", gap: "8px" },
  markBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deleteBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "20px", color: "#6b7280" },
};