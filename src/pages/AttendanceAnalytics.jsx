import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { defaultStudents } from "../data/studentData";

export default function AttendanceAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const students =
      JSON.parse(localStorage.getItem("students")) ||
      defaultStudents;

    const attendance =
      JSON.parse(localStorage.getItem("attendance")) || [];

    const results = students.map((student) => {
      const records = attendance.filter(
        (a) => a.studentNo === student.studentNo
      );

      const total = records.length;

      const present = records.filter(
        (r) => r.status === "Present"
      ).length;

      const percentage =
        total > 0
          ? Math.round((present / total) * 100)
          : 0;

      return {
        ...student,
        percentage,
      };
    });

    setAnalytics(results);
  }, []);

  const filteredStudents = analytics.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.studentNo
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const eligibleExam = analytics.filter(
    (s) => s.percentage >= 80
  ).length;

  const eligibleAllowance = analytics.filter(
    (s) => s.percentage >= 85
  ).length;

  const atRisk = analytics.filter(
    (s) => s.percentage < 80
  ).length;

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Attendance Analytics</h1>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Students</h3>
            <h1>{analytics.length}</h1>
          </div>

          <div style={styles.card}>
            <h3>Exam Eligible</h3>
            <h1>{eligibleExam}</h1>
          </div>

          <div style={styles.card}>
            <h3>Allowance Eligible</h3>
            <h1>{eligibleAllowance}</h1>
          </div>

          <div style={styles.cardDanger}>
            <h3>At Risk</h3>
            <h1>{atRisk}</h1>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student No</th>
                <th>Student</th>
                <th>Attendance %</th>
                <th>Exam Eligible</th>
                <th>Allowance Eligible</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(
                (student, index) => (
                  <tr key={index}>
                    <td>{student.studentNo}</td>

                    <td>
                      {student.firstName}{" "}
                      {student.lastName}
                    </td>

                    <td>
                      {student.percentage}%
                    </td>

                    <td>
                      {student.percentage >= 80
                        ? "✅ Yes"
                        : "❌ No"}
                    </td>

                    <td>
                      {student.percentage >= 85
                        ? "✅ Yes"
                        : "❌ No"}
                    </td>

                    <td>
                      <span
                        style={{
                          color:
                            student.percentage >= 80
                              ? "green"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {student.percentage >= 80
                          ? "Good Standing"
                          : "At Risk"}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      "0 1px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  cardDanger: {
    background: "#fee2e2",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  search: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  tableCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      "0 1px 4px rgba(0,0,0,0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};