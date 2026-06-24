import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(savedCourses);
  }, []);

  const deleteCourse = (courseCode) => {
    const confirmDelete = window.confirm("Delete this course?");

    if (!confirmDelete) return;

    const updatedCourses = courses.filter(
      (course) => course.courseCode !== courseCode
    );

    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const filteredCourses = courses.filter(
    (course) =>
      (course.courseCode || "").toLowerCase().includes(search.toLowerCase()) ||
      (course.courseName || "").toLowerCase().includes(search.toLowerCase()) ||
      (course.faculty || "").toLowerCase().includes(search.toLowerCase()) ||
      (course.department || "").toLowerCase().includes(search.toLowerCase()) ||
      (course.level || "").toLowerCase().includes(search.toLowerCase()) ||
      (course.lecturerId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Courses</h1>
            <p style={styles.subtitle}>
              Manage courses, faculties, departments and levels
            </p>
          </div>

          <Link to="/courses/add">
            <button style={styles.addBtn}>+ Add Course</button>
          </Link>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Courses</h3>
            <h1>{courses.length}</h1>
          </div>

          <div style={styles.card}>
            <h3>Active Courses</h3>
            <h1>{courses.filter((course) => course.status === "Active").length}</h1>
          </div>

          <div style={styles.card}>
            <h3>Faculties</h3>
            <h1>{new Set(courses.map((course) => course.faculty).filter(Boolean)).size}</h1>
          </div>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                <th>Department</th>
                <th>Level</th>
                <th>Academic Year</th>
                <th>Lecturer ID</th>
                <th>Status</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="10" style={styles.empty}>
                    Course records will appear here once added or connected to the backend.
                  </td>
                </tr>
              )}

              {filteredCourses.map((course) => (
                <tr key={course.courseCode}>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.faculty}</td>
                  <td>{course.department}</td>
                  <td>{course.level}</td>
                  <td>{course.academicYear || "-"}</td>
                  <td>{course.lecturerId || "-"}</td>

                  <td>
                    <span style={styles.activeBadge}>{course.status}</span>
                  </td>

                  <td>
                    <Link to={`/courses/details/${course.courseCode}`}>
                      <button style={styles.viewBtn}>View</button>
                    </Link>
                  </td>

                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteCourse(course.courseCode)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { background: "#f5f6fa", minHeight: "100vh" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: { margin: 0, color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280" },
  addBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginBottom: "25px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  searchSection: { marginBottom: "20px" },
  searchInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
  },
  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  viewBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};