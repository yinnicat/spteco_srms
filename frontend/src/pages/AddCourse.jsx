import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function AddCourse() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [course, setCourse] = useState({
    course_code: "",
    course_name: "",
    department_id: "",
    course_level: "",
    duration_yrs: "",
    programme_type: "",
    description: "",
  });

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const response = await apiFetch("/departments/");
      const data = await response.json();
      setDepartments(data.filter(d => d.is_active));
    } catch {
      setError("Failed to load departments.");
    }
  };

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...course,
        department_id: course.department_id ? parseInt(course.department_id) : null,
        course_level: course.course_level ? parseInt(course.course_level) : null,
        duration_yrs: course.duration_yrs ? parseFloat(course.duration_yrs) : null,
      };
      const response = await apiFetch("/courses/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Failed to add course.");
        return;
      }
      navigate("/courses");
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
            <h1>Add Course</h1>
            <p style={{ color: "#6b7280" }}>Create a new course or programme.</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate("/courses")}>← Back</button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.form}>
            <div style={styles.group}>
              <label style={styles.label}>Course Code *</label>
              <input name="course_code" value={course.course_code} onChange={handleChange}
                placeholder="e.g. AUT-01" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Course Name *</label>
              <input name="course_name" value={course.course_name} onChange={handleChange}
                placeholder="e.g. Auto Motive Engineering" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Department</label>
              <select name="department_id" value={course.department_id} onChange={handleChange} style={styles.input}>
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Course Level</label>
              <input name="course_level" value={course.course_level} onChange={handleChange}
                placeholder="e.g. 3 or 4" style={styles.input} type="number" min="1" />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Duration (years)</label>
              <input name="duration_yrs" value={course.duration_yrs} onChange={handleChange}
                placeholder="e.g. 1 or 0.5" style={styles.input} type="number" step="0.5" min="0.5" />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Programme Type</label>
              <select name="programme_type" value={course.programme_type} onChange={handleChange} style={styles.input}>
                <option value="">Select type</option>
                <option value="Long Term">Long Term</option>
                <option value="Short Term">Short Term</option>
              </select>
            </div>

            <div style={{ ...styles.group, gridColumn: "span 2" }}>
              <label style={styles.label}>Description</label>
              <textarea name="description" value={course.description} onChange={handleChange}
                placeholder="Brief description of the course" rows={3}
                style={{ ...styles.input, resize: "vertical" }} />
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Saving..." : "Save Course"}
            </button>
            <button type="button" onClick={() => navigate("/courses")} style={styles.cancelBtn}>
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
  card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  form: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  buttonRow: { display: "flex", gap: "12px", marginTop: "24px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
};