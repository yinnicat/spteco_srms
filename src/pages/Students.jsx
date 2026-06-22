import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { defaultStudents } from "../data/studentData";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const deleteStudent = (studentNo) => {
  const updatedStudents = students.filter(
    (student) =>
      student.studentNo !== studentNo
  );

  localStorage.setItem(
    "students",
    JSON.stringify(updatedStudents)
  );

  setStudents(updatedStudents);
};

  useEffect(() => {
    const savedStudents =
      JSON.parse(localStorage.getItem("students")) ||
      defaultStudents;

    setStudents(savedStudents);
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Students</h1>

          <Link to="/students/add">
            <button style={styles.addBtn}>
              + Add Student
            </button>
          </Link>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student No</th>
                <th>Name</th>
                <th>Programme</th>
                <th>Status</th>
                <th>SEN</th>
                <th>OVC</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.studentNo}</td>

                  <td>
                    {student.firstName} {student.lastName}
                  </td>

                  <td>{student.programme}</td>

                  <td>{student.status}</td>

                  <td>{student.sen}</td>

                  <td>{student.ovc}</td>

                 <td>
                 <Link
                  to={`/students/profile/${student.studentNo}`}
                 >
                  <button style={styles.viewBtn}>
                    View
                  </button>
                  </Link>

                  <button
                    style={styles.deleteBtn}
                      onClick={() =>
                        deleteStudent(student.studentNo)
                 }
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
  container: {
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  addBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  marginLeft: "10px",
  borderRadius: "5px",
},

  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
  },
};