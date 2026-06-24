import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaCalendarCheck } from "react-icons/fa";

export default function MarkAttendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session");

  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (sessionId) fetchSession();
    else setLoading(false);
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await apiFetch(`/attendance/sessions/${sessionId}/students`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setSession(data);
      setStudents(data.students);
      // Pre-fill existing attendance
      const initial = {};
      const initialNotes = {};
      data.students.forEach(s => {
        initial[s.student_id] = s.current_status || "Absent";
        initialNotes[s.student_id] = "";
      });
      setAttendance(initial);
      setNotes(initialNotes);
    } catch {
      setError("Failed to load session.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.student_id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit attendance for this session?")) return;
    setSaving(true);
    try {
      const records = students.map(s => ({
        student_id: s.student_id,
        status: attendance[s.student_id] || "Absent",
        notes: notes[s.student_id] || null,
      }));
      const response = await apiFetch(`/attendance/sessions/${sessionId}/mark`, {
        method: "POST",
        body: JSON.stringify({ records }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => navigate("/attendance"), 1500);
      } else {
        alert("Failed to save attendance.");
      }
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s) => ({
    Present: { bg: "#dcfce7", color: "#166534" },
    Absent: { bg: "#fee2e2", color: "#991b1b" },
    Late: { bg: "#fef9c3", color: "#854d0e" },
    Excused: { bg: "#dbeafe", color: "#1e3a8a" },
  })[s] || { bg: "#f3f4f6", color: "#374151" };

  if (!sessionId) return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.center}>
          No session selected. <button style={styles.linkBtn} onClick={() => navigate("/attendance")}>Go to Attendance</button>
        </div>
      </div>
    </Layout>
  );

  if (loading) return <Layout><div style={styles.center}>Loading...</div></Layout>;
  if (error) return <Layout><div style={styles.center}>{error}</div></Layout>;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => navigate("/attendance")}>← Back to Sessions</button>
        </div>

        <div style={styles.header}>
          <div>
            <h1>Mark Attendance</h1>
            {session && (
              <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
                {session.module_name} — {session.date} — {session.semester} {session.academic_year}
              </p>
            )}
          </div>
          <FaCalendarCheck style={{ fontSize: "32px", color: "#1e3a8a" }} />
        </div>

        {saved && (
          <div style={styles.successBox}>
            ✓ Attendance saved successfully. Redirecting...
          </div>
        )}

        {/* Mark all buttons */}
        <div style={styles.markAllRow}>
          <span style={styles.markAllLabel}>Mark all as:</span>
          {["Present", "Absent", "Late", "Excused"].map(s => (
            <button key={s} style={{ ...styles.markAllBtn, background: statusColor(s).bg, color: statusColor(s).color }}
              onClick={() => handleMarkAll(s)}>
              {s}
            </button>
          ))}
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student No</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="4" style={styles.empty}>No students enrolled in this module's course.</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.student_id}>
                    <td style={styles.td}>{s.student_no}</td>
                    <td style={styles.td}>{s.student_name}</td>
                    <td style={styles.td}>
                      <div style={styles.statusRow}>
                        {["Present", "Absent", "Late", "Excused"].map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(s.student_id, status)}
                            style={{
                              ...styles.statusBtn,
                              background: attendance[s.student_id] === status ? statusColor(status).bg : "#f3f4f6",
                              color: attendance[s.student_id] === status ? statusColor(status).color : "#374151",
                              fontWeight: attendance[s.student_id] === status ? "700" : "400",
                              border: attendance[s.student_id] === status ? `2px solid ${statusColor(status).color}` : "2px solid transparent",
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        placeholder="Optional note..."
                        value={notes[s.student_id] || ""}
                        onChange={e => setNotes(prev => ({ ...prev, [s.student_id]: e.target.value }))}
                        style={styles.noteInput}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {students.length > 0 && (
          <div style={styles.submitRow}>
            <span style={styles.summary}>
              Present: {Object.values(attendance).filter(s => s === "Present").length} |
              Absent: {Object.values(attendance).filter(s => s === "Absent").length} |
              Late: {Object.values(attendance).filter(s => s === "Late").length} |
              Excused: {Object.values(attendance).filter(s => s === "Excused").length}
            </span>
            <button style={styles.submitBtn} onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Submit Attendance"}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  topBar: { marginBottom: "16px" },
  backBtn: { background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  successBox: { background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontWeight: "600" },
  markAllRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" },
  markAllLabel: { color: "#6b7280", fontSize: "14px" },
  markAllBtn: { padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  statusRow: { display: "flex", gap: "6px" },
  statusBtn: { padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  noteInput: { padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", outline: "none", width: "180px", fontSize: "13px" },
  submitRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summary: { color: "#6b7280", fontSize: "14px" },
  submitBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", gap: "12px", color: "#6b7280" },
  linkBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
};