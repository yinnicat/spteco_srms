import Layout from "../components/Layout";

export default function StudentProfile() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.header}>
            <div style={styles.photo}>
              Student Photo
            </div>

            <div>
              <h2>Kabelo Mokoena</h2>
              <p>Student No: STU001</p>
              <p>Status: Active</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div style={styles.section}>
          <h3>Personal Details</h3>

          <div style={styles.grid}>
            <p><strong>Gender:</strong> Male</p>
            <p><strong>Date of Birth:</strong> 12/05/2003</p>
            <p><strong>OMANG:</strong> 123456789</p>
            <p><strong>Nationality:</strong> Botswana</p>
          </div>
        </div>

        {/* Contact Details */}
        <div style={styles.section}>
          <h3>Contact Information</h3>

          <div style={styles.grid}>
            <p><strong>Email:</strong> kabelo@gmail.com</p>
            <p><strong>Phone:</strong> 71234567</p>
            <p><strong>Address:</strong> Selebi Phikwe</p>
          </div>
        </div>

        {/* Academic Details */}
        <div style={styles.section}>
          <h3>Academic Details</h3>

          <div style={styles.grid}>
            <p><strong>Faculty:</strong> Engineering</p>
            <p><strong>Programme:</strong> Electrical Engineering</p>
            <p><strong>Level:</strong> N6</p>
            <p><strong>Admission Date:</strong> 15/01/2026</p>
          </div>
        </div>

        {/* Next of Kin */}
        <div style={styles.section}>
          <h3>Next of Kin</h3>

          <div style={styles.grid}>
            <p><strong>Name:</strong> Mpho Mokoena</p>
            <p><strong>Relationship:</strong> Parent</p>
            <p><strong>Phone:</strong> 72123456</p>
          </div>
        </div>

        {/* Additional Info */}
        <div style={styles.section}>
          <h3>Additional Information</h3>

          <div style={styles.grid}>
            <p><strong>SEN:</strong> No</p>
            <p><strong>OVC:</strong> No</p>
          </div>
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

  profileCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  header: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  photo: {
    width: "120px",
    height: "120px",
    background: "#e5e7eb",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "10px",
  },
};