import Layout from "../components/Layout";

export default function AddEnrolment() {
  return (
    <Layout>
      <div style={styles.container}>
        <h1>New Enrolment</h1>

        <div style={styles.form}>
          <input placeholder="Student Number" />
          <input placeholder="Student Name" />

          <select>
            <option>Select Programme</option>
            <option>Electrical Engineering</option>
            <option>Civil Engineering</option>
            <option>Business Management</option>
          </select>

          <select>
            <option>Select Level</option>
            <option>N4</option>
            <option>N5</option>
            <option>N6</option>
          </select>

          <input type="date" />

          <select>
            <option>Status</option>
            <option>Active</option>
            <option>Deferred</option>
            <option>Completed</option>
          </select>
        </div>

        <button style={styles.saveBtn}>
          Save Enrolment
        </button>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "15px",
    marginBottom: "20px",
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
  },
};