import Layout from "../components/Layout";

export default function EnrolmentDetails() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>Enrolment Details</h1>

          <p><strong>Student Number:</strong> STU001</p>
          <p><strong>Student Name:</strong> Kabelo Mokoena</p>
          <p><strong>Programme:</strong> Electrical Engineering</p>
          <p><strong>Level:</strong> N6</p>
          <p><strong>Enrolment Date:</strong> 15/01/2026</p>
          <p><strong>Status:</strong> Active</p>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },
};