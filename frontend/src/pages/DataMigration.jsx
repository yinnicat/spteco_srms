import Layout from "../components/Layout";
import { FaDatabase, FaUpload, FaFileExcel } from "react-icons/fa";

export default function DataMigration() {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Data Migration</h1>
            <p style={{ color: "#6b7280", margin: "6px 0 0 0" }}>
              Import 2026 student intake data into SRMS
            </p>
          </div>
          <FaDatabase style={{ fontSize: "40px", color: "#1e3a8a" }} />
        </div>

        <div style={styles.card}>
          <div style={styles.iconRow}>
            <FaFileExcel style={{ fontSize: "48px", color: "#16a34a" }} />
            <div>
              <h2>CSV / Excel Import</h2>
              <p style={styles.desc}>
                The data migration tool will allow importing the 2026 student intake
                from Microsoft Access or Excel exports. This feature is currently
                being developed and will be available before final handover.
              </p>
            </div>
          </div>

          <div style={styles.notice}>
            <strong>Migration scope:</strong> 2026 student intake only. Historical records
            from prior years will not be migrated. Missing fields can be completed
            manually by staff after import.
          </div>

          <div style={styles.steps}>
            <h3>Planned Migration Steps</h3>
            <ol style={styles.list}>
              <li>Export student data from Microsoft Access to CSV</li>
              <li>Upload CSV file through this interface</li>
              <li>Preview data and resolve any validation errors</li>
              <li>Confirm and import records into the database</li>
              <li>Review import summary — successful, failed, and duplicate records</li>
            </ol>
          </div>

          <div style={styles.comingSoon}>
            <FaUpload style={{ fontSize: "24px", color: "#6b7280" }} />
            <p>Migration tool coming soon</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: "20px", background: "#f5f6fa", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  iconRow: { display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "24px" },
  desc: { color: "#6b7280", fontSize: "15px", margin: 0 },
  notice: { background: "#f0f9ff", borderLeft: "4px solid #0ea5e9", padding: "14px", borderRadius: "8px", fontSize: "14px", color: "#0369a1", marginBottom: "24px" },
  steps: { marginBottom: "24px" },
  list: { color: "#374151", fontSize: "14px", lineHeight: "2" },
  comingSoon: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "30px", background: "#f8fafc", borderRadius: "12px", border: "2px dashed #d1d5db", color: "#6b7280" },
};