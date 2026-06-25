import { useEffect, useRef } from "react";

export default function AttendanceChart({ reportData }) {
  const canvasRef = useRef(null);

  useEffect(() => { if (reportData) drawChart(); }, [reportData]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !reportData?.students?.length) return;
    const ctx = canvas.getContext("2d");
    const studentList = reportData.students.slice(0, 15);
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 30, right: 100, bottom: 80, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = Math.min(chartW / studentList.length * 0.6, 60);
    const gap = chartW / studentList.length;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);

    // Y axis + grid
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
      ctx.fillStyle = s.at_risk ? "#dc2626" : "#1e3a8a";
      ctx.fillRect(x, y, barW, barH);
      ctx.fillStyle = "#fff";
      ctx.font = "10px Arial";
      if (barH > 20) ctx.fillText(`${pct}%`, x + 4, y + 14);
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
    <div>
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: "#1e3a8a" }} /> Above threshold
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: "#dc2626" }} /> At risk
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={350}
        style={{ width: "100%", height: "auto" }}
      />
      <p style={styles.note}>
        Showing {Math.min(reportData.students.length, 15)} of {reportData.students.length} student(s) —
        {reportData.total_sessions} sessions — {reportData.total_hours} hrs total
      </p>
    </div>
  );
}

const styles = {
  legend: { display: "flex", gap: "16px", marginBottom: "12px" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" },
  legendDot: { width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" },
  note: { color: "#6b7280", fontSize: "13px", marginTop: "12px" },
};