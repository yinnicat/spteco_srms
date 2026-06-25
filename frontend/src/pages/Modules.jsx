import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaCubes } from "react-icons/fa";

export default function Modules() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const role = localStorage.getItem("role");

  const [newModule, setNewModule] = useState({
    course_id: "",
    module_code: "",
    module_name: "",
    required_hours: "",
    attendance_threshold: "",
  });

  const [assignForm, setAssignForm] = useState({
    lecturer_id: "",
    academic_year: new Date().getFullYear().toString(),
    semester: "",
  });

  useEffect(() => { fetchModules(); }, [courseFilter]);
  useEffect(() => { fetchCourses(); fetchStaff(); }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseFilter) params.append("course_id", courseFilter);
      const response = await apiFetch(`/modules/?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setModules(data);
    } catch {
      setError("Failed to load modules.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiFetch("/courses/?is_active=true");
      const data = await response.json();
      setCourses(data);
    } catch {}
  };

  const fetchStaff = async () => {
    try {
      const response = await apiFetch("/staff/?status=Active");
      const data = await response.json();
      setStaff(data);
    } catch {}
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (parseFloat(newModule.attendance_threshold) > parseFloat(newModule.required_hours)) {
      alert("Attendance threshold cannot exceed required hours.");
      return;
    }
    setSaving(true);
    try {
      const response = await apiFetch("/modules/", {
        method: "POST",
        body: JSON.stringify({
          course_id: parseInt(newModule.course_id),
          module_code: newModule.module_code,
          module_name: newModule.module_name,
          required_hours: parseFloat(newModule.required_hours),
          attendance_threshold: parseFloat(newModule.attendance_threshold),
        }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.detail || "Failed to add module."); return; }
      setShowAddForm(false);
      setNewModule({ course_id: "", module_code: "", module_name: "", required_hours: "", attendance_threshold: "" });
      fetchModules();
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async (e, moduleId) => {
    e.preventDefault();
    if (!assignForm.lecturer_id) { alert("Please select a lecturer."); return; }
    setSaving(true);
    try {
      const response = await apiFetch(`/modules/${moduleId}/assign`, {
        method: "POST",
        body: JSON.stringify({
          lecturer_id: parseInt(assignForm.lecturer_id),
          academic_year: assignForm.academic_year,
          semester: assignForm.semester || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.detail || "Failed to assign lecturer."); return; }
      setShowAssignForm(null);
      setAssignForm({ lecturer_id: "", academic_year: new Date().getFullYear().toString(), semester: "" });
      fetchModules();
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    const action = isActive ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this module?`)) return;
    try {
      const response = await apiFetch(`/modules/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (response.ok) fetchModules();
      else alert("Failed to update module.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Modules</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Manage course modules, hours and lecturer assignments
            </p>
          </div>
          <div style={styles.headerActions}>
            <FaCubes style={{ fontSize: "32px", color: "#1e3a8a" }} />
            {(role === "Admin" || role === "DB Admin" || role === "Lecturer") && (
              <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
                + Add Module
              </button>
            )}
          </div>
        </div>

        {/* Add module form */}
        {showAddForm && (
          <form onSubmit={handleAddModule} style={styles.formCard}>
            <h3 style={{ margin: "0 0 16px 0" }}>Add Module</h3>
            <div style={styles.formGrid}>
              <div style={styles.group}>
                <label style={styles.label}>Course *</label>
                <select value={newModule.course_id}
                  onChange={e => setNewModule({ ...newModule, course_id: e.target.value })}
                  style={styles.input} required>
                  <option value="">Select course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.course_code} — {c.course_name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Module Code *</label>
                <input type="text" value={newModule.module_code}
                  onChange={e => setNewModule({ ...newModule, module_code: e.target.value })}
                  placeholder="e.g. AUT-01" style={styles.input} required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Module Name *</label>
                <input type="text" value={newModule.module_name}
                  onChange={e => setNewModule({ ...newModule, module_name: e.target.value })}
                  placeholder="e.g. Engine Maintenance" style={styles.input} required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Required Hours *</label>
                <input type="number" value={newModule.required_hours}
                  onChange={e => setNewModule({
                    ...newModule,
                    required_hours: e.target.value,
                    attendance_threshold: e.target.value ? (parseFloat(e.target.value) * 0.8).toFixed(1) : ""
                  })}
                  placeholder="e.g. 120" style={styles.input} min="1" step="0.5" required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>
                  Attendance Threshold (hours) *
                  <span style={styles.hint}> — auto-set to 80% of required hours</span>
                </label>
                <input type="number" value={newModule.attendance_threshold}
                  onChange={e => setNewModule({ ...newModule, attendance_threshold: e.target.value })}
                  placeholder="e.g. 96" style={styles.input} min="1" step="0.5" required />
              </div>
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? "Saving..." : "Save Module"}
              </button>
              <button type="button" style={styles.cancelBtn}
                onClick={() => { setShowAddForm(false); }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filter */}
        <div style={styles.filterRow}>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={styles.filterSelect}>
            <option value="">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.course_code} — {c.course_name}</option>
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
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Module Name</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Required Hrs</th>
                  <th style={styles.th}>Threshold</th>
                  <th style={styles.th}>Current Lecturer</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.length === 0 ? (
                  <tr><td colSpan="8" style={styles.empty}>No modules found.</td></tr>
                ) : (
                  modules.map(m => (
                    <>
                      <tr key={m.id}>
                        <td style={styles.td}>{m.module_code}</td>
                        <td style={styles.td}>{m.module_name}</td>
                        <td style={styles.td}>{m.course_name || "—"}</td>
                        <td style={styles.td}>{m.required_hours} hrs</td>
                        <td style={styles.td}>{m.attendance_threshold} hrs</td>
                        <td style={styles.td}>
                          {m.current_lecturer
                            ? <span>{m.current_lecturer.name}<br /><span style={{ color: "#6b7280", fontSize: "12px" }}>{m.current_lecturer.academic_year} {m.current_lecturer.semester || ""}</span></span>
                            : <span style={{ color: "#9ca3af" }}>Not assigned</span>
                          }
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: m.is_active ? "#dcfce7" : "#fee2e2",
                            color: m.is_active ? "#166534" : "#991b1b",
                          }}>{m.is_active ? "Active" : "Inactive"}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionRow}>
                            {(role === "Admin" || role === "DB Admin") && (
                              <button
                                style={styles.assignBtn}
                                onClick={() => setShowAssignForm(showAssignForm === m.id ? null : m.id)}
                              >
                                Assign
                              </button>
                            )}
                            {(role === "Admin" || role === "DB Admin") && (
                              <button
                                style={m.is_active ? styles.deactivateBtn : styles.activateBtn}
                                onClick={() => handleToggleActive(m.id, m.is_active)}
                              >
                                {m.is_active ? "Deactivate" : "Reactivate"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Inline assign form */}
                      {showAssignForm === m.id && (
                        <tr key={`assign-${m.id}`}>
                          <td colSpan="8" style={{ padding: "0" }}>
                            <form onSubmit={(e) => handleAssign(e, m.id)} style={styles.assignForm}>
                              <h4 style={{ margin: "0 0 12px 0" }}>
                                Assign Lecturer — {m.module_name}
                              </h4>
                              <div style={styles.assignGrid}>
                                <div style={styles.group}>
                                  <label style={styles.label}>Lecturer *</label>
                                  <select value={assignForm.lecturer_id}
                                    onChange={e => setAssignForm({ ...assignForm, lecturer_id: e.target.value })}
                                    style={styles.input} required>
                                    <option value="">Select lecturer</option>
                                    {staff.map(s => (
                                      <option key={s.id} value={s.id}>
                                        {s.first_name} {s.last_name} — {s.staff_no}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div style={styles.group}>
                                  <label style={styles.label}>Academic Year *</label>
                                  <input type="text" value={assignForm.academic_year}
                                    onChange={e => setAssignForm({ ...assignForm, academic_year: e.target.value })}
                                    placeholder="e.g. 2026" style={styles.input}
                                    maxLength={4} required />
                                </div>
                                <div style={styles.group}>
                                  <label style={styles.label}>Semester <span style={styles.hint}>(optional)</span></label>
                                  <select value={assignForm.semester}
                                    onChange={e => setAssignForm({ ...assignForm, semester: e.target.value })}
                                    style={styles.input}>
                                    <option value="">All semesters</option>
                                    <option value="Semester 1">Semester 1</option>
                                    <option value="Semester 2">Semester 2</option>
                                    <option value="Inter-semester">Inter-semester</option>
                                  </select>
                                </div>
                              </div>

                              {/* Assignment history */}
                              {m.assignment_history && m.assignment_history.length > 0 && (
                                <div style={styles.historySection}>
                                  <p style={styles.historyTitle}>Assignment History</p>
                                  {m.assignment_history.map((a, i) => (
                                    <div key={i} style={styles.historyItem}>
                                      <span>{a.lecturer_name}</span>
                                      <span style={{ color: "#6b7280" }}>{a.academic_year} {a.semester || ""}</span>
                                      <span style={{
                                        ...styles.badge,
                                        background: a.is_active ? "#dcfce7" : "#f3f4f6",
                                        color: a.is_active ? "#166534" : "#6b7280",
                                        fontSize: "11px",
                                      }}>{a.is_active ? "Current" : "Past"}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div style={styles.formActions}>
                                <button type="submit" style={styles.saveBtn} disabled={saving}>
                                  {saving ? "Assigning..." : "Confirm Assignment"}
                                </button>
                                <button type="button" style={styles.cancelBtn}
                                  onClick={() => setShowAssignForm(null)}>
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </>
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
  hint: { color: "#9ca3af", fontWeight: "400", fontSize: "12px" },
  input: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  formActions: { display: "flex", gap: "10px", marginTop: "8px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  filterRow: { marginBottom: "20px" },
  filterSelect: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", minWidth: "300px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px", verticalAlign: "top" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  assignBtn: { background: "#7c3aed", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  assignForm: { background: "#f8fafc", padding: "20px", borderLeft: "4px solid #7c3aed" },
  assignGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" },
  historySection: { marginBottom: "16px" },
  historyTitle: { color: "#6b7280", fontSize: "13px", fontWeight: "600", margin: "0 0 8px 0" },
  historyItem: { display: "flex", gap: "16px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};