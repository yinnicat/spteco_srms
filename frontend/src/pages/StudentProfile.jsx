import Layout from "../components/Layout";
import { useParams } from "react-router-dom";

export default function StudentProfile() {
  const { studentNo } = useParams();

  const students = JSON.parse(localStorage.getItem("students")) || [];

  const student = students.find((item) => item.studentNo === studentNo);

  if (!student) {
    return (
      <Layout>
        <div style={styles.container}>
          <div style={styles.profileCard}>
            <h1>Student Profile</h1>
            <p style={styles.empty}>
              Student record not found. It may not exist yet or will be loaded
              from the backend later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const fullName =
    student.name || `${student.firstName || ""} ${student.lastName || ""}`;

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("");

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.header}>
            <div style={styles.photo}>{initials}</div>

            <div>
              <h1 style={styles.name}>{fullName}</h1>
              <p style={styles.text}>Student No: {student.studentNo}</p>
              <span style={styles.status}>{student.status}</span>
            </div>

            <button
              style={styles.editBtn}
              onClick={() =>
                alert("Edit Student will be connected to the backend")
              }
            >
              Edit Student
            </button>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.smallCard}>
            <h3>Programme</h3>
            <h2>{student.programme || "-"}</h2>
          </div>

          <div style={styles.smallCard}>
            <h3>Level</h3>
            <h2>{student.level || "-"}</h2>
          </div>

          <div style={styles.smallCard}>
            <h3>SEN</h3>
            <h2>{student.sen || "-"}</h2>
          </div>

          <div style={styles.smallCard}>
            <h3>OVC</h3>
            <h2>{student.ovc || "-"}</h2>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Personal Details</h3>

          <div style={styles.grid}>
            <div style={styles.item}>
              <strong>Gender</strong>
              <span>{student.gender || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Date Of Birth</strong>
              <span>{student.dob || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>OMANG</strong>
              <span>{student.omang || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Nationality</strong>
              <span>{student.nationality || "-"}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Contact Information</h3>

          <div style={styles.grid}>
            <div style={styles.item}>
              <strong>Email</strong>
              <span>{student.email || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Phone</strong>
              <span>{student.phone || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Address</strong>
              <span>{student.address || "-"}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Academic Details</h3>

          <div style={styles.grid}>
            <div style={styles.item}>
              <strong>Faculty</strong>
              <span>{student.faculty || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Programme</strong>
              <span>{student.programme || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Level</strong>
              <span>{student.level || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Admission Date</strong>
              <span>{student.admissionDate || "-"}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Next Of Kin</h3>

          <div style={styles.grid}>
            <div style={styles.item}>
              <strong>Name</strong>
              <span>{student.nextOfKin || "-"}</span>
            </div>

            <div style={styles.item}>
              <strong>Phone</strong>
              <span>{student.nextOfKinPhone || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  profileCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  photo: {
    width: "110px",
    height: "110px",
    background: "#1e3a8a",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    fontWeight: "700",
  },

  name: {
    margin: 0,
    color: "#111827",
  },

  text: {
    color: "#6b7280",
  },

  status: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  editBtn: {
    marginLeft: "auto",
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  smallCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  section: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "15px",
  },

  item: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  empty: {
    color: "#6b7280",
  },
};