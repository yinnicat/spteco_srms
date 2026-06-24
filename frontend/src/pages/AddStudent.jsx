import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    studentNo: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    omang: "",
    nationality: "Botswana",
    phone: "",
    email: "",
    address: "",
    faculty: "",
    programme: "",
    level: "",
    admissionDate: "",
    sen: "",
    ovc: "",
    nextOfKin: "",
    nextOfKinPhone: "",
    status: "",
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveStudent = (e) => {
    e.preventDefault();

    const existingStudents =
      JSON.parse(localStorage.getItem("students")) || [];

    const studentExists = existingStudents.some(
      (item) =>
        item.studentNo.toLowerCase() === student.studentNo.toLowerCase()
    );

    if (studentExists) {
      alert("Student number already exists");
      return;
    }

    const newStudent = {
      ...student,
      name: `${student.firstName} ${student.lastName}`,
    };

    localStorage.setItem(
      "students",
      JSON.stringify([...existingStudents, newStudent])
    );

    alert("Student saved successfully");
    navigate("/students");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Add Student</h1>
          <p>Register a new student into the Student Records Management System</p>
        </div>

        <form onSubmit={saveStudent} style={styles.card}>
          <div style={styles.form}>
            <div style={styles.group}>
              <label>Student Number</label>
              <input name="studentNo" value={student.studentNo} onChange={handleChange} type="text" placeholder="STU0034/1256" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>First Name</label>
              <input name="firstName" value={student.firstName} onChange={handleChange} type="text" placeholder="First Name" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Last Name</label>
              <input name="lastName" value={student.lastName} onChange={handleChange} type="text" placeholder="Last Name" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Date of Birth</label>
              <input name="dob" value={student.dob} onChange={handleChange} type="date" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Gender</label>
              <select name="gender" value={student.gender} onChange={handleChange} style={styles.input} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>National ID / Omang</label>
              <input name="omang" value={student.omang} onChange={handleChange} type="text" placeholder="Identity Number" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Nationality</label>
              <input name="nationality" value={student.nationality} onChange={handleChange} type="text" placeholder="Botswana" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Phone Number</label>
              <input name="phone" value={student.phone} onChange={handleChange} type="text" placeholder="Phone Number" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Email Address</label>
              <input name="email" value={student.email} onChange={handleChange} type="email" placeholder="student@email.com" style={styles.input} />
            </div>

            <div style={styles.group}>
              <label>Address</label>
              <input name="address" value={student.address} onChange={handleChange} type="text" placeholder="Selebi-Phikwe" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Faculty</label>
              <select name="faculty" value={student.faculty} onChange={handleChange} style={styles.input} required>
                <option value="">Select Faculty</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="ICT">ICT</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Programme</label>
              <select name="programme" value={student.programme} onChange={handleChange} style={styles.input} required>
                <option value="">Select Programme</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Management">Business Management</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Level</label>
              <select name="level" value={student.level} onChange={handleChange} style={styles.input} required>
                <option value="">Select Level</option>
                <option value="N4">N4</option>
                <option value="N5">N5</option>
                <option value="N6">N6</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Admission Date</label>
              <input name="admissionDate" value={student.admissionDate} onChange={handleChange} type="date" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>SEN Status</label>
              <select name="sen" value={student.sen} onChange={handleChange} style={styles.input} required>
                <option value="">Select SEN Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>OVC Status</label>
              <select name="ovc" value={student.ovc} onChange={handleChange} style={styles.input} required>
                <option value="">Select OVC Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Next of Kin</label>
              <input name="nextOfKin" value={student.nextOfKin} onChange={handleChange} type="text" placeholder="Next of Kin Name" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Next of Kin Phone</label>
              <input name="nextOfKinPhone" value={student.nextOfKinPhone} onChange={handleChange} type="text" placeholder="Next of Kin Contact" style={styles.input} required />
            </div>

            <div style={styles.group}>
              <label>Status</label>
              <select name="status" value={student.status} onChange={handleChange} style={styles.input} required>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Deferred">Deferred</option>
                <option value="Graduated">Graduated</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.saveBtn}>
              Save Student
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