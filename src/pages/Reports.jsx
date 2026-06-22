import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaUsers,
  FaUserGraduate,
  FaCalendarCheck,
  FaCertificate,
  FaPrint,
  FaSearch,
} from "react-icons/fa";
import { defaultStudents } from "../data/studentData";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [activeReport, setActiveReport] = useState("students");
  const [search, setSearch] = useState("");

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const role = loggedInUser?.role;

  useEffect(() => {
    setStudents(
      JSON.parse(localStorage.getItem("students")) || defaultStudents
    );

    setCertificates(
      JSON.parse(localStorage.getItem("certificates")) || []
    );

    setEnrolments(
      JSON.parse(localStorage.getItem("enrolments")) || []
    );
  }, []);

  const canViewRestrictedReports =
    role === "Database Admin" || role === "Admin Staff";

  const senStudents = students.filter(
    (student) => student.sen === "Yes"
  );

  const ovcStudents = students.filter(
    (student) => student.ovc === "Yes"
  );

  const uncollectedCertificates = certificates.filter(
    (certificate) => !certificate.collected
  );

  const attendanceData = students.map((student, index) => {
    const attendance = 60 + ((index * 9) % 40);

    return {
      studentNo: student.studentNo,
      name: `${student.firstName} ${student.lastName}`,
      programme: student.programme,
      attendance,
      required: "80%",
      status: attendance >= 80 ? "Meets Threshold" : "Below Threshold",
    };
  });

  const reports = [
    {
      id: "students",
      title: "All Students",
      description: "Complete list of registered students",
      icon: <FaUserGraduate />,
      allowed: true,
    },
    {
      id: "attendance",
      title: "Attendance Report",
      description: "Hours and percentage attendance summary",
      icon: <FaCalendarCheck />,
      allowed: true,
    },
    {
      id: "enrolments",
      title: "Course Enrolment",
      description: "Students enrolled in courses",
      icon: <FaUsers />,
      allowed: true,
    },
    {
      id: "sen",
      title: "SEN Students",
      description: "Students with special educational needs",
      icon: <FaFileAlt />,
      allowed: canViewRestrictedReports,
    },
    {
      id: "ovc",
      title: "OVC Students",
      description: "Orphans and vulnerable children report",
      icon: <FaFileAlt />,
      allowed: canViewRestrictedReports,
    },
    {
      id: "certificates",
      title: "Uncollected Certificates",
      description: "Certificates not yet collected",
      icon: <FaCertificate />,
      allowed: canViewRestrictedReports,
    },
  ];

  const visibleReports = reports.filter((report) => report.allowed);

  const printReport = () => {
    window.print();
  };

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.studentNo
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.programme
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const renderReportTable = () => {
    if (activeReport === "students") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Name</th>
              <th>Programme</th>
              <th>Status</th>
              <th>SEN</th>
              <th>OVC</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.studentNo}</td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.programme}</td>
                <td>{student.status}</td>
                <td>{student.sen}</td>
                <td>{student.ovc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeReport === "attendance") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Name</th>
              <th>Programme</th>
              <th>Attendance</th>
              <th>Required</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendanceData.map((item, index) => (
              <tr key={index}>
                <td>{item.studentNo}</td>
                <td>{item.name}</td>
                <td>{item.programme}</td>
                <td>{item.attendance}%</td>
                <td>{item.required}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeReport === "enrolments") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Student</th>
              <th>Course</th>
              <th>Programme Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {enrolments.map((enrolment) => (
              <tr key={enrolment.id}>
                <td>{enrolment.studentNo}</td>
                <td>{enrolment.studentName}</td>
                <td>{enrolment.courseName}</td>
                <td>{enrolment.programmeType}</td>
                <td>{enrolment.status}</td>
              </tr>
            ))}

            {enrolments.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.empty}>
                  No enrolment records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    if (activeReport === "sen") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Name</th>
              <th>Programme</th>
              <th>SEN</th>
            </tr>
          </thead>

          <tbody>
            {senStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.studentNo}</td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.programme}</td>
                <td>{student.sen}</td>
              </tr>
            ))}

            {senStudents.length === 0 && (
              <tr>
                <td colSpan="4" style={styles.empty}>
                  No SEN students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    if (activeReport === "ovc") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Name</th>
              <th>Programme</th>
              <th>OVC</th>
            </tr>
          </thead>

          <tbody>
            {ovcStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.studentNo}</td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.programme}</td>
                <td>{student.ovc}</td>
              </tr>
            ))}

            {ovcStudents.length === 0 && (
              <tr>
                <td colSpan="4" style={styles.empty}>
                  No OVC students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    if (activeReport === "certificates") {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Certificate No</th>
              <th>Student</th>
              <th>Programme</th>
              <th>Issue Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {uncollectedCertificates.map((certificate) => (
              <tr key={certificate.id}>
                <td>{certificate.certificateNo}</td>
                <td>{certificate.studentName}</td>
                <td>{certificate.programme}</td>
                <td>{certificate.issueDate}</td>
                <td>Uncollected</td>
              </tr>
            ))}

            {uncollectedCertificates.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.empty}>
                  No uncollected certificates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Reports</h1>
            <p>
              Generate and print student, attendance, enrolment, and
              certificate reports
            </p>
          </div>

          <button style={styles.printBtn} onClick={printReport}>
            <FaPrint /> Print Report
          </button>
        </div>

        <div style={styles.cards}>
          {visibleReports.map((report) => (
            <button
              key={report.id}
              style={
                activeReport === report.id
                  ? styles.activeReportCard
                  : styles.reportCard
              }
              onClick={() => setActiveReport(report.id)}
            >
              <div style={styles.reportIcon}>{report.icon}</div>
              <div>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            placeholder="Search current report"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.reportPanel}>
          <h2>
            {
              reports.find((report) => report.id === activeReport)
                ?.title
            }
          </h2>

          {renderReportTable()}
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

  printBtn: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  reportCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  activeReportCard: {
    background: "#e8f0ff",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #2563eb",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  reportIcon: {
    fontSize: "28px",
    color: "#2563eb",
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

  reportPanel: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};