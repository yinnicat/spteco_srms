import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    courseCode: "",
    courseName: "",
    faculty: "",
    department: "",
    level: "",
    semester: "",
    academicYear: "",
    credits: "",
    lecturerId: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const saveCourse = (e) => {
    e.preventDefault();

    const existingCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    const courseExists = existingCourses.some(
      (item) =>
        item.courseCode.toLowerCase() ===
        course.courseCode.toLowerCase()
    );

    if (courseExists) {
      alert("Course already exists");
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
        <div style={styles.header}>
          <h1>Add Course</h1>

          <p>
            Create a new course for the Student Records Management System
          </p>
        </div>

        <form onSubmit={saveCourse} style={styles.card}>
          <div style={styles.form}>
            <div style={styles.group}>
              <label>Course Code</label>

              <input
                type="text"
                name="courseCode"
                value={course.courseCode}
                onChange={handleChange}
                placeholder="EE-N6"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Course Name</label>

              <input
                type="text"
                name="courseName"
                value={course.courseName}
                onChange={handleChange}
                placeholder="Electrical Engineering"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Faculty</label>

              <input
                type="text"
                name="faculty"
                value={course.faculty}
                onChange={handleChange}
                placeholder="Engineering"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Department</label>

              <input
                type="text"
                name="department"
                value={course.department}
                onChange={handleChange}
                placeholder="Electrical"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Level</label>

              <select
                name="level"
                value={course.level}
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
              <label>Semester</label>

              <select
                name="semester"
                value={course.semester}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Academic Year</label>

              <input
                type="text"
                name="academicYear"
                value={course.academicYear}
                onChange={handleChange}
                placeholder="2026"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Credits</label>

              <input
                type="number"
                name="credits"
                value={course.credits}
                onChange={handleChange}
                placeholder="15"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Lecturer ID</label>

              <input
                type="text"
                name="lecturerId"
                value={course.lecturerId}
                onChange={handleChange}
                placeholder="EMP001"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Status</label>

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
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.saveBtn}>
              Save Course
            </button>

            <button
              type="button"
              onClick={() => navigate("/courses")}
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