import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultStudents } from "../data/studentData";

export default function AddEnrolment() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [enrolment, setEnrolment] = useState({
    studentNo: "",
    courseCode: "",
    enrolmentDate: "",
    completionDate: "",
    status: "Active",
  });

  useEffect(() => {
    const savedStudents =
      JSON.parse(localStorage.getItem("students")) || defaultStudents;

    const savedCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    setStudents(savedStudents);
    setCourses(savedCourses);
  }, []);

  const handleChange = (e) => {
    setEnrolment({
      ...enrolment,
      [e.target.name]: e.target.value,
    });
  };

  const saveEnrolment = () => {
    if (
      !enrolment.studentNo ||
      !enrolment.courseCode ||
      !enrolment.enrolmentDate
    ) {
      alert("Please select student, course, and enrolment date");
      return;
    }

    const existingEnrolments =
      JSON.parse(localStorage.getItem("enrolments")) || [];

    const alreadyActive = existingEnrolments.some(
      (item) =>
        item.studentNo === enrolment.studentNo &&
        item.courseCode === enrolment.courseCode &&
        item.status === "Active"
    );

    if (alreadyActive) {
      alert("This student already has an active enrolment for this course");
      return;
    }

    const student = students.find(
      (item) => item.studentNo === enrolment.studentNo
    );

    const course = courses.find(
      (item) => item.code === enrolment.courseCode
    );

    const newEnrolment = {
      id: "ENR" + Date.now(),
      studentNo: student.studentNo,
      studentName: `${student.firstName} ${student.lastName}`,
      courseCode: course.code,
      courseName: course.name,
      department: course.department,
      programmeType: course.programmeType,
      enrolmentDate: enrolment.enrolmentDate,
      completionDate: enrolment.completionDate,
      status: enrolment.status,
    };

    localStorage.setItem(
      "enrolments",
      JSON.stringify([...existingEnrolments, newEnrolment])
    );

    alert("Enrolment saved successfully");
    navigate("/enrolments");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1>New Enrolment</h1>

        <div style={styles.form}>
          <select
            name="studentNo"
            value={enrolment.studentNo}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.studentNo} value={student.studentNo}>
                {student.studentNo} - {student.firstName} {student.lastName}
              </option>
            ))}
          </select>

          <select
            name="courseCode"
            value={enrolment.courseCode}
            onChange={handleChange}
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
            name="enrolmentDate"
            value={enrolment.enrolmentDate}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="date"
            name="completionDate"
            value={enrolment.completionDate}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="status"
            value={enrolment.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <button style={styles.saveBtn} onClick={saveEnrolment}>
          Save Enrolment
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