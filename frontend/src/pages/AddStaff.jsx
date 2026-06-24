import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function AddStaff() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [staff, setStaff] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    department_id: "",
    employment_date: "",
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
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...staff,
        department_id: staff.department_id ? parseInt(staff.department_id) : null,
        dob: staff.dob || null,
        employment_date: staff.employment_date || null,
      };
      const response = await apiFetch("/staff/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Failed to add staff member.");
        return;
      }
      navigate("/staff");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Add Staff</h1>
            <p style={{ color: "#6b7280" }}>Register a new staff member. Staff number is auto-generated.</p>
          </div>
          <button style={styles.cancelBtn} onClick={() => navigate("/staff")}>← Back</button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.form}>
            <div style={styles.group}>
              <label>First Name *</label>
              <input name="first_name" value={staff.first_name} onChange={handleChange}
                placeholder="First name" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Last Name *</label>
              <input name="last_name" value={staff.last_name} onChange={handleChange}
                placeholder="Last name" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Gender</label>
              <select name="gender" value={staff.gender} onChange={handleChange} style={styles.input}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={staff.dob} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.group}>
              <label>Email</label>
              <input type="email" name="email" value={staff.email} onChange={handleChange}
                placeholder="staff@spteco.ac.bw" style={styles.input} />
            </div>

            <div style={styles.group}>
              <label>Phone</label>
              <input name="phone" value={staff.phone} onChange={handleChange}
                placeholder="Phone number" style={styles.input} />
            </div>

            <div style={styles.group}>
              <label>Address</label>
              <input name="address" value={staff.address} onChange={handleChange}
                placeholder="Physical address" style={styles.input} />
            </div>

            <div style={styles.group}>
              <label>Department</label>
              <select name="department_id" value={staff.department_id} onChange={handleChange} style={styles.input}>
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.group}>
              <label>Employment Date</label>
              <input type="date" name="employment_date" value={staff.employment_date}
                onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.notice}>
            <strong>Note:</strong> Staff number is auto-generated by the system.
            To assign a system login account, visit the User Management page after creating the staff record.
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Saving..." : "Save Staff"}
            </button>
            <button type="button" onClick={() => navigate("/staff")} style={styles.backBtn}>
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  form: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  group: { display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  notice: { marginTop: "24px", padding: "14px", background: "#f0f9ff", borderRadius: "8px", borderLeft: "4px solid #0ea5e9", fontSize: "14px", color: "#0369a1" },
  buttonRow: { display: "flex", gap: "12px", marginTop: "24px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  backBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  cancelBtn: { background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
};