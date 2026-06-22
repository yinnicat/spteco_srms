import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { defaultStudents } from "../data/studentData";

export default function Enrolments() {
  const defaultCourses = [
    {
      code: "ELE101",
      name: "Electrical Principles",
      department: "Engineering",
      programmeType: "Long Term",
      status: "Active",
    },
    {
      code: "BUS102",
      name: "Business Management",
      department: "Business",
      programmeType: "Long Term",
      status: "Active",
    },
  ];

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [search, setSearch] = useState("");

  const [newEnrolment, setNewEnrolment] = useState({
    studentNo: "",
    courseCode: "",
    enrolmentDate: "",
    completionDate: "",
    status: "Active",
  });

  useEffect(() => {
    setStudents(
      JSON.parse(localStorage.getItem("students")) || defaultStudents
    );

    setCourses(
      JSON.parse(localStorage.getItem("courses")) || defaultCourses
    );

    setEnrolments(
      JSON.parse(localStorage.getItem("enrolments")) || []
    );
  }, []);

  const addEnrolment = () => {
    if (
      !newEnrolment.studentNo ||
      !newEnrolment.courseCode ||
      !newEnrolment.enrolmentDate
    ) {
      alert("Please select student, course, and enrolment date");
      return;
    }

    const alreadyActive = enrolments.some(
      (enrolment) =>
        enrolment.studentNo === newEnrolment.studentNo &&
        enrolment.courseCode === newEnrolment.courseCode &&
        enrolment.status === "Active"
    );

    if (alreadyActive) {
      alert(
        "This student already has an active enrolment for this course"
      );
      return;
    }

    const student = students.find(
      (s) => s.studentNo === newEnrolment.studentNo
    );

    const course = courses.find(
      (c) => c.code === newEnrolment.courseCode
    );

    const enrolment = {
      id: "ENR" + Date.now(),
      studentNo: student.studentNo,
      studentName: `${student.firstName} ${student.lastName}`,
      courseCode: course.code,
      courseName: course.name,
      department: course.department,
      programmeType: course.programmeType,
      enrolmentDate: newEnrolment.enrolmentDate,
      completionDate: newEnrolment.completionDate,
      status: newEnrolment.status,
    };

    const updatedEnrolments = [...enrolments, enrolment];

    setEnrolments(updatedEnrolments);

    localStorage.setItem(
      "enrolments",
      JSON.stringify(updatedEnrolments)
    );

    setNewEnrolment({
      studentNo: "",
      courseCode: "",
      enrolmentDate: "",
      completionDate: "",
      status: "Active",
    });
  };

  const updateStatus = (id, status) => {
    const updatedEnrolments = enrolments.map((enrolment) =>
      enrolment.id === id
        ? {
            ...enrolment,
            status,
          }
        : enrolment
    );

    setEnrolments(updatedEnrolments);

    localStorage.setItem(
      "enrolments",
      JSON.stringify(updatedEnrolments)
    );
  };

  const filteredEnrolments = enrolments.filter(
    (enrolment) =>
      enrolment.studentName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      enrolment.studentNo
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      enrolment.courseName
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Student Enrolments</h1>
            <p>
              Manage student course registrations and enrolment
              history
            </p>
          </div>

          <div style={styles.headerIcon}>
            <FaClipboardList />
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>Total Enrolments</h3>
            <h1>{enrolments.length}</h1>
          </div>

          <div style={styles.statCard}>
            <h3>Active Enrolments</h3>
            <h1>
              {
                enrolments.filter((e) => e.status === "Active")
                  .length
              }
            </h1>
          </div>

          <div style={styles.statCard}>
            <h3>Completed</h3>
            <h1>
              {
                enrolments.filter(
                  (e) => e.status === "Completed"
                ).length
              }
            </h1>
          </div>
        </div>

        <div style={styles.formCard}>
          <h2>New Enrolment</h2>

          <div style={styles.form}>
            <select
              value={newEnrolment.studentNo}
              onChange={(e) =>
                setNewEnrolment({
                  ...newEnrolment,
                  studentNo: e.target.value,
                })
              }
              style={styles.input}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option
                  key={student.studentNo}
                  value={student.studentNo}
                >
                  {student.studentNo} - {student.firstName}{" "}
                  {student.lastName}
                </option>
              ))}
            </select>

            <select
              value={newEnrolment.courseCode}
              onChange={(e) =>
                setNewEnrolment({
                  ...newEnrolment,
                  courseCode: e.target.value,
                })
              }
              style={styles.input}
            >
              <option value="">Select Course</option>

              {courses
                .filter((course) => course.status === "Active")
                .map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
            </select>

            <input
              type="date"
              value={newEnrolment.enrolmentDate}
              onChange={(e) =>
                setNewEnrolment({
                  ...newEnrolment,
                  enrolmentDate: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              type="date"
              value={newEnrolment.completionDate}
              onChange={(e) =>
                setNewEnrolment({
                  ...newEnrolment,
                  completionDate: e.target.value,
                })
              }
              style={styles.input}
            />

            <select
              value={newEnrolment.status}
              onChange={(e) =>
                setNewEnrolment({
                  ...newEnrolment,
                  status: e.target.value,
                })
              }
              style={styles.input}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>

            <button style={styles.addBtn} onClick={addEnrolment}>
              <FaPlus /> Save Enrolment
            </button>
          </div>
        </div>

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            placeholder="Search by student number, student name, or course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student No</th>
                <th>Student</th>
                <th>Course</th>
                <th>Programme Type</th>
                <th>Enrolment Date</th>
                <th>Completion Date</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnrolments.map((enrolment) => (
                <tr key={enrolment.id}>
                  <td>{enrolment.studentNo}</td>
                  <td>{enrolment.studentName}</td>
                  <td>
                    {enrolment.courseCode} - {enrolment.courseName}
                  </td>
                  <td>{enrolment.programmeType}</td>
                  <td>{enrolment.enrolmentDate}</td>
                  <td>{enrolment.completionDate || "N/A"}</td>
                  <td>
                    <span
                      style={
                        enrolment.status === "Active"
                          ? styles.activeBadge
                          : enrolment.status === "Completed"
                          ? styles.completedBadge
                          : styles.withdrawnBadge
                      }
                    >
                      {enrolment.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={enrolment.status}
                      onChange={(e) =>
                        updateStatus(enrolment.id, e.target.value)
                      }
                      style={styles.smallSelect}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredEnrolments.length === 0 && (
                <tr>
                  <td colSpan="8" style={styles.empty}>
                    No enrolments found
                  </td>
                </tr>
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  headerIcon: {
    fontSize: "50px",
    color: "#2563eb",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  formCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "15px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },

  addBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  searchBox: {
    background: "#fff",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
  },

  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  activeBadge: {
    background: "#dbeafe",
    color: "#1e3a8a",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  completedBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  withdrawnBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  smallSelect: {
    padding: "7px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};