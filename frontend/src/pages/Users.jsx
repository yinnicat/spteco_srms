import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState({
    staff_id: "",
    username: "",
    password: "",
    role: "Lecturer",
  });

  useEffect(() => {
    fetchUsers();
    fetchStaff();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all staff and check who has accounts
      const response = await apiFetch("/staff/");
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      // Filter to only staff with accounts
      const withAccounts = data.filter(s => s.has_account);
      setUsers(withAccounts);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await apiFetch("/staff/?status=Active");
      const data = await response.json();
      // Only staff without accounts can get new accounts
      const withoutAccounts = data.filter(s => !s.has_account);
      setStaffList(withoutAccounts);
    } catch {}
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!newUser.staff_id) { alert("Please select a staff member."); return; }
    setSaving(true);
    try {
      const response = await apiFetch(`/staff/${newUser.staff_id}/account`, {
        method: "POST",
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          role: newUser.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || "Failed to create account.");
        return;
      }
      setShowAddForm(false);
      setNewUser({ staff_id: "", username: "", password: "", role: "Lecturer" });
      fetchUsers();
      fetchStaff();
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAccount = async (staffId, isActive) => {
    const action = isActive ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this user account?`)) return;
    try {
      const response = await apiFetch(`/staff/${staffId}/status?status=${isActive ? "Inactive" : "Active"}`, {
        method: "PATCH",
      });
      if (response.ok) fetchUsers();
      else alert("Failed to update account.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const filtered = users.filter(u =>
    (`${u.first_name} ${u.last_name}`).toLowerCase().includes(search.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.staff_no || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>User Management</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Manage system login accounts and roles. DB Admin only.
            </p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
            + Add User
          </button>
        </div>

        {/* Add user form */}
        {showAddForm && (
          <form onSubmit={handleCreateAccount} style={styles.addForm}>
            <h3 style={{ margin: "0 0 16px 0" }}>Create System Account</h3>
            <div style={styles.formGrid}>
              <div style={styles.group}>
                <label style={styles.label}>Staff Member *</label>
                <select
                  value={newUser.staff_id}
                  onChange={e => setNewUser({ ...newUser, staff_id: e.target.value })}
                  style={styles.input} required
                >
                  <option value="">Select staff member</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} — {s.staff_no}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Role *</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  style={styles.input} required
                >
                  <option value="Lecturer">Lecturer</option>
                  <option value="Admin">Admin</option>
                  <option value="DB Admin">DB Admin</option>
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Username *</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="e.g. jmokoena"
                  style={styles.input} required
                />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Temporary password"
                  style={styles.input} required
                />
              </div>
            </div>
            <div style={styles.notice}>
              The staff member should change their password after first login via Settings.
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? "Creating..." : "Create Account"}
              </button>
              <button type="button" style={styles.cancelBtn}
                onClick={() => { setShowAddForm(false); setNewUser({ staff_id: "", username: "", password: "", role: "Lecturer" }); }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search by name, staff number or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Staff No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Account Status</th>
                  <th style={styles.th}>Last Login</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={styles.empty}>No user accounts found.</td></tr>
                ) : (
                  filtered.map(u => (
                    <tr key={u.id}>
                      <td style={styles.td}>{u.staff_no}</td>
                      <td style={styles.td}>{u.first_name} {u.last_name}</td>
                      <td style={styles.td}>{u.department || "—"}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: u.role === "DB Admin" ? "#f3e8ff" : u.role === "Admin" ? "#dbeafe" : "#f3f4f6",
                          color: u.role === "DB Admin" ? "#6b21a8" : u.role === "Admin" ? "#1e3a8a" : "#374151",
                        }}>{u.role}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: u.status === "Active" ? "#dcfce7" : "#fee2e2",
                          color: u.status === "Active" ? "#166534" : "#991b1b",
                        }}>{u.status}</span>
                      </td>
                      <td style={styles.td}>{u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <Link to={`/staff/profile/${u.id}`}>
                            <button style={styles.viewBtn}>View</button>
                          </Link>
                          <button
                            style={u.status === "Active" ? styles.deactivateBtn : styles.activateBtn}
                            onClick={() => handleToggleAccount(u.id, u.status === "Active")}
                          >
                            {u.status === "Active" ? "Deactivate" : "Reactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  addBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  addForm: { background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px", borderLeft: "4px solid #1e3a8a" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "16px" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  input: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  notice: { background: "#f0f9ff", borderLeft: "4px solid #0ea5e9", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "#0369a1", marginBottom: "16px" },
  formActions: { display: "flex", gap: "10px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  searchSection: { marginBottom: "20px" },
  searchInput: { width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", boxSizing: "border-box" },
  tableCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionRow: { display: "flex", gap: "8px" },
  viewBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};