import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function StaffProfile() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => { fetchStaff(); }, [staffId]);

  const fetchStaff = async () => {
    try {
      const response = await apiFetch(`/staff/${staffId}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      if (response.status === 404) { setError("Staff member not found."); return; }
      const data = await response.json();
      setStaff(data);
    } catch {
      setError("Failed to load staff profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    const newStatus = staff.status === "Active" ? "Inactive" : "Active";
    const action = newStatus === "Inactive" ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this staff member?`)) return;
    try {
      const response = await apiFetch(`/staff/${staffId}/status?status=${newStatus}`, { method: "PATCH" });
      if (response.ok) fetchStaff();
      else alert("Failed to update status.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  if (loading) return <Layout><div style={styles.center}>Loading...</div></Layout>;
  if (error) return <Layout><div style={styles.center}>{error}</div></Layout>;

  const initials = `${staff.first_name?.[0] || ""}${staff.last_name?.[0] || ""}`;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => navigate("/staff")}>← Back to Staff</button>
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.actionRow}>
              <Link to={`/staff/edit/${staffId}`}>
                <button style={styles.editBtn}>Edit</button>
              </Link>
              <button
                style={staff.status === "Active" ? styles.deactivateBtn : styles.activateBtn}
                onClick={handleDeactivate}
              >
                {staff.status === "Active" ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{initials || "ST"}</div>
            <div>
              <h2 style={styles.name}>{staff.first_name} {staff.last_name}</h2>
              <p style={styles.staffNo}>{staff.staff_no}</p>
              <span style={{
                ...styles.badge,
                background: staff.status === "Active" ? "#dcfce7" : "#fee2e2",
                color: staff.status === "Active" ? "#166534" : "#991b1b",
              }}>{staff.status}</span>
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.grid}>
            <div style={styles.item}>
              <strong>Department</strong>
              <span>{staff.department || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>System Role</strong>
              <span>{staff.role || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Email</strong>
              <span>{staff.email || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Phone</strong>
              <span>{staff.phone || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Gender</strong>
              <span>{staff.gender || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Date of Birth</strong>
              <span>{staff.dob || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Employment Date</strong>
              <span>{staff.employment_date || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Address</strong>
              <span>{staff.address || "—"}</span>
            </div>
            <div style={styles.item}>
              <strong>Has System Account</strong>
              <span>{staff.has_account ? "Yes" : "No"}</span>
            </div>
          </div>

          {/* Create account section — DB Admin only */}
          {role === "DB Admin" && !staff.has_account && (
            <div style={styles.accountSection}>
              <h3>Create System Account</h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                This staff member does not have a system account yet.
              </p>
              <Link to={`/users/create/${staffId}`}>
                <button style={styles.createAccountBtn}>Create Account</button>
              </Link>
            </div>
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
  card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  profileHeader: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", background: "#1e3a8a", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "700", flexShrink: 0 },
  name: { margin: "0 0 4px 0", color: "#111827" },
  staffNo: { margin: "0 0 8px 0", color: "#6b7280", fontSize: "14px" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" },
  divider: { border: "none", borderTop: "1px solid #f3f4f6", margin: "20px 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
  item: { display: "flex", flexDirection: "column", gap: "6px", background: "#f8fafc", padding: "16px", borderRadius: "10px" },
  accountSection: { marginTop: "24px", padding: "20px", background: "#fefce8", borderRadius: "10px", borderLeft: "4px solid #eab308" },
  createAccountBtn: { marginTop: "10px", background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6b7280" },
};