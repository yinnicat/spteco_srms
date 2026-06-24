import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function StudentProfile() {
  const { studentNo } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [enrolments, setEnrolments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => { fetchStudent(); }, [studentNo]);

  const fetchStudent = async () => {
    try {
      // Search by student_no
      const response = await apiFetch(`/students/?search=${studentNo}`);
      if (response.status === 401) { localStorage.clear(); navigate("/"); return; }
      const data = await response.json();
      const found = data.students.find(s => s.student_no === studentNo);
      if (!found) { setError("Student not found."); return; }
      setStudent(found);

      // Fetch enrolments
      const enrolResponse = await apiFetch(`/enrolments/?student_id=${found.id}`);
      const enrolData = await enrolResponse.json();
      setEnrolments(enrolData.enrolments || []);

      // Fetch certificates
      const certResponse = await apiFetch(`/certificates/?student_id=${found.id}`);
      const certData = await certResponse.json();
      setCertificates(certData.certificates || []);
    } catch {
      setError("Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change this student's status to ${newStatus}?`)) return;
    try {
      const response = await apiFetch(`/students/${student.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) fetchStudent();
      else alert("Failed to update status.");
    } catch {
      alert("Could not connect to server.");
    }
  };

  if (loading) return <Layout><div style={styles.center}>Loading...</div></Layout>;
  if (error) return <Layout><div style={styles.center}>{error}</div></Layout>;

  const initials = `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`;

  const statusColor = {
    Active: { bg: "#dcfce7", text: "#166534" },
    Inactive: { bg: "#fee2e2", text: "#991b1b" },
    Graduated: { bg: "#dbeafe", text: "#1e3a8a" },
    Suspended: { bg: "#fef9c3", text: "#854d0e" },
    Withdrawn: { bg: "#fee2e2", text: "#991b1b" },
  }[student.status] || { bg: "#f3f4f6", text: "#374151" };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => navigate("/students")}>← Back to Students</button>
          {(role === "Admin" || role === "DB Admin") && (
            <div style={styles.actionRow}>
              <Link to={`/students/edit/${student.id}`}>
                <button style={styles.editBtn}>Edit</button>
              </Link>
              <select
                style={styles.statusSelect}
                value={student.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          )}
        </div>

        {/* Profile header */}
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{initials}</div>
            <div>
              <h1 style={styles.name}>{student.first_name} {student.other_name || ""} {student.last_name}</h1>
              <p style={styles.studentNo}>{student.student_no}</p>
              <span style={{ ...styles.badge, background: statusColor.bg, color: statusColor.text }}>
                {student.status}
              </span>
              {student.sen && <span style={{ ...styles.badge, background: "#fef9c3", color: "#854d0e", marginLeft: "8px" }}>SEN</span>}
              {student.ovc && <span style={{ ...styles.badge, background: "#f3e8ff", color: "#6b21a8", marginLeft: "8px" }}>OVC</span>}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={styles.statsRow}>
          {[
            { label: "Admission Date", value: student.admission_date || "—" },
            { label: "Nationality", value: student.nationality || "—" },
            { label: "Enrolments", value: enrolments.length },
            { label: "Certificates", value: certificates.length },
          ].map((item, i) => (
            <div key={i} style={styles.statCard}>
              <p style={styles.statLabel}>{item.label}</p>
              <h3 style={styles.statValue}>{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Personal details */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Details</h3>
          <div style={styles.grid}>
            {[
              { label: "Gender", value: student.gender },
              { label: "Date of Birth", value: student.dob },
              { label: "Place of Birth", value: student.place_of_birth },
              { label: "Nationality", value: student.nationality },
              { label: "OMANG", value: student.omang },
              { label: "Passport", value: student.passport },
              { label: "Disability", value: student.disability },
            ].map((item, i) => (
              <div key={i} style={styles.item}>
                <strong>{item.label}</strong>
                <span>{item.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contact Information</h3>
          <div style={styles.grid}>
            {[
              { label: "Email", value: student.email },
              { label: "Telephone", value: student.tel_no },
              { label: "Cell Number", value: student.cell_no },
              { label: "Address", value: student.address },
            ].map((item, i) => (
              <div key={i} style={styles.item}>
                <strong>{item.label}</strong>
                <span>{item.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Academic Background</h3>
          <div style={styles.grid}>
            {[
              { label: "Academic Qualifications", value: student.academic_qualifications },
              { label: "Professional Qualification", value: student.prof_qualification },
              { label: "English", value: student.english_grade },
              { label: "Maths", value: student.maths_grade },
              { label: "Science", value: student.science_grade },
              { label: "Technology", value: student.technology_grade },
              { label: "Technical Maths", value: student.technical_maths_grade },
              { label: "Technical Drawing", value: student.technical_drawing_grade },
              { label: "Practical", value: student.practical_grade },
              { label: "Associated Studies", value: student.associated_studies_grade },
              { label: "Other Subjects", value: student.other_subjects_summary },
              { label: "Relevant Experience", value: student.relevant_experience },
            ].map((item, i) => (
              <div key={i} style={styles.item}>
                <strong>{item.label}</strong>
                <span>{item.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next of Kin */}
        {student.next_of_kin && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Next of Kin</h3>
            <div style={styles.grid}>
              {[
                { label: "Name", value: `${student.next_of_kin.name} ${student.next_of_kin.surname}` },
                { label: "Relationship", value: student.next_of_kin.relation },
                { label: "Telephone", value: student.next_of_kin.tel_no },
                { label: "Cell Number", value: student.next_of_kin.cell_no },
                { label: "Email", value: student.next_of_kin.email },
              ].map((item, i) => (
                <div key={i} style={styles.item}>
                  <strong>{item.label}</strong>
                  <span>{item.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enrolments */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Enrolments</h3>
            {(role === "Admin" || role === "DB Admin") && (
              <Link to="/enrolments/add">
                <button style={styles.smallAddBtn}>+ New Enrolment</button>
              </Link>
            )}
          </div>
          {enrolments.length === 0 ? (
            <p style={styles.empty}>No enrolments found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Enrolment Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {enrolments.map((e) => (
                  <tr key={e.id}>
                    <td style={styles.td}>{e.course_name}</td>
                    <td style={styles.td}>{e.enrolment_date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: e.status === "Active" ? "#dcfce7" : e.status === "Completed" ? "#dbeafe" : "#fee2e2",
                        color: e.status === "Active" ? "#166534" : e.status === "Completed" ? "#1e3a8a" : "#991b1b",
                      }}>{e.status}</span>
                    </td>
                    <td style={styles.td}>{e.has_certificate ? "✓ Issued" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Certificates */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Certificates</h3>
          {certificates.length === 0 ? (
            <p style={styles.empty}>No certificates issued.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Issue Date</th>
                  <th style={styles.th}>Collected</th>
                  <th style={styles.th}>Collection Date</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.course_name}</td>
                    <td style={styles.td}>{c.issue_date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: c.collected ? "#dcfce7" : "#fee2e2",
                        color: c.collected ? "#166534" : "#991b1b",
                      }}>{c.collected ? "Yes" : "No"}</span>
                    </td>
                    <td style={styles.td}>{c.collection_date || "—"}</td>
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
  actionRow: { display: "flex", gap: "10px", alignItems: "center" },
  editBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" },
  statusSelect: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer" },
  profileCard: { background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  profileHeader: { display: "flex", gap: "20px", alignItems: "center" },
  avatar: { width: "90px", height: "90px", background: "#1e3a8a", color: "#fff", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "30px", fontWeight: "700", flexShrink: 0 },
  name: { margin: "0 0 4px 0", color: "#111827" },
  studentNo: { margin: "0 0 8px 0", color: "#6b7280", fontSize: "14px" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" },
  statCard: { background: "#fff", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  statLabel: { color: "#6b7280", fontSize: "13px", margin: "0 0 6px 0" },
  statValue: { margin: 0, color: "#111827", fontSize: "20px" },
  section: { background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { margin: "0 0 16px 0", color: "#111827" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  item: { background: "#f8fafc", padding: "14px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "2px solid #f3f4f6", color: "#6b7280", fontSize: "13px" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  smallAddBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { color: "#6b7280", fontSize: "14px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6b7280" },
};