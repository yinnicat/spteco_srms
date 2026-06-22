import Layout from "../components/Layout";

export default function StaffProfile() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>Staff Profile</h1>

          <div style={styles.grid}>
            <p><strong>Staff ID:</strong> EMP001</p>
            <p><strong>Name:</strong> John Smith</p>
            <p><strong>Department:</strong> Engineering</p>
            <p><strong>Position:</strong> Lecturer</p>
            <p><strong>Email:</strong> john@spteco.ac.bw</p>
            <p><strong>Phone:</strong> 71234567</p>
            <p><strong>Status:</strong> Active</p>
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

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "15px",
  },
};