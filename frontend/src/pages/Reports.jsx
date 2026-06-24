import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import {
  FaUserGraduate, FaChalkboardTeacher, FaClipboardList,
  FaCertificate, FaChartBar, FaExclamationTriangle, FaUsers,
} from "react-icons/fa";

export default function Reports() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [senStudents, setSenStudents] = useState(null);
  const [ovcStudents, setOvcStudents] = useState(null);
  const [uncollected, setUncollected] = useState(null);
  const [courseStudents, setCourseStudents] = useState(null);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiFetch("/courses/?is_active=true");
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setCourses(data);
    } catch {
      setError("Failed to load courses.");
    }
  };

  const fetchReport = async (key, endpoint, setter) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const response = await apiFetch(endpoint);
      const data = await response.json();
      setter(data);
    } catch {
      alert("Failed to load report.");
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const printSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Report</title><style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background: #1e3a8a; color: white; }
      h2 { color: #1e3a8a; }
    </style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Reports</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Generate and print institutional reports
            </p>
          </div>
          <FaChartBar style={{ fontSize: "40px", color: "#1e3a8a" }} />
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Report cards */}
        <div style={styles.reportGrid}>

          {/* Students by Course */}
          <div style={styles.reportCard}>
            <div style={styles.reportIcon}><FaUserGraduate /></div>
            <h3>Students by Course</h3>
            <p style={styles.reportDesc}>List all active students enrolled in a specific course</p>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              style={styles.select}
            >
              <option value="">Select course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_code} — {c.course_name}</option>
              ))}
            </select>
            <button
              style={styles.reportBtn}
              disabled={!selectedCourse || loading.course}
              onClick={() => fetchReport("course", `/reports/students-by-course?course_id=${selectedCourse}`, setCourseStudents)}
            >
              {loading.course ? "Loading..." : "Generate Report"}
            </button>
          </div>

          {/* SEN Students */}
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.reportCard}>
              <div style={styles.reportIcon}><FaUsers /></div>
              <h3>SEN Students</h3>
              <p style={styles.reportDesc}>List all active students with Special Educational Needs</p>
              <button
                style={styles.reportBtn}
                disabled={loading.sen}
                onClick={() => fetchReport("sen", "/reports/sen-students", setSenStudents)}
              >
                {loading.sen ? "Loading..." : "Generate Report"}
              </button>
            </div>
          )}

          {/* OVC Students */}
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.reportCard}>
              <div style={styles.reportIcon}><FaUsers /></div>
              <h3>OVC Students</h3>
              <p style={styles.reportDesc}>List all active Orphans and Vulnerable Children students</p>
              <button
                style={styles.reportBtn}
                disabled={loading.ovc}
                onClick={() => fetchReport("ovc", "/reports/ovc-students", setOvcStudents)}
              >
                {loading.ovc ? "Loading..." : "Generate Report"}
              </button>
            </div>
          )}

          {/* Uncollected Certificates */}
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.reportCard}>
              <div style={styles.reportIcon}><FaCertificate /></div>
              <h3>Uncollected Certificates</h3>
              <p style={styles.reportDesc}>List all certificates that have not yet been collected</p>
              <button
                style={styles.reportBtn}
                disabled={loading.uncollected}
                onClick={() => fetchReport("uncollected", "/reports/uncollected-certificates", setUncollected)}
              >
                {loading.uncollected ? "Loading..." : "Generate Report"}
              </button>
            </div>
          )}

          {/* Attendance Report */}
          <div style={styles.reportCard}>
            <div style={styles.reportIcon}><FaClipboardList /></div>
            <h3>Attendance Report</h3>
            <p style={styles.reportDesc}>View and print attendance per module — go to Attendance Analytics</p>
            <Link to="/attendance/analytics">
              <button style={styles.reportBtn}>Go to Attendance</button>
            </Link>
          </div>
        </div>

        {/* Results sections */}

        {/* Students by Course result */}
        {courseStudents && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h2 id="course-report-title">
                {courseStudents.course_name} ({courseStudents.course_code}) — {courseStudents.total} Students
              </h2>
              <button style={styles.printBtn} onClick={() => printSection("course-report-content")}>
                🖨 Print
              </button>
            </div>
            <div id="course-report-content">
              <h2>{courseStudents.course_name} ({courseStudents.course_code})</h2>
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
                  {courseStudents.students.map((s, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{s.student_no}</td>
                      <td style={styles.td}>{s.student_name}</td>
                      <td style={styles.td}>{s.enrolment_date}</td>
                      <td style={styles.td}>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEN result */}
        {senStudents && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h2>SEN Students — {senStudents.total} Total</h2>
              <button style={styles.printBtn} onClick={() => printSection("sen-report-content")}>
                🖨 Print
              </button>
            </div>
            <div id="sen-report-content">
              <h2>SEN Students Report</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student No</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Disability</th>
                  </tr>
                </thead>
                <tbody>
                  {senStudents.students.map((s, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{s.student_no}</td>
                      <td style={styles.td}>{s.student_name}</td>
                      <td style={styles.td}>{s.disability || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OVC result */}
        {ovcStudents && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h2>OVC Students — {ovcStudents.total} Total</h2>
              <button style={styles.printBtn} onClick={() => printSection("ovc-report-content")}>
                🖨 Print
              </button>
            </div>
            <div id="ovc-report-content">
              <h2>OVC Students Report</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student No</th>
                    <th style={styles.th}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {ovcStudents.students.map((s, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{s.student_no}</td>
                      <td style={styles.td}>{s.student_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Uncollected certificates result */}
        {uncollected && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h2>Uncollected Certificates — {uncollected.total} Total</h2>
              <button style={styles.printBtn} onClick={() => printSection("uncollected-report-content")}>
                🖨 Print
              </button>
            </div>
            <div id="uncollected-report-content">
              <h2>Uncollected Certificates Report</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student No</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Issue Date</th>
                  </tr>
                </thead>
                <tbody>
                  {uncollected.certificates.map((c, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{c.student_no}</td>
                      <td style={styles.td}>{c.student_name}</td>
                      <td style={styles.td}>{c.course_name}</td>
                      <td style={styles.td}>{c.issue_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  reportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" },
  reportCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "10px" },
  reportIcon: { fontSize: "32px", color: "#1e3a8a" },
  reportDesc: { color: "#6b7280", fontSize: "14px", margin: 0, flex: 1 },
  select: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  reportBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", marginTop: "auto" },
  resultCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  printBtn: { background: "#f3f4f6", border: "1px solid #d1d5db", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px", background: "#f8fafc" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
};