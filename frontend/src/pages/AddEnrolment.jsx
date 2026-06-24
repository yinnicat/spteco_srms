import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEnrolment() {
  const navigate = useNavigate();

  const [enrolment, setEnrolment] = useState({
    enrolmentId: "",
    studentNo: "",
    studentName: "",
    courseCode: "",
    programme: "",
    faculty: "",
    level: "",
    enrolmentDate: "",
    completionDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setEnrolment({
      ...enrolment,
      [e.target.name]: e.target.value,
    });
  };

  const saveEnrolment = (e) => {
    e.preventDefault();

    const existingEnrolments =
      JSON.parse(localStorage.getItem("enrolments")) || [];

    const newEnrolment = {
      ...enrolment,
      enrolmentId: "ENR" + Date.now(),
    };

    localStorage.setItem(
      "enrolments",
      JSON.stringify([...existingEnrolments, newEnrolment])
    );

    alert("Enrolment saved successfully");
    navigate("/enrolments");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>New Enrolment</h1>
          <p>Register a student into a programme or course</p>
        </div>

        <form onSubmit={saveEnrolment} style={styles.card}>
          <div style={styles.form}>
            <div style={styles.group}>
              <label>Student Number</label>
              <input
                type="text"
                name="studentNo"
                value={enrolment.studentNo}
                onChange={handleChange}
                placeholder="STU0034/1256"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Student Name</label>
              <input
                type="text"
                name="studentName"
                value={enrolment.studentName}
                onChange={handleChange}
                placeholder="Student Name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={enrolment.courseCode}
                onChange={handleChange}
                placeholder="EE-N6"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Programme</label>
              <select
                name="programme"
                value={enrolment.programme}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Programme</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Management">Business Management</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Faculty</label>
              <select
                name="faculty"
                value={enrolment.faculty}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Faculty</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="ICT">ICT</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Level</label>
              <select
                name="level"
                value={enrolment.level}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Level</option>
                <option value="N4">N4</option>
                <option value="N5">N5</option>
                <option value="N6">N6</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Enrolment Date</label>
              <input
                type="date"
                name="enrolmentDate"
                value={enrolment.enrolmentDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Completion Date</label>
              <input
                type="date"
                name="completionDate"
                value={enrolment.completionDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.group}>
              <label>Status</label>
              <select
                name="status"
                value={enrolment.status}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.saveBtn}>
              Save Enrolment
            </button>

            <button
              type="button"
              onClick={() => navigate("/enrolments")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "20px",
  },

  group: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
  },

  buttonContainer: {
    marginTop: "30px",
    display: "flex",
    gap: "12px",
  },

  saveBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "14px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  cancelBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "14px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
};