import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function AddEnrolment() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [enrolment, setEnrolment] = useState({
    student_id: "",
    course_id: "",
    enrolment_date: new Date().toISOString().split("T")[0],
    completion_date: "",
  });

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    if (studentSearch.length >= 2) fetchStudents();
    else setStudents([]);
  }, [studentSearch]);

  const fetchCourses = async () => {
    try {
      const response = await apiFetch("/courses/?is_active=true");
      const data = await response.json();
      setCourses(data);
    } catch {
      setError("Failed to load courses.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await apiFetch(`/students/?search=${studentSearch}&status=Active`);
      const data = await response.json();
      setStudents(data.students || []);
    } catch {}
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setEnrolment({ ...enrolment, student_id: student.id });
    setStudentSearch(`${student.first_name} ${student.last_name} (${student.student_no})`);
    setStudents([]);
  };

  const handleChange = (e) => {
    setEnrolment({ ...enrolment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enrolment.student_id) { setError("Please select a student."); return; }
    if (!enrolment.course_id) { setError("Please select a course."); return; }
    setError("");
    setLoading(true);
    try {
      const payload = {
        student_id: parseInt(enrolment.student_id),
        course_id: parseInt(enrolment.course_id),
        enrolment_date: enrolment.enrolment_date,
        completion_date: enrolment.completion_date || null,
        status: "Active",
      };
      const response = await apiFetch("/enrolments/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Failed to create enrolment.");
        return;
      }
      navigate("/enrolments");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1>New Enrolment</h1>
            <p style={{ color: "#6b7280" }}>Enrol a student in a course.</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate("/enrolments")}>← Back</button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.card}>
          {/* Student search */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Student</h3>
            <div style={styles.group}>
              <label style={styles.label}>Search Student *</label>
              <input
                type="text"
                placeholder="Type student name or number..."
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setSelectedStudent(null);
                  setEnrolment({ ...enrolment, student_id: "" });
                }}
                style={styles.input}
              />
              {students.length > 0 && (
                <div style={styles.dropdown}>
                  {students.map(s => (
                    <div
                      key={s.id}
                      style={styles.dropdownItem}
                      onClick={() => selectStudent(s)}
                    >
                      <strong>{s.first_name} {s.last_name}</strong>
                      <span style={{ color: "#6b7280", marginLeft: "8px" }}>{s.student_no}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedStudent && (
              <div style={styles.selectedBox}>
                <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong>
                <span style={{ color: "#6b7280", marginLeft: "8px" }}>{selectedStudent.student_no}</span>
                <span style={{ color: "#6b7280", marginLeft: "8px" }}>— {selectedStudent.nationality || "—"}</span>
              </div>
            )}
          </div>

          {/* Course selection */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Course</h3>
            <div style={styles.group}>
              <label style={styles.label}>Select Course *</label>
              <select name="course_id" value={enrolment.course_id} onChange={handleChange} style={styles.input} required>
                <option value="">Select a course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.course_code} — {c.course_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Dates</h3>
            <div style={styles.form}>
              <div style={styles.group}>
                <label style={styles.label}>Enrolment Date *</label>
                <input type="date" name="enrolment_date" value={enrolment.enrolment_date}
                  onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Completion Date <span style={styles.optional}>(optional)</span></label>
                <input type="date" name="completion_date" value={enrolment.completion_date}
                  onChange={handleChange} style={styles.input} />
              </div>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Saving..." : "Save Enrolment"}
            </button>
            <button type="button" onClick={() => navigate("/enrolments")} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  backBtn: { background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  card: { display: "flex", flexDirection: "column", gap: "0" },
  section: { background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  sectionTitle: { margin: "0 0 16px 0", color: "#111827" },
  form: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  group: { display: "flex", flexDirection: "column", gap: "8px", position: "relative" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  optional: { color: "#9ca3af", fontWeight: "400" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  dropdown: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, maxHeight: "200px", overflowY: "auto" },
  dropdownItem: { padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  selectedBox: { marginTop: "8px", padding: "12px 16px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0ea5e9", fontSize: "14px" },
  buttonRow: { display: "flex", gap: "12px", marginTop: "8px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
};