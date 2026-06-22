import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  FaCertificate,
  FaSearch,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import { defaultStudents } from "../data/studentData";

export default function Certificates() {
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");

  const [newCertificate, setNewCertificate] = useState({
    studentNo: "",
    issueDate: "",
    notes: "",
  });

  useEffect(() => {
    const savedStudents =
      JSON.parse(localStorage.getItem("students")) || defaultStudents;

    const savedCertificates =
      JSON.parse(localStorage.getItem("certificates")) || [];

    setStudents(savedStudents);
    setCertificates(savedCertificates);
  }, []);

  const recordCertificate = () => {
    if (!newCertificate.studentNo || !newCertificate.issueDate) {
      alert("Please select student and issue date");
      return;
    }

    const student = students.find(
      (s) => s.studentNo === newCertificate.studentNo
    );

    const certificate = {
      id: "CERT" + Date.now(),
      certificateNo: "CERT-" + new Date().getFullYear() + "-" + Date.now(),
      studentNo: student.studentNo,
      studentName: `${student.firstName} ${student.lastName}`,
      programme: student.programme,
      issueDate: newCertificate.issueDate,
      collected: false,
      collectionDate: "",
      confirmedBy: "",
      notes: newCertificate.notes,
    };

    const updatedCertificates = [...certificates, certificate];

    setCertificates(updatedCertificates);
    localStorage.setItem("certificates", JSON.stringify(updatedCertificates));

    setNewCertificate({
      studentNo: "",
      issueDate: "",
      notes: "",
    });
  };

  const markAsCollected = (id) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const updatedCertificates = certificates.map((certificate) =>
      certificate.id === id
        ? {
            ...certificate,
            collected: true,
            collectionDate: new Date().toLocaleDateString(),
            confirmedBy: loggedInUser?.fullname || "System User",
          }
        : certificate
    );

    setCertificates(updatedCertificates);
    localStorage.setItem("certificates", JSON.stringify(updatedCertificates));
  };

  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.studentName.toLowerCase().includes(search.toLowerCase()) ||
      certificate.studentNo.toLowerCase().includes(search.toLowerCase()) ||
      certificate.certificateNo.toLowerCase().includes(search.toLowerCase())
  );

  const collectedCount = certificates.filter((c) => c.collected).length;
  const uncollectedCount = certificates.filter((c) => !c.collected).length;

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Certificate Collection</h1>
            <p>Record issued certificates and track student collection status</p>
          </div>

          <div style={styles.headerIcon}>
            <FaCertificate />
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>Total Issued</h3>
            <h1>{certificates.length}</h1>
          </div>

          <div style={styles.statCard}>
            <h3>Collected</h3>
            <h1>{collectedCount}</h1>
          </div>

          <div style={styles.statCardWarning}>
            <h3>Uncollected</h3>
            <h1>{uncollectedCount}</h1>
          </div>
        </div>

        <div style={styles.formCard}>
          <h2>Record Certificate Issuance</h2>

          <div style={styles.form}>
            <select
              value={newCertificate.studentNo}
              onChange={(e) =>
                setNewCertificate({
                  ...newCertificate,
                  studentNo: e.target.value,
                })
              }
              style={styles.input}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.studentNo} value={student.studentNo}>
                  {student.studentNo} - {student.firstName} {student.lastName}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={newCertificate.issueDate}
              onChange={(e) =>
                setNewCertificate({
                  ...newCertificate,
                  issueDate: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              placeholder="Notes"
              value={newCertificate.notes}
              onChange={(e) =>
                setNewCertificate({
                  ...newCertificate,
                  notes: e.target.value,
                })
              }
              style={styles.input}
            />

            <button style={styles.addBtn} onClick={recordCertificate}>
              <FaPlus /> Save Issuance
            </button>
          </div>
        </div>

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            placeholder="Search by student name, student number, or certificate number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Certificate No</th>
                <th>Student</th>
                <th>Programme</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Collection Date</th>
                <th>Confirmed By</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCertificates.map((certificate) => (
                <tr key={certificate.id}>
                  <td>{certificate.certificateNo}</td>
                  <td>
                    {certificate.studentNo}
                    <br />
                    <strong>{certificate.studentName}</strong>
                  </td>
                  <td>{certificate.programme}</td>
                  <td>{certificate.issueDate}</td>
                  <td>
                    <span
                      style={
                        certificate.collected
                          ? styles.collectedBadge
                          : styles.pendingBadge
                      }
                    >
                      {certificate.collected ? "Collected" : "Uncollected"}
                    </span>
                  </td>
                  <td>{certificate.collectionDate || "N/A"}</td>
                  <td>{certificate.confirmedBy || "N/A"}</td>
                  <td>{certificate.notes || "N/A"}</td>
                  <td>
                    {certificate.collected ? (
                      <span style={styles.doneText}>
                        <FaCheckCircle /> Done
                      </span>
                    ) : (
                      <button
                        style={styles.collectBtn}
                        onClick={() => markAsCollected(certificate.id)}
                      >
                        Mark Collected
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredCertificates.length === 0 && (
                <tr>
                  <td colSpan="9" style={styles.empty}>
                    No certificate records found
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

  statCardWarning: {
    background: "#fef3c7",
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

  collectedBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  pendingBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  collectBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  doneText: {
    color: "#166534",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};