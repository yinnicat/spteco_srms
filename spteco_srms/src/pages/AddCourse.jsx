import Layout from "../components/Layout";

export default function AddCourse() {
  return (
    <Layout>
      <div style={styles.container}>
        <h1>Add Course</h1>

        <div style={styles.form}>
          <input placeholder="Course Code" />
          <input placeholder="Course Name" />
          <input placeholder="Faculty" />
          <input placeholder="Department" />

          <select>
            <option>Level</option>
            <option>N4</option>
            <option>N5</option>
            <option>N6</option>
          </select>

          <select>
            <option>Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <button style={styles.saveBtn}>
          Save Course
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