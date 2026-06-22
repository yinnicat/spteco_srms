import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaUserPlus,
  FaSearch,
} from "react-icons/fa";

export default function Staff() {
  const defaultStaff = [
    {
      id: "EMP001",
      name: "John Smith",
      department: "Engineering",
      position: "Lecturer",
      status: "Active",
    },
    {
      id: "EMP002",
      name: "Mary Jones",
      department: "Business",
      position: "HOD",
      status: "Active",
    },
  ];

  const [staff, setStaff] = useState([]);

  const [search, setSearch] = useState("");

  const [newStaff, setNewStaff] = useState({
    id: "",
    name: "",
    department: "",
    position: "",
  });

  useEffect(() => {
    const savedStaff =
      JSON.parse(localStorage.getItem("staff")) ||
      defaultStaff;

    setStaff(savedStaff);
  }, []);

  const addStaff = () => {
    if (
      !newStaff.id ||
      !newStaff.name ||
      !newStaff.department ||
      !newStaff.position
    ) {
      alert("Please fill all fields");
      return;
    }

    const updatedStaff = [
      ...staff,
      {
        ...newStaff,
        status: "Active",
      },
    ];

    setStaff(updatedStaff);

    localStorage.setItem(
      "staff",
      JSON.stringify(updatedStaff)
    );

    setNewStaff({
      id: "",
      name: "",
      department: "",
      position: "",
    });
  };

  const filteredStaff = staff.filter((member) =>
    member.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Staff Management</h1>

            <p>
              Manage lecturers and staff members
            </p>
          </div>

          <div style={styles.headerIcon}>
            <FaChalkboardTeacher />
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>Total Staff</h3>

            <h1>{staff.length}</h1>
          </div>

          <div style={styles.statCard}>
            <h3>Departments</h3>

            <h1>6</h1>
          </div>

          <div style={styles.statCard}>
            <h3>Active Staff</h3>

            <h1>
              {
                staff.filter(
                  (s) =>
                    s.status === "Active"
                ).length
              }
            </h1>
          </div>
        </div>

        <div style={styles.addCard}>
          <h2>Add Staff</h2>

          <div style={styles.form}>
            <input
              placeholder="Staff ID"
              value={newStaff.id}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  id: e.target.value,
                })
              }
            />

            <input
              placeholder="Full Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Department"
              value={newStaff.department}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  department:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Position"
              value={newStaff.position}
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  position:
                    e.target.value,
                })
              }
            />

            <button
              style={styles.addBtn}
              onClick={addStaff}
            >
              <FaUserPlus />

              Add Staff
            </button>
          </div>
        </div>

        <div style={styles.searchBox}>
          <FaSearch />

          <input
            placeholder="Search Staff"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Staff ID</th>

                <th>Name</th>

                <th>Department</th>

                <th>Position</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map(
                (member) => (
                  <tr
                    key={member.id}
                  >
                    <td>
                      {member.id}
                    </td>

                    <td>
                      {member.name}
                    </td>

                    <td>
                      {
                        member.department
                      }
                    </td>

                    <td>
                      {
                        member.position
                      }
                    </td>

                    <td>
                      <span
                        style={
                          styles.badge
                        }
                      >
                        {
                          member.status
                        }
                      </span>
                    </td>
                  </tr>
                )
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

    alignItems: "center",

    marginBottom: "20px",
  },

  headerIcon: {
    fontSize: "50px",

    color: "#2563eb",
  },

  stats: {
    display: "grid",

    gridTemplateColumns:
      "repeat(3,1fr)",

    gap: "20px",

    marginBottom: "20px",
  },

  statCard: {
    background: "#fff",

    padding: "20px",

    borderRadius: "10px",
  },

  addCard: {
    background: "#fff",

    padding: "20px",

    borderRadius: "10px",

    marginBottom: "20px",
  },

  form: {
    display: "grid",

    gridTemplateColumns:
      "repeat(5,1fr)",

    gap: "15px",
  },

  addBtn: {
    background: "#2563eb",

    color: "#fff",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",
  },

  searchBox: {
    background: "#fff",

    display: "flex",

    gap: "10px",

    alignItems: "center",

    padding: "15px",

    borderRadius: "10px",

    marginBottom: "20px",
  },

  tableCard: {
    background: "#fff",

    borderRadius: "10px",

    padding: "20px",
  },

  table: {
    width: "100%",

    borderCollapse: "collapse",
  },

  badge: {
    background: "#dcfce7",

    color: "#166534",

    padding: "6px 12px",

    borderRadius: "20px",
  },
};