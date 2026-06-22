import Layout from "../components/Layout";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { defaultStudents } from "../data/studentData";

export default function StudentProfile() {
  const { studentNo } = useParams();

  const students =
    JSON.parse(localStorage.getItem("students")) ||
    defaultStudents;

  const student = students.find(
    (s) => s.studentNo === studentNo
  );

  const [activeTab, setActiveTab] = useState("personal");

  if (!student) {
    return (
      <Layout>
        <h2>Student Not Found</h2>
      </Layout>
    );
  }

  const attendance = 78;
  const averageMark = 74;
  const progress = 65;

  const riskLevel =
    attendance < 80 || averageMark < 50
      ? "High Risk"
      : "Low Risk";

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Student Command Center</h1>

        <div style={styles.tabs}>
          <button
            style={
              activeTab === "personal"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setActiveTab("personal")}
          >
            Personal
          </button>

          <button
            style={
              activeTab === "academic"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setActiveTab("academic")}
          >
            Academic
          </button>

          <button
            style={
              activeTab === "attendance"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>

          <button
            style={
              activeTab === "results"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setActiveTab("results")}
          >
            Results
          </button>
        </div>

        {activeTab === "personal" && (
          <>
            <div style={styles.profileSection}>
              <div style={styles.photoCard}>
                <div style={styles.photo}>
                  Student Photo
                </div>

                <button style={styles.uploadBtn}>
                  Upload Photo
                </button>
              </div>

              <div style={styles.infoCard}>
                <h2>
                  {student.firstName}{" "}
                  {student.lastName}
                </h2>

                <p>
                  <strong>Student No:</strong>{" "}
                  {student.studentNo}
                </p>

                <p>
                  <strong>Programme:</strong>{" "}
                  {student.programme}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {student.status}
                </p>

                <p>
                  <strong>SEN:</strong>{" "}
                  {student.sen}
                </p>

                <p>
                  <strong>OVC:</strong>{" "}
                  {student.ovc}
                </p>

                <Link
                  to={`/students/edit/${student.studentNo}`}
                >
                  <button style={styles.editBtn}>
                    Edit Student
                  </button>
                </Link>
              </div>
            </div>

            <div style={styles.timelineCard}>
              <h2>Student Timeline</h2>

              <ul>
                <li>✓ Admitted to College</li>
                <li>✓ Registered for Programme</li>
                <li>✓ Semester 1 Completed</li>
                <li>⚠ Attendance Warning</li>
              </ul>
            </div>
          </>
        )}

        {activeTab === "academic" && (
          <div style={styles.timelineCard}>
            <h2>Academic Information</h2>

            <p>
              <strong>Programme:</strong>{" "}
              {student.programme}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {student.status}
            </p>

            <p>
              <strong>Progress:</strong>{" "}
              {progress}%
            </p>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div style={styles.dashboardGrid}>
            <div style={styles.card}>
              <h3>Attendance</h3>
              <h1>{attendance}%</h1>

              <p>
                {attendance >= 80
                  ? "Eligible For Exams"
                  : "Not Eligible"}
              </p>
            </div>

            <div style={styles.card}>
              <h3>Risk Analysis</h3>

              <h2>{riskLevel}</h2>

              <p>
                Based on attendance and
                performance
              </p>
            </div>

            <div style={styles.card}>
              <h3>Average Mark</h3>

              <h1>{averageMark}%</h1>

              <p>
                Current Academic Standing
              </p>
            </div>

            <div style={styles.card}>
              <h3>Programme Progress</h3>

              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p>{progress}% Complete</p>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div style={styles.timelineCard}>
            <h2>Results Summary</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Mark</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Programming</td>
                  <td>85%</td>
                </tr>

                <tr>
                  <td>Database Systems</td>
                  <td>78%</td>
                </tr>

                <tr>
                  <td>Networking</td>
                  <td>81%</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: "20px" }}>
              Average: {averageMark}%
            </h3>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    padding: "10px 15px",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  activeTab: {
    padding: "10px 15px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  profileSection: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },

  photoCard: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  photo: {
    width: "180px",
    height: "180px",
    background: "#e5e7eb",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  uploadBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
  },

  infoCard: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    marginTop: "15px",
    cursor: "pointer",
  },

  dashboardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  progressBar: {
    width: "100%",
    height: "20px",
    background: "#ddd",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
  },

  timelineCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};