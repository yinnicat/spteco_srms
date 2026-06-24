import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function EnrolmentDetails() {
  const { enrolmentId } = useParams();
  const navigate = useNavigate();
  const [enrolment, setEnrolment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);
  const [completionDate, setCompletionDate] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => { fetchEnrolment(); }, [enrolmentId]);

  const fetchEnrolment = async () => {
    try {
      const response = await apiFetch(`/enrolments/${enrolmentId}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      if (response.status === 404) { setError("Enrolment not found."); return; }
      const data = await response.json();
      setEnrolment(data);
    } catch {
      setError("Failed to load enrolment.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw this enrolment?")) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await apiFetch(`/enrolments/${enrolmentId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Withdrawn", completion_date: today }),
      });
      if (response.ok) fetchEnrolment();
      else alert("Failed to withdraw enrolment.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!completionDate) { alert("Please enter a completion date."); return; }
    if (!window.confirm("Mark this enrolment as Completed?")) return;
    try {
      const response = await apiFetch(`/enrolments/${enrolmentId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Completed", completion_date: completionDate }),
      });
      if (response.ok) { setCompleting(false); fetchEnrolment(); }
      else alert("Failed to complete enrolment.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  if (loading) return <Layout><div style={styles.center}>Loading...</div></Layout>;
  if (error) return <Layout><div style={styles.center}>{error}</div></Layout>;

  const statusColor = {
    Active: { bg: "#dcfce7", text: "#166534" },
    Completed: { bg: "#dbeafe", text: "#1e3a8a" },
    Withdrawn: { bg: "#fee2e2", text: "#991b1b" },
  }[enrolment.status] || { bg: "#f3f4f6", text: "#374151" };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => navigate("/enrolments")}>← Back to Enrolments</button>
          {(role === "Admin" || role === "DB Admin") && enrolment.status === "Active" && (
            <div style={styles.actionRow}>
              <button style={styles.completeBtn} onClick={() => setCompleting(!completing)}>
                Mark Completed
              </button>
              <button style={styles.withdrawBtn} onClick={handleWithdraw}>
                Withdraw
              </button>
            </div>
          )}
        </div>

        {/* Completion date form */}
        {completing && (
          <form onSubmit={handleComplete} style={styles.completionForm}>
            <label style={styles.label}>Completion Date *</label>
            <input type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)}
              style={styles.input} required />
            <button type="submit" style={styles.saveBtn}>Confirm</button>
            <button type="button" style={styles.cancelBtn} onClick={() => setCompleting(false)}>Cancel</button>
          </form>
        )}

        {/* Main details */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.studentName}>{enrolment.student_name}</h2>
              <p style={styles.studentNo}>{enrolment.student_no}</p>
            </div>
            <span style={{ ...styles.badge, background: statusColor.bg, color: statusColor.text }}>
              {enrolment.status}
            </span>
          </div>

          <hr style={styles.divider} />

          <div style={styles.grid}>
            {[
              { label: "Course", value: enrolment.course_name },
              { label: "Course Code", value: enrolment.course_code },
              { label: "Enrolment Date", value: enrolment.enrolment_date },
              { label: "Completion Date", value: enrolment.completion_date || "—" },
              { label: "Certificate Issued", value: enrolment.has_certificate ? "Yes" : "No" },
            ].map((item, i) => (
              <div key={i} style={styles.item}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate section */}
        {enrolment.status === "Completed" && (role === "Admin" || role === "DB Admin") && (
          <div style={styles.certSection}>
            <h3 style={styles.sectionTitle}>Certificate</h3>
            {enrolment.has_certificate ? (
              <p style={{ color: "#166534" }}>✓ Certificate has been issued for this enrolment.</p>
            ) : (
              <div>
                <p style={{ color: "#6b7280", marginBottom: "12px" }}>No certificate issued yet for this enrolment.</p>
                <Link to="/certificates">
                  <button style={styles.saveBtn}>Issue Certificate</button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Student link */}
        <div style={styles.linkSection}>
          <Link to={`/students/profile/${enrolment.student_no}`} style={styles.profileLink}>
            View Full Student Profile →
          </Link>
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
  completeBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  withdrawBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  completionForm: { display: "flex", gap: "10px", alignItems: "flex-end", background: "#fff", padding: "16px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  card: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "16px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  studentName: { margin: "0 0 4px 0", color: "#111827" },
  studentNo: { margin: 0, color: "#6b7280", fontSize: "14px" },
  badge: { padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" },
  divider: { border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
  item: { background: "#f8fafc", padding: "14px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" },
  certSection: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "16px" },
  sectionTitle: { margin: "0 0 16px 0", color: "#111827" },
  linkSection: { background: "#fff", padding: "16px 25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  profileLink: { color: "#1e3a8a", textDecoration: "none", fontWeight: "600", fontSize: "14px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  input: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6b7280" },
};