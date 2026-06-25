import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaChartBar } from "react-icons/fa";

export default function AttendanceGraph() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [semester, setSemester] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchModules(); }, []);
  useEffect(() => { if (selectedModule) fetchStudentsForModule(); else setStudents([]); }, [selectedModule]);
  useEffect(() => { if (reportData) drawChart(); }, [reportData]);

  const fetchModules = async () => {
    try {
      const response = await apiFetch("/modules/?is_active=true");
      const data = await response.json();
      setModules(data);
    } catch {}
  };

  const fetchStudentsForModule = async () => {
    try {
      const module = modules.find(m => m.id === parseInt(selectedModule));
      if (!module) return;
      const response = await apiFetch(`/students/?course_id=${module.course_id}&limit=100`);
      const data = await response.json();
      setStudents(data.students || []);
      setSelectedStudent(""); // reset student filter when module changes
    } catch {}
  };

  const fetchReport = async () => {
    if (!selectedModule) { alert("Please select a module."); return; }
    setLoading(true);
    setError("");
    try {
      // If a specific student is selected, use the attendance summary endpoint
      if (selectedStudent) {
        const params = new URLSearchParams({ module_id: selectedModule });
        if (semester) params.append("semester", semester);
        const response = await apiFetch(`/attendance/summary/${selectedStudent}/module/${selectedModule}?${semester ? `semester=${semester}` : ""}`);
        if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
        const data = await response.json();
        // Wrap single student into the same shape as the full report
        setReportData({
          module_name: data.module_name,
          module_code: data.module_code,
          total_sessions: data.total_sessions,
          total_hours: data.total_hours,
          required_hours: data.required_hours,
          threshold_percentage: data.threshold_percentage,
          students: [data],
        });
      } else {
        // Full module report
        const params = new URLSearchParams({ module_id: selectedModule });
        if (semester) params.append("semester", semester);
        const response = await apiFetch(`/reports/attendance-report?${params}`);
        if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
        const data = await response.json();
        setReportData(data);
      }
    } catch {
      setError("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !reportData?.students?.length) return;
    const ctx = canvas.getContext("2d");
    const studentList = reportData.students.slice(0, 15);
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 30, right: 80, bottom: 80, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = Math.min(chartW / studentList.length * 0.6, 60);
    const gap = chartW / studentList.length;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);

    // Y axis labels and grid lines
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px Arial";
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + chartH - (chartH * i / 4);
      ctx.fillText(`${i * 25}%`, 5, y + 4);
      ctx.strokeStyle = "#f3f4f6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }

    // Threshold line
    const thresholdPct = reportData.threshold_percentage || 80;
    const thresholdY = pad.top + chartH - (chartH * thresholdPct / 100);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pad.left, thresholdY);
    ctx.lineTo(W - pad.right, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.font = "11px Arial";
    ctx.fillText(`Threshold ${thresholdPct}%`, W - pad.right + 4, thresholdY + 4);

    // Bars
    studentList.forEach((s, i) => {
      const x = pad.left + i * gap + (gap - barW) / 2;
      const pct = Math.min(s.attendance_percentage, 100);
      const barH = chartH * pct / 100;
      const y = pad.top + chartH - barH;

      // Bar
      ctx.fillStyle = s.at_risk ? "#dc2626" : "#1e3a8a";
      ctx.fillRect(x, y, barW, barH);

      // Percentage label inside bar
      ctx.fillStyle = "#fff";
      ctx.font = "10px Arial";
      if (barH > 20) ctx.fillText(`${pct}%`, x + 4, y + 14);

      // Student label below
      ctx.fillStyle = "#374151";
      ctx.font = "10px Arial";
      ctx.save();
      ctx.translate(x + barW / 2, pad.top + chartH + 10);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(s.student_no || s.student_name?.split(" ")[0] || "", 0, 0);
      ctx.restore();
    });
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance Graph</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Visual attendance per module — filter by student for individual view
            </p>
          </div>
          <FaChartBar style={{ fontSize: "40px", color: "#1e3a8a" }} />
        </div>

        {/* Controls */}
        <div style={styles.controlCard}>
          <div style={styles.controlGrid}>
            <div style={styles.group}>
              <label style={styles.label}>Module *</label>
              <select
                value={selectedModule}
                onChange={e => { setSelectedModule(e.target.value); setReportData(null); }}
                style={styles.input}
              >
                <option value="">Select module</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.module_code} — {m.module_name}</option>
                ))}
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>
                Student <span style={styles.optional}>(optional — leave blank for all)</span>
              </label>
              <select
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
                style={styles.input}
                disabled={!selectedModule}
              >
                <option value="">All Students</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name} — {s.student_no}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Semester</label>
              <select value={semester} onChange={e => setSemester(e.target.value)} style={styles.input}>
                <option value="">All Semesters</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Inter-semester">Inter-semester</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>&nbsp;</label>
              <button style={styles.generateBtn} onClick={fetchReport} disabled={loading}>
                {loading ? "Loading..." : "Generate Graph"}
              </button>
            </div>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Chart */}
        {reportData && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h2 style={{ margin: "0 0 4px 0" }}>
                  {reportData.module_name} — {reportData.module_code}
                </h2>
                {selectedStudent && students.find(s => s.id === parseInt(selectedStudent)) && (
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                    {students.find(s => s.id === parseInt(selectedStudent))?.first_name}{" "}
                    {students.find(s => s.id === parseInt(selectedStudent))?.last_name}
                  </p>
                )}
              </div>
              <div style={styles.legend}>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: "#1e3a8a" }} /> Above threshold
                </span>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: "#dc2626" }} /> At risk
                </span>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={800}
              height={350}
              style={{ width: "100%", height: "auto" }}
            />
            <p style={styles.chartNote}>
              {selectedStudent
                ? `Individual view — ${reportData.total_sessions} sessions — ${reportData.total_hours} hrs total`
                : `Showing ${Math.min(reportData.students.length, 15)} of ${reportData.students.length} students — ${reportData.total_sessions} sessions — ${reportData.total_hours} hrs total`
              }
            </p>
          </div>
        )}

        {/* Data table */}
        {reportData && (
          <div style={styles.tableCard}>
            <h3 style={{ margin: "0 0 16px 0" }}>Attendance Data</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Hours Attended</th>
                  <th style={styles.th}>Total Hours</th>
                  <th style={styles.th}>Required Hours</th>
                  <th style={styles.th}>Attendance %</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students.map((s, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{s.student_no}</td>
                    <td style={styles.td}>{s.student_name}</td>
                    <td style={styles.td}>{s.hours_attended} hrs</td>
                    <td style={styles.td}>{s.total_hours} hrs</td>
                    <td style={styles.td}>{s.required_hours} hrs</td>
                    <td style={styles.td}>{s.attendance_percentage}%</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: s.at_risk ? "#fee2e2" : "#dcfce7",
                        color: s.at_risk ? "#991b1b" : "#166534",
                      }}>
                        {s.at_risk ? "At Risk" : "On Track"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  controlCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  controlGrid: { display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: "16px", alignItems: "end" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  optional: { color: "#9ca3af", fontWeight: "400", fontSize: "12px" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  generateBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  chartCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  legend: { display: "flex", gap: "16px" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" },
  legendDot: { width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" },
  chartNote: { color: "#6b7280", fontSize: "13px", marginTop: "12px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
};