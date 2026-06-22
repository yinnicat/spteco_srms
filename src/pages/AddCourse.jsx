import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    code: "",
    name: "",
    level: "",
    department: "",
    duration: "",
    programmeType: "",
    description: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const saveCourse = () => {
    if (
      !course.code ||
      !course.name ||
      !course.level ||
      !course.department ||
      !course.duration ||
      !course.programmeType
    ) {
      alert("Please fill all required fields");
      return;
    }

    const existingCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    const duplicate = existingCourses.some(
      (item) => item.code.toLowerCase() === course.code.toLowerCase()
    );

    if (duplicate) {
      alert("Course code already exists");
      return;
    }

    localStorage.setItem(
      "courses",
      JSON.stringify([...existingCourses, course])
    );

    alert("Course saved successfully");
    navigate("/courses");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Add Course</h1>

        <div style={styles.form}>
          <input
            name="code"
            placeholder="Course Code"
            value={course.code}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="name"
            placeholder="Course Name"
            value={course.name}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="level"
            value={course.level}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Level</option>
            <option value="Certificate">Certificate</option>
            <option value="N4">N4</option>
            <option value="N5">N5</option>
            <option value="N6">N6</option>
          </select>

          <input
            name="department"
            placeholder="Department"
            value={course.department}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="duration"
            type="number"
            step="0.5"
            placeholder="Duration"
            value={course.duration}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="programmeType"
            value={course.programmeType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Programme Type</option>
            <option value="Long Term">Long Term</option>
            <option value="Short Term">Short Term</option>
          </select>

          <input
            name="description"
            placeholder="Description"
            value={course.description}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="status"
            value={course.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button style={styles.saveBtn} onClick={saveCourse}>
          Save Course
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

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
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