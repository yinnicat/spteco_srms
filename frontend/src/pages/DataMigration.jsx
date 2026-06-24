import Layout from "../components/Layout";
import { useState } from "react";
import {
  FaDatabase,
  FaUpload,
  FaFileExcel,
} from "react-icons/fa";

export default function DataMigration() {
  const [selectedFile, setSelectedFile] = useState(null);

  const chooseFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const previewData = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    alert(
      "File preview will be connected to the backend."
    );
  };

  const importData = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    alert(
      "Import functionality will be connected to the backend."
    );
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Data Migration</h1>

            <p>
              Import existing institutional data into SRMS
            </p>
          </div>

          <FaDatabase style={styles.icon} />
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <h3>Select Data File</h3>

            <p>
              Supported formats:
              CSV and Excel (.xlsx)
            </p>

            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={chooseFile}
              style={styles.fileInput}
            />

            {selectedFile && (
              <p style={styles.filename}>
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div style={styles.instructions}>
            <h3>Migration Rules</h3>

            <ul>
              <li>Student numbers must be unique</li>

              <li>Departments must already exist</li>

              <li>Dates must be valid</li>

              <li>Remove duplicate records</li>

              <li>Ensure data is clean before import</li>
            </ul>
          </div>

          <div style={styles.buttons}>
            <button
              style={styles.previewBtn}
              onClick={previewData}
            >
              <FaFileExcel />

              Preview Data
            </button>

            <button
              style={styles.importBtn}
              onClick={importData}
            >
              <FaUpload />

              Import Records
            </button>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <h3>Migration Status</h3>

          <p>
            Backend integration will display:
          </p>

          <ul>
            <li>Total imported records</li>

            <li>Failed records</li>

            <li>Duplicate records</li>

            <li>Migration history</li>
          </ul>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  icon: {
    fontSize: "50px",
    color: "#1e3a8a",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },

  section: {
    marginBottom: "25px",
  },

  fileInput: {
    marginTop: "15px",
  },

  filename: {
    marginTop: "10px",
    color: "#1e3a8a",
    fontWeight: "600",
  },

  instructions: {
    marginBottom: "25px",
  },

  buttons: {
    display: "flex",
    gap: "15px",
  },

  previewBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",

    background: "#111827",

    color: "#fff",

    border: "none",

    padding: "12px 20px",

    borderRadius: "8px",

    cursor: "pointer",
  },

  importBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",

    background: "#1e3a8a",

    color: "#fff",

    border: "none",

    padding: "12px 20px",

    borderRadius: "8px",

    cursor: "pointer",
  },

  summaryCard: {
    background: "#fff",

    padding: "25px",

    borderRadius: "12px",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  },
};