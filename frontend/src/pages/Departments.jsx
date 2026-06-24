import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";
import { FaBuilding, FaPlus, FaSearch } from "react-icons/fa";

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [saving, setSaving] = useState(false);

  const role = localStorage.getItem("role");

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/departments/");
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      setDepartments(data);
    } catch {
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setSaving(true);
    try {
      const response = await apiFetch("/departments/", {
        method: "POST",
        body: JSON.stringify({ name: newDeptName.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || "Failed to add department.");
        return;
      }
      setNewDeptName("");
      setShowAddForm(false);
      fetchDepartments();
    } catch {
      alert("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    const action = isActive ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this department?`)) return;
    try {
      const response = await apiFetch(`/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (response.ok) fetchDepartments();
      else alert("Failed to update department.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Departments</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Manage college departments
            </p>
          </div>
          <FaBuilding style={styles.icon} />
        </div>

        {/* Summary cards */}
        <div style={styles.cards}>
          {[
            { label: "Total Departments", value: departments.length },
            { label: "Active", value: departments.filter(d => d.is_active).length },
            { label: "Inactive", value: departments.filter(d => !d.is_active).length },
          ].map((item, i) => (
            <div key={i} style={styles.card}>
              <h3 style={styles.cardLabel}>{item.label}</h3>
              <h2 style={styles.cardValue}>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div style={styles.actionBar}>
          <div style={styles.searchBox}>
            <FaSearch color="#9ca3af" />
            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          {(role === "Admin" || role === "DB Admin") && (
            <button onClick={() => setShowAddForm(!showAddForm)} style={styles.addBtn}>
              <FaPlus /> Add Department
            </button>
          )}
        </div>

        {/* Inline add form */}
        {showAddForm && (
          <form onSubmit={handleAdd} style={styles.addForm}>
            <input
              type="text"
              placeholder="Department name e.g. Auto Motive Engineering"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              style={styles.addInput}
              required
              autoFocus
            />
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" style={styles.cancelBtn} onClick={() => { setShowAddForm(false); setNewDeptName(""); }}>
              Cancel
            </button>
          </form>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Department Name</th>
                  <th style={styles.th}>Status</th>
                  {(role === "Admin" || role === "DB Admin") && (
                    <th style={styles.th}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="3" style={styles.empty}>No departments found.</td></tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.id}>
                      <td style={styles.td}>{d.name}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: d.is_active ? "#dcfce7" : "#fee2e2",
                          color: d.is_active ? "#166534" : "#991b1b",
                        }}>{d.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      {(role === "Admin" || role === "DB Admin") && (
                        <td style={styles.td}>
                          <button
                            style={d.is_active ? styles.deactivateBtn : styles.activateBtn}
                            onClick={() => handleToggleActive(d.id, d.is_active)}
                          >
                            {d.is_active ? "Deactivate" : "Reactivate"}
                          </button>
                        </td>
                      )}
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  icon: { fontSize: "40px", color: "#1e3a8a" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" },
  cardValue: { margin: 0, fontSize: "28px", color: "#111827" },
  actionBar: { display: "flex", gap: "15px", marginBottom: "20px" },
  searchBox: { flex: 1, background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", gap: "10px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  addBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" },
  addForm: { display: "flex", gap: "10px", marginBottom: "20px", background: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  addInput: { flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  saveBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  deactivateBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  activateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};