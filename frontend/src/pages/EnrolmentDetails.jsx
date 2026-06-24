import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import {
  FaClipboardList,
  FaUserGraduate,
  FaBook,
} from "react-icons/fa";

export default function EnrolmentDetails() {
  const { enrolmentId } = useParams();

  const enrolments =
    JSON.parse(
      localStorage.getItem("enrolments")
    ) || [];

  const enrolment = enrolments.find(
    (item) =>
      item.enrolmentId === enrolmentId
  );

  if (!enrolment) {
    return (
      <Layout>
        <div style={styles.container}>
          <div style={styles.card}>
            <h1>Enrolment Details</h1>

            <p style={styles.empty}>
              Enrolment record not found.
              It may not exist yet or
              will be loaded from the
              backend later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Enrolment Details</h1>

            <p>
              View complete student
              enrolment information
            </p>
          </div>

          <FaClipboardList
            style={styles.icon}
          />
        </div>

        <div style={styles.card}>
          <div style={styles.grid}>

            <div style={styles.item}>
              <label>
                Student Number
              </label>

              <h3>
                <FaUserGraduate />{" "}
                {enrolment.studentNo}
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Student Name
              </label>

              <h3>
                {
                  enrolment.studentName
                }
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Course Code
              </label>

              <h3>
                {
                  enrolment.courseCode
                }
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Programme
              </label>

              <h3>
                <FaBook />{" "}
                {
                  enrolment.programme
                }
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Faculty
              </label>

              <h3>
                {
                  enrolment.faculty
                }
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Level
              </label>

              <h3>
                {
                  enrolment.level
                }
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Enrolment Date
              </label>

              <h3>
                {
                  enrolment.enrolmentDate
                }
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Completion Date
              </label>

              <h3>
                {enrolment.completionDate ||
                  "Not Set"}
              </h3>
            </div>

            <div style={styles.item}>
              <label>
                Status
              </label>

              <span
                style={
                  enrolment.status ===
                  "Active"

                    ? styles.activeBadge

                    : styles.warningBadge
                }
              >
                {enrolment.status}
              </span>
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

  header: {
    display: "flex",
    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "25px",
  },

  icon: {
    fontSize: "50px",

    color: "#1e3a8a",
  },

  card: {
    background: "#fff",

    padding: "30px",

    borderRadius: "12px",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2,1fr)",

    gap: "25px",
  },

  item: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  activeBadge: {
    width: "fit-content",

    background: "#dcfce7",

    color: "#166534",

    padding: "8px 16px",

    borderRadius: "20px",

    fontWeight: "600",
  },

  warningBadge: {
    width: "fit-content",

    background: "#ffedd5",

    color: "#9a3412",

    padding: "8px 16px",

    borderRadius: "20px",

    fontWeight: "600",
  },

  empty: {
    color: "#6b7280",
  },
};