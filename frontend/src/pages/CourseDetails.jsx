import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function CourseDetails() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => { fetchCourse(); }, [courseCode]);

  const fetchCourse = async () => {
    try {
      const response = await apiFetch(`/courses/?search=${courseCode}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      const found = data.find(c => c.course_code === courseCode);
      if (!found) { setError("Course not found."); return; }
      setCourse(found);

      // Fetch modules
      const modResponse = await apiFetch(`/modules/?course_id=${found.id}`);
      const modData = await modResponse.json();
      setModules(modData);

      // Fetch enrolments
      const enrolResponse = await apiFetch(`/enrolments/?course_id=${found.id}`);
      const enrolData = await enrolResponse.json();
      setEnrolments(enrolData.enrolments || []);
    } catch {
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    const action = course.is_active ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this course?`)) return;
    try {
      const response = await apiFetch(`/courses/${course.id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !course.is_active }),
      });
      if (response.ok) fetchCourse();
      else alert("Failed to update course.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  if (loading) return <Layout><div style={styles.center}>Loading...</div></Layout>;
  if (error) return <Layout><div style={styles.center}>{error}</div></Layout>;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => navigate("/courses")}>← Back to Courses</button>
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.actionRow}>
              <Link to={`/courses/edit/${course.id}`}>
                <button style={styles.editBtn}>Edit</button>
              </Link>
              <button
                style={course.is_active ? styles.deactivateBtn : styles.activateBtn}
                onClick={handleToggleActive}
              >
                {course.is_active ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          )}
        </div>

        {/* Course header */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.courseName}>{course.course_name}</h1>
            <p style={styles.courseCode}>{course.course_code}</p>
            <span style={{
              ...styles.badge,
              background: course.is_active ? "#dcfce7" : "#fee2e2",
              color: course.is_active ? "#166534" : "#991b1b",
            }}>{course.is_active ? "Active" : "Inactive"}</span>
            {course.programme_type && (
              <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e3a8a", marginLeft: "8px" }}>
                {course.programme_type}
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div style={styles.statsRow}>
          {[
            { label: "Department", value: course.department || "—" },
            { label: "Level", value: course.course_level || "—" },
            { label: "Duration", value: course.duration_yrs ? `${course.duration_yrs} yr(s)` : "—" },
            { label: "Active Enrolments", value: enrolments.filter(e => e.status === "Active").length },
          ].map((item, i) => (
            <div key={i} style={styles.statCard}>
              <p style={styles.statLabel}>{item.label}</p>
              <h3 style={styles.statValue}>{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Description */}
        {course.description && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={{ color: "#374151", margin: 0 }}>{course.description}</p>
          </div>
        )}

        {/* Modules */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Modules ({modules.length})</h3>
            {(role === "Admin" || role === "DB Admin" || role === "Lecturer") && (
              <Link to="/modules">
                <button style={styles.smallBtn}>Manage Modules</button>
              </Link>
            )}
          </div>
          {modules.length === 0 ? (
            <p style={styles.empty}>No modules found for this course.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Module Name</th>
                  <th style={styles.th}>Required Hours</th>
                  <th style={styles.th}>Threshold</th>
                  <th style={styles.th}>Lecturer</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(m => (
                  <tr key={m.id}>
                    <td style={styles.td}>{m.module_code}</td>
                    <td style={styles.td}>{m.module_name}</td>
                    <td style={styles.td}>{m.required_hours} hrs</td>
                    <td style={styles.td}>{m.attendance_threshold} hrs</td>
                    <td style={styles.td}>{m.current_lecturer?.name || "—"}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: m.is_active ? "#dcfce7" : "#fee2e2",
                        color: m.is_active ? "#166534" : "#991b1b",
                      }}>{m.is_active ? "Active" : "Inactive"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Enrolments */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Enrolments ({enrolments.length})</h3>
            {(role === "Admin" || role === "DB Admin") && (
              <Link to="/enrolments/add">
                <button style={styles.smallBtn}>+ New Enrolment</button>
              </Link>
            )}
          </div>
          {enrolments.length === 0 ? (
            <p style={styles.empty}>No enrolments for this course.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Enrolment Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrolments.map(e => (
                  <tr key={e.id}>
                    <td style={styles.td}>{e.student_no}</td>
                    <td style={styles.td}>{e.student_name}</td>
                    <td style={styles.td}>{e.enrolment_date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: e.status === "Active" ? "#dcfce7" : e.status === "Completed" ? "#dbeafe" : "#fee2e2",
                        color: e.status === "Active" ? "#166534" : e.status === "Completed" ? "#1e3a8a" : "#991b1b",
                      }}>{e.status}</span>
                    </td>
                  </tr>
                ))}
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
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  backBtn: { background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  actionRow: { display: "flex", gap: "10px" },
  editBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  headerCard: { background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  courseName: { margin: "0 0 4px 0", color: "#111827" },
  courseCode: { margin: "0 0 12px 0", color: "#6b7280", fontSize: "14px" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" },
  statCard: { background: "#fff", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  statLabel: { color: "#6b7280", fontSize: "13px", margin: "0 0 6px 0" },
  statValue: { margin: 0, color: "#111827", fontSize: "18px" },
  section: { background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { margin: 0, color: "#111827" },
  smallBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  empty: { color: "#6b7280", fontSize: "14px", margin: 0 },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6b7280" },
};