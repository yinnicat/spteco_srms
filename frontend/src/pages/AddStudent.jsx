import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api";

export default function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [student, setStudent] = useState({
    first_name: "",
    other_name: "",
    last_name: "",
    gender: "",
    dob: "",
    place_of_birth: "",
    nationality: "Motswana",
    omang: "",
    passport: "",
    email: "",
    tel_no: "",
    cell_no: "",
    address: "",
    admission_date: "",
    academic_qualifications: "",
    prof_qualification: "",
    disability: "",
    sen: false,
    ovc: false,
    english_grade: "",
    maths_grade: "",
    science_grade: "",
    technology_grade: "",
    technical_maths_grade: "",
    technical_drawing_grade: "",
    practical_grade: "",
    associated_studies_grade: "",
    other_subjects_summary: "",
    relevant_experience: "",
  });

  const [nok, setNok] = useState({
    name: "",
    surname: "",
    relation: "",
    tel_no: "",
    cell_no: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent({ ...student, [name]: type === "checkbox" ? checked : value });
  };

  const handleNokChange = (e) => {
    setNok({ ...nok, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...student,
        dob: student.dob || null,
        admission_date: student.admission_date || null,
        next_of_kin: nok.name ? nok : null,
      };
      const response = await apiFetch("/students/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Failed to add student.");
        return;
      }
      navigate("/students");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = "text", required = false) => (
    <div style={styles.group}>
      <label style={styles.label}>{label}{required && " *"}</label>
      <input
        type={type}
        name={name}
        value={student[name]}
        onChange={handleChange}
        style={styles.input}
        required={required}
      />
    </div>
  );

 const gradeField = (label, name) => (
  <div style={styles.group}>
    <label style={styles.label}>{label}</label>
    <input
      type="text"
      name={name}
      value={student[name]}
      onChange={handleChange}
      style={styles.input}
      placeholder="e.g. B or 75"
    />
  </div>
);

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1>Add Student</h1>
            <p style={{ color: "#6b7280" }}>Register a new student. Student number is auto-generated.</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate("/students")}>← Back</button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Personal Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Personal Details</h3>
            <div style={styles.form}>
              {field("First Name", "first_name", "text", true)}
              {field("Other Name(s)", "other_name")}
              {field("Last Name", "last_name", "text", true)}
              <div style={styles.group}>
                <label style={styles.label}>Gender</label>
                <select name="gender" value={student.gender} onChange={handleChange} style={styles.input}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {field("Date of Birth", "dob", "date")}
              {field("Place of Birth", "place_of_birth")}
              {field("Nationality", "nationality")}
              {field("OMANG", "omang")}
              {field("Passport Number", "passport")}
              {field("Disability", "disability")}
              <div style={styles.group}>
                <label style={styles.label}>SEN (Special Educational Needs)</label>
                <select name="sen" value={student.sen} onChange={(e) => setStudent({ ...student, sen: e.target.value === "true" })} style={styles.input}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>OVC (Orphans & Vulnerable Children)</label>
                <select name="ovc" value={student.ovc} onChange={(e) => setStudent({ ...student, ovc: e.target.value === "true" })} style={styles.input}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Contact Information</h3>
            <div style={styles.form}>
              {field("Email", "email", "email")}
              {field("Telephone", "tel_no")}
              {field("Cell Number", "cell_no")}
              {field("Address", "address")}
            </div>
          </div>

          {/* Admission */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Admission</h3>
            <div style={styles.form}>
              {field("Admission Date", "admission_date", "date")}
              {field("Academic Qualifications", "academic_qualifications")}
              {field("Professional Qualification", "prof_qualification")}
              {field("Relevant Experience", "relevant_experience")}
            </div>
          </div>

          {/* Entry Grades */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Entry Grades <span style={styles.optional}>(optional)</span></h3>
            <div style={styles.form}>
              {gradeField("English", "english_grade")}
              {gradeField("Maths", "maths_grade")}
              {gradeField("Science", "science_grade")}
              {gradeField("Technology", "technology_grade")}
              {gradeField("Technical Maths", "technical_maths_grade")}
              {gradeField("Technical Drawing", "technical_drawing_grade")}
              {gradeField("Practical", "practical_grade")}
              {gradeField("Associated Studies", "associated_studies_grade")}
              <div style={{ ...styles.group, gridColumn: "span 2" }}>
                <label style={styles.label}>Other Subjects Summary</label>
                <textarea
                  name="other_subjects_summary"
                  value={student.other_subjects_summary}
                  onChange={handleChange}
                  style={{ ...styles.input, height: "80px", resize: "vertical" }}
                  placeholder="e.g. Setswana — B, History — C"
                />
              </div>
            </div>
          </div>

          {/* Next of Kin */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Next of Kin <span style={styles.optional}>(optional)</span></h3>
            <div style={styles.form}>
              <div style={styles.group}>
                <label style={styles.label}>First Name</label>
                <input name="name" value={nok.name} onChange={handleNokChange} style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Surname</label>
                <input name="surname" value={nok.surname} onChange={handleNokChange} style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Relationship</label>
                <input name="relation" value={nok.relation} onChange={handleNokChange} style={styles.input} placeholder="e.g. Mother, Father, Guardian" />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Telephone</label>
                <input name="tel_no" value={nok.tel_no} onChange={handleNokChange} style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cell Number</label>
                <input name="cell_no" value={nok.cell_no} onChange={handleNokChange} style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Email</label>
                <input name="email" value={nok.email} onChange={handleNokChange} style={styles.input} type="email" />
              </div>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Saving..." : "Save Student"}
            </button>
            <button type="button" onClick={() => navigate("/students")} style={styles.cancelBtn}>
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
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  backBtn: { background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  errorBox: { background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  section: { background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  sectionTitle: { margin: "0 0 20px 0", color: "#111827" },
  optional: { color: "#9ca3af", fontSize: "13px", fontWeight: "400" },
  form: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  group: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#374151", fontWeight: "500" },
  input: { padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px" },
  buttonRow: { display: "flex", gap: "12px", marginBottom: "40px" },
  saveBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  cancelBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "14px 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
};