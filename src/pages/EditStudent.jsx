import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { defaultStudents } from "../data/studentData";

export default function EditStudent() {
  const { studentNo } = useParams();
  const navigate = useNavigate();

  const students =
    JSON.parse(localStorage.getItem("students")) ||
    defaultStudents;

  const currentStudent = students.find(
    (s) => s.studentNo === studentNo
  );

  const [student, setStudent] =
    useState(currentStudent);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveChanges = () => {
    const updated = students.map((s) =>
      s.studentNo === studentNo ? student : s
    );

    localStorage.setItem(
      "students",
      JSON.stringify(updated)
    );

    alert("Student Updated");

    navigate("/students");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Edit Student</h1>

        <div style={styles.form}>
          <input
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
          />

          <input
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
          />

          <input
            name="programme"
            value={student.programme}
            onChange={handleChange}
          />
        </div>

        <button
          style={styles.btn}
          onClick={saveChanges}
        >
          Save Changes
        </button>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px" },

  form: {
    display: "grid",
    gap: "15px",
    marginBottom: "20px",
  },

  btn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
  },
};