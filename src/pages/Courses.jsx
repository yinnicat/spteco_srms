import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { FaBook, FaPlus, FaSearch } from "react-icons/fa";

export default function Courses() {
  const defaultCourses = [
    {
      code: "ELE101",
      name: "Electrical Principles",
      level: "Certificate",
      department: "Engineering",
      duration: "1.0",
      programmeType: "Long Term",
      description: "Basic electrical principles and workshop practice.",
      status: "Active",
    },
    {
      code: "BUS102",
      name: "Business Management",
      level: "Certificate",
      department: "Business",
      duration: "1.0",
      programmeType: "Long Term",
      description: "Introduction to business operations and management.",
      status: "Active",
    },
  ];

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    level: "",
    department: "",
    duration: "",
    programmeType: "",
    description: "",
  });

  useEffect(() => {
    const savedCourses =
      JSON.parse(localStorage.getItem("courses")) || defaultCourses;

    setCourses(savedCourses);
  }, []);

  const addCourse = () => {
    if (
      !newCourse.code ||
      !newCourse.name ||
      !newCourse.level ||
      !newCourse.department ||
      !newCourse.duration ||
      !newCourse.programmeType
    ) {
      alert("Please fill all required fields");
      return;
    }

    const updatedCourses = [
      ...courses,
      {
        ...newCourse,
        status: "Active",
      },
    ];

    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));

    setNewCourse({
      code: "",
      name: "",
      level: "",
      department: "",
      duration: "",
      programmeType: "",
      description: "",
    });
  };

  const deactivateCourse = (code) => {
    const confirmAction = window.confirm(
      "Are you sure you want to deactivate this course?"
    );

    if (!confirmAction) return;

    const updatedCourses = courses.map((course) =>
      course.code === code
        ? {
            ...course,
            status: "Inactive",
          }
        : course
    );

    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Courses</h1>
            <p>Manage college courses and programme types</p>
          </div>

          <div style={styles.headerIcon}>
            <FaBook />
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>Total Courses</h3>
            <h1>{courses.length}</h1>
          </div>

          <div style={styles.statCard}>
            <h3>Active Courses</h3>
            <h1>{courses.filter((c) => c.status === "Active").length}</h1>
          </div>

          <div style={styles.statCard}>
            <h3>Departments</h3>
            <h1>{new Set(courses.map((c) => c.department)).size}</h1>
          </div>
        </div>

        <div style={styles.addCard}>
          <h2>Add Course</h2>

          <div style={styles.form}>
            <input
              placeholder="Course Code"
              value={newCourse.code}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  code: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  name: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              placeholder="Level"
              value={newCourse.level}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  level: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              placeholder="Department"
              value={newCourse.department}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  department: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              type="number"
              step="0.5"
              placeholder="Duration"
              value={newCourse.duration}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  duration: e.target.value,
                })
              }
              style={styles.input}
            />

            <select
              value={newCourse.programmeType}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  programmeType: e.target.value,
                })
              }
              style={styles.input}
            >
              <option value="">Programme Type</option>
              <option value="Long Term">Long Term</option>
              <option value="Short Term">Short Term</option>
            </select>

            <input
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  description: e.target.value,
                })
              }
              style={styles.input}
            />

            <button style={styles.addBtn} onClick={addCourse}>
              <FaPlus /> Add Course
            </button>
          </div>
        </div>

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            placeholder="Search by course name, code, or department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Level</th>
                <th>Department</th>
                <th>Duration</th>
                <th>Programme Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.code}>
                  <td>{course.code}</td>
                  <td>
                    <strong>{course.name}</strong>
                    <br />
                    <small>{course.description}</small>
                  </td>
                  <td>{course.level}</td>
                  <td>{course.department}</td>
                  <td>{course.duration}</td>
                  <td>{course.programmeType}</td>
                  <td>
                    <span
                      style={
                        course.status === "Active"
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <button
                      style={styles.deactivateBtn}
                      onClick={() => deactivateCourse(course.code)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="8" style={styles.empty}>
                    No courses found
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

  addCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
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
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  inactiveBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  deactivateBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};