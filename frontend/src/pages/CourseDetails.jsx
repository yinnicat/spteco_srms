import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { FaBook, FaUserTie } from "react-icons/fa";

export default function CourseDetails() {
  const { courseCode } = useParams();

  const courses = JSON.parse(localStorage.getItem("courses")) || [];

  const course = courses.find((item) => item.courseCode === courseCode);

  if (!course) {
    return (
      <Layout>
        <div style={styles.container}>
          <div style={styles.card}>
            <h1>Course Details</h1>
            <p style={styles.empty}>
              Course record not found. It may not exist yet or will be loaded from the backend later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Course Details</h1>
            <p>View complete course information</p>
          </div>

          <FaBook style={styles.icon} />
        </div>

        <div style={styles.card}>
          <div style={styles.grid}>
            <div style={styles.item}>
              <label>Course Code</label>
              <h3>{course.courseCode}</h3>
            </div>

            <div style={styles.item}>
              <label>Course Name</label>
              <h3>{course.courseName}</h3>
            </div>

            <div style={styles.item}>
              <label>Faculty</label>
              <h3>{course.faculty}</h3>
            </div>

            <div style={styles.item}>
              <label>Department</label>
              <h3>{course.department}</h3>
            </div>

            <div style={styles.item}>
              <label>Level</label>
              <h3>{course.level}</h3>
            </div>

            <div style={styles.item}>
              <label>Semester</label>
              <h3>{course.semester}</h3>
            </div>

            <div style={styles.item}>
              <label>Academic Year</label>
              <h3>{course.academicYear}</h3>
            </div>

            <div style={styles.item}>
              <label>Credits</label>
              <h3>{course.credits}</h3>
            </div>

            <div style={styles.item}>
              <label>Lecturer ID</label>
              <h3>
                <FaUserTie /> {course.lecturerId}
              </h3>
            </div>

            <div style={styles.item}>
              <label>Status</label>
              <span style={styles.badge}>{course.status}</span>
            </div>
          </div>
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
  icon: { fontSize: "50px", color: "#1e3a8a" },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "25px",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  badge: {
    width: "fit-content",
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  empty: { color: "#6b7280" },
};