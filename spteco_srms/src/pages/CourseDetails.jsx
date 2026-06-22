import Layout from "../components/Layout";

export default function CourseDetails() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>Course Details</h1>

          <p><strong>Course Code:</strong> EE-N6</p>
          <p><strong>Course Name:</strong> Electrical Engineering</p>
          <p><strong>Faculty:</strong> Engineering</p>
          <p><strong>Department:</strong> Electrical</p>
          <p><strong>Level:</strong> N6</p>
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
