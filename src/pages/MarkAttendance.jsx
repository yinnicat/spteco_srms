import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { defaultStudents } from "../data/studentData";

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const savedStudents =
      JSON.parse(localStorage.getItem("students")) ||
      defaultStudents;

    setStudents(savedStudents);
  }, []);

  const markAttendance = (studentNo, status) => {
    const attendance =
      JSON.parse(localStorage.getItem("attendance")) || [];

    attendance.push({
      studentNo,
      status,
      date: new Date().toLocaleDateString(),
    });

    localStorage.setItem(
      "attendance",
      JSON.stringify(attendance)
    );

    alert("Attendance Recorded");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Mark Attendance</h1>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.studentNo}</td>

                <td>
                  {student.firstName} {student.lastName}
                </td>

                <td>
                  <button
                    style={styles.present}
                    onClick={() =>
                      markAttendance(
                        student.studentNo,
                        "Present"
                      )
                    }
                  >
                    Present
                  </button>
                </td>

                <td>
                  <button
                    style={styles.absent}
                    onClick={() =>
                      markAttendance(
                        student.studentNo,
                        "Absent"
                      )
                    }
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  table: {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
  },

  present: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
  },

  absent: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
  },
};