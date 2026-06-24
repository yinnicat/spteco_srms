import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaCalendarCheck } from "react-icons/fa";

export default function Attendance() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("");

  const [form, setForm] = useState({
    module_id: "",
    date: new Date().toISOString().split("T")[0],
    start_time: "",
    end_time: "",
    room: "",
    semester: "",
  });

  useEffect(() => { fetchSessions(); fetchModules(); }, [moduleFilter]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (moduleFilter) params.append("module_id", moduleFilter);
      const response = await apiFetch(`/attendance/sessions?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setSessions(data);
    } catch {
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await apiFetch("/modules/?is_active=true");
      const data = await response.json();
      setModules(data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.start_time || !form.end_time) { alert("Please enter start and end time."); return; }
    if (form.end_time <= form.start_time) { alert("End time must be after start time."); return; }
    setSaving(true);
    try {
      const payload = {
        module_id: parseInt(form.module_id),
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        room: form.room || null,
        semester: form.semester || null,
      };
      const response = await apiFetch("/attendance/sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.detail || "Failed to create session."); return; }
      setShowForm(false);
      setForm({ module_id: "", date: new Date().toISOString().split("T")[0], start_time: "", end_time: "", room: "", semester: "" });
      fetchSessions();
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session? All attendance records for this session will also be deleted.")) return;
    try {
      const response = await apiFetch(`/attendance/sessions/${id}`, { method: "DELETE" });
      if (response.ok) fetchSessions();
      else alert("Failed to delete session.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const role = localStorage.getItem("role");

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>Manage class sessions and attendance records</p>
          </div>
          <div style={styles.headerActions}>
            <FaCalendarCheck style={{ fontSize: "32px", color: "#1e3a8a" }} />
            <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
              + New Session
            </button>
          </div>
        </div>

        {/* Create session form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={styles.formCard}>
            <h3 style={{ margin: "0 0 16px 0" }}>Create Session</h3>
            <div style={styles.formGrid}>
              <div style={styles.group}>
                <label style={styles.label}>Module *</label>
                <select value={form.module_id} onChange={e => setForm({ ...form, module_id: e.target.value })} style={styles.input} required>
                  <option value="">Select module</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.module_code} — {m.module_name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={styles.input} required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Start Time *</label>
                <input type="time" value={form.start_time}
                  onChange={e => {
                    const start = e.target.value;
                    // Auto-suggest end time as 1 hour later
                    const [h, m] = start.split(":").map(Number);
                    const endH = String(Math.min(h + 1, 23)).padStart(2, "0");
                    setForm({ ...form, start_time: start, end_time: `${endH}:${String(m).padStart(2, "0")}` });
                  }}
                  style={styles.input} required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>End Time *</label>
                <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} style={styles.input} required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Room</label>
                <input type="text" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="e.g. Lab A" style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Semester Override <span style={styles.optional}>(auto-detected if blank)</span></label>
                <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} style={styles.input}>
                  <option value="">Auto-detect</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Inter-semester">Inter-semester</option>
                </select>
              </div>
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? "Creating..." : "Create Session"}
              </button>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Filter */}
        <div style={styles.filterRow}>
          <select value={moduleFilter} onChange={e => { setModuleFilter(e.target.value); }} style={styles.filterSelect}>
            <option value="">All Modules</option>
            {modules.map(m => (
              <option key={m.id} value={m.id}>{m.module_code} — {m.module_name}</option>
            ))}
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
                  <th style={styles.th}>Module</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Room</th>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Academic Year</th>
                  <th style={styles.th}>Marked</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr><td colSpan="9" style={styles.empty}>No sessions found.</td></tr>
                ) : (
                  sessions.map(s => (
                    <tr key={s.id}>
                      <td style={styles.td}>{s.module_name}</td>
                      <td style={styles.td}>{s.date}</td>
                      <td style={styles.td}>{s.start_time} — {s.end_time}</td>
                      <td style={styles.td}>{s.duration_hours} hrs</td>
                      <td style={styles.td}>{s.room || "—"}</td>
                      <td style={styles.td}>{s.semester || "—"}</td>
                      <td style={styles.td}>{s.academic_year || "—"}</td>
                      <td style={styles.td}>{s.attendance_count} students</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <Link to={`/attendance/mark?session=${s.id}`}>
                            <button style={styles.markBtn}>Mark</button>
                          </Link>
                          {(role === "Admin" || role === "DB Admin") && (
                            <button style={styles.deleteBtn} onClick={() => handleDelete(s.id)}>Delete</button>
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
  headerActions: { display: "flex", alignItems: "center", gap: "16px" },
  addBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  formCard: { background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px", borderLeft: "4px solid #1e3a8a" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "16px" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  optional: { color: "#9ca3af", fontWeight: "400", fontSize: "12px" },
  input: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  formActions: { display: "flex", gap: "10px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  filterRow: { marginBottom: "20px" },
  filterSelect: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", minWidth: "300px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  actionRow: { display: "flex", gap: "8px" },
  markBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deleteBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};