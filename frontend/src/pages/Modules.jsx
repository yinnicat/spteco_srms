import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const isAdmin = role === "Admin" || role === "DB Admin";
  const isLecturer = role === "Lecturer";

  const [newModule, setNewModule] = useState({
    course_id: "", module_code: "", module_name: "",
    required_hours: "", attendance_threshold: "",
  });

  const [assignForm, setAssignForm] = useState({
    lecturer_id: "",
    academic_year: new Date().getFullYear().toString(),
    semester: "",
    mode: "replace", // replace or additional
  });

  useEffect(() => { fetchModules(); }, [courseFilter]);
  useEffect(() => { fetchCourses(); if (isAdmin) fetchStaff(); }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseFilter) params.append("course_id", courseFilter);
      // Backend auto-filters by lecturer if role is Lecturer
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
    const endpoint = assignForm.mode === "additional"
      ? `/modules/${moduleId}/assign-additional`
      : `/modules/${moduleId}/assign`;
    try {
      const response = await apiFetch(endpoint, {
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
      setAssignForm({ lecturer_id: "", academic_year: new Date().getFullYear().toString(), semester: "", mode: "replace" });
      fetchModules();
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAssignment = async (moduleId, assignmentId, name) => {
    if (!window.confirm(`Remove ${name} from this module?`)) return;
    try {
      const response = await apiFetch(`/modules/${moduleId}/assign/${assignmentId}`, { method: "DELETE" });
      if (response.ok) fetchModules();
      else alert("Failed to remove assignment.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const handleToggleActive = async (id, isActive) => {
    if (!window.confirm(`${isActive ? "Deactivate" : "Reactivate"} this module?`)) return;
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
              {isLecturer ? "Your assigned modules" : "Manage course modules and lecturer assignments"}
            </p>
          </div>
          <div style={styles.headerActions}>
            <FaCubes style={{ fontSize: "32px", color: "#1e3a8a" }} />
            {isAdmin && (
              <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
                + Add Module
              </button>
            )}
          </div>
        </div>

        {/* Add module form — admin only */}
        {showAddForm && isAdmin && (
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
                  Attendance Threshold *
                  <span style={styles.hint}> — auto-set to 80%</span>
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
              <button type="button" style={styles.cancelBtn} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Course filter — hide for lecturers since they only see their modules */}
        {isAdmin && (
          <div style={styles.filterRow}>
            <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={styles.filterSelect}>
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_code} — {c.course_name}</option>
              ))}
            </select>
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : modules.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={{ color: "#6b7280", margin: 0 }}>
              {isLecturer ? "You have no modules assigned to you yet." : "No modules found."}
            </p>
          </div>
        ) : (
          <div style={styles.moduleGrid}>
            {modules.map(m => (
              <div key={m.id} style={styles.moduleCard}>
                <div style={styles.moduleCardHeader}>
                  <div>
                    <span style={styles.moduleCode}>{m.module_code}</span>
                    <h3 style={styles.moduleName}>{m.module_name}</h3>
                    <p style={styles.moduleCourse}>{m.course_name} {m.course_code ? `(${m.course_code})` : ""}</p>
                  </div>
                  <span style={{
                    ...styles.badge,
                    background: m.is_active ? "#dcfce7" : "#fee2e2",
                    color: m.is_active ? "#166534" : "#991b1b",
                  }}>
                    {m.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div style={styles.moduleStats}>
                  <div style={styles.moduleStat}>
                    <span style={styles.moduleStatLabel}>Required</span>
                    <span style={styles.moduleStatValue}>{m.required_hours} hrs</span>
                  </div>
                  <div style={styles.moduleStat}>
                    <span style={styles.moduleStatLabel}>Threshold</span>
                    <span style={styles.moduleStatValue}>{m.attendance_threshold} hrs</span>
                  </div>
                </div>

                {/* Current assignments */}
                <div style={styles.assignmentSection}>
                  <p style={styles.assignmentLabel}>Assigned Lecturers</p>
                  {m.assignment_history.filter(a => a.is_active).length === 0 ? (
                    <p style={styles.unassigned}>Not assigned</p>
                  ) : (
                    m.assignment_history.filter(a => a.is_active).map(a => (
                      <div key={a.id} style={styles.assignmentRow}>
                        <span style={styles.assignmentName}>{a.lecturer_name}</span>
                        <span style={styles.assignmentYear}>{a.academic_year} {a.semester || ""}</span>
                        {isAdmin && (
                          <button
                            style={styles.removeBtn}
                            onClick={() => handleRemoveAssignment(m.id, a.id, a.lecturer_name)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div style={styles.moduleActions}>
                    <button
                      style={styles.assignBtn}
                      onClick={() => setShowAssignForm(showAssignForm === m.id ? null : m.id)}
                    >
                      + Assign Lecturer
                    </button>
                    <button
                      style={m.is_active ? styles.deactivateBtn : styles.activateBtn}
                      onClick={() => handleToggleActive(m.id, m.is_active)}
                    >
                      {m.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </div>
                )}

                {/* Inline assign form */}
                {showAssignForm === m.id && isAdmin && (
                  <form onSubmit={(e) => handleAssign(e, m.id)} style={styles.assignForm}>
                    <div style={styles.assignModeRow}>
                      <label style={styles.radioLabel}>
                        <input type="radio" value="replace" checked={assignForm.mode === "replace"}
                          onChange={() => setAssignForm({ ...assignForm, mode: "replace" })} />
                        {" "}Replace current
                      </label>
                      <label style={styles.radioLabel}>
                        <input type="radio" value="additional" checked={assignForm.mode === "additional"}
                          onChange={() => setAssignForm({ ...assignForm, mode: "additional" })} />
                        {" "}Add additional / substitute
                      </label>
                    </div>
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
                          placeholder="e.g. 2026" style={styles.input} maxLength={4} required />
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
                    <div style={styles.formActions}>
                      <button type="submit" style={styles.saveBtn} disabled={saving}>
                        {saving ? "Saving..." : "Confirm"}
                      </button>
                      <button type="button" style={styles.cancelBtn} onClick={() => setShowAssignForm(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
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
  formActions: { display: "flex", gap: "10px", marginTop: "12px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  filterRow: { marginBottom: "20px" },
  filterSelect: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", minWidth: "300px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  moduleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "16px" },
  moduleCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  moduleCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  moduleCode: { fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
  moduleName: { margin: "4px 0", color: "#111827", fontSize: "16px" },
  moduleCourse: { margin: 0, color: "#6b7280", fontSize: "13px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" },
  moduleStats: { display: "flex", gap: "16px", marginBottom: "16px", padding: "12px", background: "#f8fafc", borderRadius: "8px" },
  moduleStat: { display: "flex", flexDirection: "column", gap: "2px" },
  moduleStatLabel: { fontSize: "11px", color: "#9ca3af", textTransform: "uppercase" },
  moduleStatValue: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  assignmentSection: { marginBottom: "16px" },
  assignmentLabel: { fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", margin: "0 0 8px 0" },
  assignmentRow: { display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #f3f4f6" },
  assignmentName: { fontWeight: "500", fontSize: "14px", flex: 1 },
  assignmentYear: { fontSize: "12px", color: "#6b7280" },
  removeBtn: { background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "14px", padding: "2px 6px" },
  unassigned: { color: "#9ca3af", fontSize: "13px", margin: 0 },
  moduleActions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  assignBtn: { background: "#7c3aed", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  assignForm: { marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" },
  assignModeRow: { display: "flex", gap: "20px", marginBottom: "12px" },
  radioLabel: { fontSize: "14px", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" },
  assignGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  emptyCard: { background: "#fff", borderRadius: "12px", padding: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textAlign: "center" },
  empty: { textAlign: "center", padding: "40px", color: "#6b7280" },
};