import Layout from "../components/Layout";
import { useParams } from "react-router-dom";

export default function StaffProfile() {

  const { staffId } = useParams();

  const staffList =
    JSON.parse(
      localStorage.getItem("staff")
    ) || [];

  const staff = staffList.find(
    (item) =>
      item.staffId === staffId
  );

  if (!staff) {

    return (

      <Layout>

        <div style={styles.container}>

          <div style={styles.card}>

            <h1>Staff Profile</h1>

            <p style={styles.empty}>

              Staff record not found.

              It may not exist yet

              or will be loaded

              from the backend later.

            </p>

          </div>

        </div>

      </Layout>

    );
  }

  const fullName =
    staff.name ||

    `${staff.firstName || ""}
     ${staff.lastName || ""}`;

  const initials =
    `${staff.firstName?.[0] || ""}
     ${staff.lastName?.[0] || ""}`;

  return (

    <Layout>

      <div style={styles.container}>

        <div style={styles.header}>

          <div>

            <h1>Staff Profile</h1>

            <p>
              Detailed staff information
            </p>

          </div>

          <div style={styles.status}>

            {staff.status}

          </div>

        </div>

        <div style={styles.card}>

          <div style={styles.avatar}>

            {initials || "ST"}

          </div>

          <h2>{fullName}</h2>

          <p>{staff.position}</p>

          <div style={styles.grid}>

            <div style={styles.item}>

              <strong>
                Staff ID
              </strong>

              <span>
                {staff.staffId}
              </span>

            </div>

            <div style={styles.item}>

              <strong>
                Department
              </strong>

              <span>
                {staff.department}
              </span>

            </div>

            <div style={styles.item}>

              <strong>
                Email
              </strong>

              <span>
                {staff.email}
              </span>

            </div>

            <div style={styles.item}>

              <strong>
                Phone
              </strong>

              <span>
                {staff.phone}
              </span>

            </div>

            <div style={styles.item}>

              <strong>
                Gender
              </strong>

              <span>
                {staff.gender}
              </span>

            </div>

            <div style={styles.item}>

              <strong>
                Employment Date
              </strong>

              <span>

                {staff.employmentDate ||

                  "Not Set"}

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
    padding: "20px",
  },

  header: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "20px",

  },

  status: {

    background: "#dcfce7",

    color: "#166534",

    padding: "8px 18px",

    borderRadius: "20px",

    fontWeight: "600",

  },

  card: {

    background: "#fff",

    padding: "30px",

    borderRadius: "12px",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",

  },

  avatar: {

    width: "80px",

    height: "80px",

    borderRadius: "50%",

    background: "#1e3a8a",

    color: "#fff",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "28px",

    fontWeight: "700",

    marginBottom: "20px",

  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(2,1fr)",

    gap: "20px",

    marginTop: "30px",

  },

  item: {

    display: "flex",

    flexDirection: "column",

    gap: "6px",

    background: "#f8fafc",

    padding: "16px",

    borderRadius: "10px",

  },

  empty: {

    color: "#6b7280",

  },

};