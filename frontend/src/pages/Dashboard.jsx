import Layout from "../components/Layout";

export default function Dashboard() {
  const stats = [
    { title: "Total Students", value: "1,248" },
    { title: "Total Staff", value: "128" },
    { title: "Courses", value: "86" },
    { title: "Active Enrolments", value: "1,024" },
    { title: "Certificates Issued", value: "784" },
    { title: "Uncollected Certificates", value: "45" },
    { title: "SEN Students", value: "112" },
    { title: "OVC Students", value: "67" },
  ];

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Dashboard</h1>

        {/* Statistics Cards */}
        <div style={styles.cardsGrid}>
          {stats.map((item, index) => (
            <div key={index} style={styles.card}>
              <p style={styles.cardTitle}>{item.title}</p>
              <h2 style={styles.cardValue}>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Recent Enrolments */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2>Recent Enrolments</h2>
            <span style={styles.viewAll}>View all</span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrolment Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  STU0034/1256
                  <br />
                  Kabelo Mokoena
                </td>
                <td>Electrical Engineering N6</td>
                <td>12 May 2026</td>
                <td>Active</td>
              </tr>

              <tr>
                <td>
                  STU0034/1257
                  <br />
                  Thato Dlamini
                </td>
                <td>Civil Engineering N6</td>
                <td>12 May 2026</td>
                <td>Active</td>
              </tr>

              <tr>
                <td>
                  STU0034/1258
                  <br />
                  Boitumelo Rapopeba
                </td>
                <td>Business Management N4</td>
                <td>11 May 2026</td>
                <td>Active</td>
              </tr>
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
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  heading: {
    marginBottom: "20px",
    color: "#111827",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  cardTitle: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "32px",
    margin: 0,
    color: "#111827",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  viewAll: {
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
