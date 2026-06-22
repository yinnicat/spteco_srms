import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { defaultStudents } from "../data/studentData";

export default function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    studentNo: "",
    firstName: "",
    lastName: "",
    programme: "",
    status: "Active",
    sen: "No",
    ovc: "No",
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveStudent = () => {
    const existingStudents =
      JSON.parse(localStorage.getItem("students")) ||
      [...defaultStudents];

    existingStudents.push(student);

    localStorage.setItem(
      "students",
      JSON.stringify(existingStudents)
    );

    alert("Student Saved Successfully");

    navigate("/students");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Add New Student</h1>

        <div style={styles.form}>
          <input
            name="studentNo"
            placeholder="Student Number"
            value={student.studentNo}
            onChange={handleChange}
          />

          <input
            name="firstName"
            placeholder="First Name"
            value={student.firstName}
            onChange={handleChange}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={student.lastName}
            onChange={handleChange}
          />

          <input
            name="programme"
            placeholder="Programme"
            value={student.programme}
            onChange={handleChange}
          />

          <select
            name="status"
            value={student.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Deferred">Deferred</option>
          </select>

          <select
            name="sen"
            value={student.sen}
            onChange={handleChange}
          >
            <option value="No">SEN - No</option>
            <option value="Yes">SEN - Yes</option>
          </select>

          <select
            name="ovc"
            value={student.ovc}
            onChange={handleChange}
          >
            <option value="No">OVC - No</option>
            <option value="Yes">OVC - Yes</option>
          </select>
        </div>

        <button
          style={styles.saveBtn}
          onClick={saveStudent}
        >
          Save Student
        </button>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "15px",
    marginBottom: "20px",
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};