import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaChartBar } from "react-icons/fa";

export default function AttendanceGraph() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [semester, setSemester] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchModules(); }, []);
  useEffect(() => { if (reportData) drawChart(); }, [reportData]);

  const fetchModules = async () => {
    try {
      const response = await apiFetch("/modules/?is_active=true");
      const data = await response.json();
      setModules(data);
    } catch {}
  };

  const fetchReport = async () => {
    if (!selectedModule) { alert("Please select a module."); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ module_id: selectedModule });
      if (semester) params.append("semester", semester);
      const response = await apiFetch(`/reports/attendance-report?${params}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setReportData(data);
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
    const students = reportData.students.slice(0, 15); // max 15 for readability
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 30, right: 20, bottom: 80, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = chartW / students.length * 0.6;
    const gap = chartW / students.length;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);

    // Y axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px Arial";
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + chartH - (chartH * i / 4);
      ctx.fillText(`${i * 25}%`, 5, y + 4);
      ctx.strokeStyle = "#f3f4f6";
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }

    // Threshold line
    const thresholdPct = reportData.students[0]
      ? (reportData.students[0].attendance_threshold / reportData.total_hours * 100)
      : 80;
    const thresholdY = pad.top + chartH - (chartH * thresholdPct / 100);
    ctx.strokeStyle = "#dc2626";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pad.left, thresholdY);
    ctx.lineTo(W - pad.right, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.font = "11px Arial";
    ctx.fillText("Threshold", W - pad.right - 60, thresholdY - 4);

    // Bars
    students.forEach((s, i) => {
      const x = pad.left + i * gap + (gap - barW) / 2;
      const pct = Math.min(s.attendance_percentage, 100);
      const barH = chartH * pct / 100;
      const y = pad.top + chartH - barH;
      ctx.fillStyle = s.at_risk ? "#dc2626" : "#1e3a8a";
      ctx.fillRect(x, y, barW, barH);

      // Label
      ctx.fillStyle = "#374151";
      ctx.font = "10px Arial";
      ctx.save();
      ctx.translate(x + barW / 2, pad.top + chartH + 10);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(s.student_no || s.student_name.split(" ")[0], 0, 0);
      ctx.restore();

      // Percentage
      ctx.fillStyle = "#fff";
      ctx.font = "10px Arial";
      if (barH > 20) ctx.fillText(`${pct}%`, x + 4, y + 14);
    });
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Attendance Graph</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Visual attendance per student per module
            </p>
          </div>
          <FaChartBar style={{ fontSize: "40px", color: "#1e3a8a" }} />
        </div>

        {/* Controls */}
        <div style={styles.controlCard}>
          <div style={styles.controlRow}>
            <div style={styles.group}>
              <label style={styles.label}>Module *</label>
              <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} style={styles.input}>
                <option value="">Select module</option>
                {modules.map(m => <option key={m.id} value={m.id}>{m.module_code} — {m.module_name}</option>)}
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
              <h2>{reportData.module_name} — {reportData.module_code}</h2>
              <div style={styles.legend}>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: "#1e3a8a" }} /> Above threshold
                </span>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: "#dc2626" }} /> At risk
                </span>
                <span style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: "#dc2626", width: "20px", height: "2px", borderRadius: 0 }} /> Threshold line
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
              Showing {Math.min(reportData.students.length, 15)} of {reportData.students.length} students.
              Total sessions: {reportData.total_sessions} — Total hours: {reportData.total_hours} hrs
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
  controlRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", alignItems: "end" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" },
  generateBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  chartCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
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