import Layout from "../components/Layout";

import { useState } from "react";

import {
  FaDatabase,
  FaUpload,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";

export default function DataMigration() {
  const [fileName, setFileName] =
    useState("");

  const [migrationHistory, setMigrationHistory] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "migrationHistory"
        )
      ) || []
    );

  const handleFileSelect = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (file) {
      setFileName(
        file.name
      );
    }
  };

  const importData = () => {
    if (!fileName) {
      alert(
        "Please select a CSV file"
      );

      return;
    }

    const migration = {
      id:
        "MIG" +
        Date.now(),

      file: fileName,

      date:
        new Date().toLocaleString(),

      records:
        Math.floor(
          Math.random() * 100
        ) + 1,

      status:
        "Successful",
    };

    const updatedHistory = [
      migration,

      ...migrationHistory,
    ];

    setMigrationHistory(
      updatedHistory
    );

    localStorage.setItem(
      "migrationHistory",

      JSON.stringify(
        updatedHistory
      )
    );

    alert(
      "Migration Completed Successfully"
    );

    setFileName("");
  };

  const exportData = () => {
    alert(
      "Data Export Ready"
    );
  };

  return (
    <Layout>
      <div
        style={styles.container}
      >
        <div
          style={styles.header}
        >
          <div>
            <h1>
              Data Migration
            </h1>

            <p>
              Import and
              migrate old
              institutional
              records
            </p>
          </div>

          <div
            style={
              styles.icon
            }
          >
            <FaDatabase />
          </div>
        </div>

        <div
          style={styles.stats}
        >
          <div
            style={
              styles.statCard
            }
          >
            <h3>
              Total Migrations
            </h3>

            <h1>
              {
                migrationHistory.length
              }
            </h1>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <h3>
              Successful
            </h3>

            <h1>
              {
                migrationHistory.filter(
                  (
                    migration
                  ) =>
                    migration.status ===
                    "Successful"
                ).length
              }
            </h1>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <h3>
              Data Source
            </h3>

            <h1>CSV</h1>
          </div>
        </div>

        <div
          style={styles.card}
        >
          <h2>
            Import Data
          </h2>

          <input
            type="file"
            accept=".csv"
            onChange={
              handleFileSelect
            }
          />

          {fileName && (
            <p>
              Selected:
              {" "}
              {fileName}
            </p>
          )}

          <div
            style={
              styles.buttonArea
            }
          >
            <button
              style={
                styles.importBtn
              }
              onClick={
                importData
              }
            >
              <FaUpload />

              Import CSV
            </button>

            <button
              style={
                styles.exportBtn
              }
              onClick={
                exportData
              }
            >
              <FaDownload />

              Export Data
            </button>
          </div>
        </div>

        <div
          style={
            styles.historyCard
          }
        >
          <h2>
            Migration History
          </h2>

          <table
            style={
              styles.table
            }
          >
            <thead>
              <tr>
                <th>
                  File
                </th>

                <th>
                  Date
                </th>

                <th>
                  Records
                </th>

                <th>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {migrationHistory.map(
                (
                  migration
                ) => (
                  <tr
                    key={
                      migration.id
                    }
                  >
                    <td>
                      {
                        migration.file
                      }
                    </td>

                    <td>
                      {
                        migration.date
                      }
                    </td>

                    <td>
                      {
                        migration.records
                      }
                    </td>

                    <td>
                      <span
                        style={
                          styles.success
                        }
                      >
                        <FaCheckCircle />

                        {" "}

                        {
                          migration.status
                        }
                      </span>
                    </td>
                  </tr>
                )
              )}

              {migrationHistory.length ===
                0 && (
                <tr>
                  <td
                    colSpan="4"
                    style={
                      styles.empty
                    }
                  >
                    No
                    migrations
                    performed
                  </td>
                </tr>
              )}
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
  },

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    marginBottom:
      "20px",
  },

  icon: {
    fontSize: "50px",

    color: "#2563eb",
  },

  stats: {
    display: "grid",

    gridTemplateColumns:
      "repeat(3,1fr)",

    gap: "20px",

    marginBottom:
      "20px",
  },

  statCard: {
    background: "#fff",

    padding: "20px",

    borderRadius:
      "10px",
  },

  card: {
    background: "#fff",

    padding: "20px",

    borderRadius:
      "10px",

    marginBottom:
      "20px",
  },

  buttonArea: {
    display: "flex",

    gap: "15px",

    marginTop: "20px",
  },

  importBtn: {
    background:
      "#2563eb",

    color: "#fff",

    border: "none",

    padding:
      "12px 20px",

    borderRadius:
      "8px",

    cursor: "pointer",

    display: "flex",

    gap: "10px",

    alignItems:
      "center",
  },

  exportBtn: {
    background:
      "#16a34a",

    color: "#fff",

    border: "none",

    padding:
      "12px 20px",

    borderRadius:
      "8px",

    cursor: "pointer",

    display: "flex",

    gap: "10px",

    alignItems:
      "center",
  },

  historyCard: {
    background: "#fff",

    padding: "20px",

    borderRadius:
      "10px",
  },

  table: {
    width: "100%",

    borderCollapse:
      "collapse",
  },

  success: {
    background:
      "#dcfce7",

    color: "#166534",

    padding:
      "6px 12px",

    borderRadius:
      "20px",
  },

  empty: {
    textAlign: "center",

    padding: "20px",
  },
};