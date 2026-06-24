import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Users() {

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    const savedUsers =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    setUsers(savedUsers);

  }, []);

  const deleteUser = (username) => {

    const confirmDelete =
      window.confirm(
        "Delete this user?"
      );

    if (!confirmDelete) return;

    const updatedUsers =
      users.filter(
        (user) =>
          user.username !== username
      );

    localStorage.setItem(

      "users",

      JSON.stringify(updatedUsers)

    );

    setUsers(updatedUsers);

  };

  const filteredUsers =
    users.filter((user) => {

      return (

        (user.fullname || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        (user.username || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        (user.email || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        (user.role || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    });

  return (

    <Layout>

      <div style={styles.container}>

        <div style={styles.header}>

          <div>

            <h1>
              User Management
            </h1>

            <p>
              Manage system users
              and role access
            </p>

          </div>

          <Link to="/signup">

            <button
              style={styles.addBtn}
            >

              + Add User

            </button>

          </Link>

        </div>

        <div style={styles.searchSection}>

          <input

            type="text"

            placeholder="Search user..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            style={styles.searchInput}

          />

        </div>

        <div style={styles.tableCard}>

          <table style={styles.table}>

            <thead>

              <tr>

                <th>Full Name</th>

                <th>Username</th>

                <th>Email</th>

                <th>Role</th>

                <th>Status</th>

                <th>Delete</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length ===
                0 && (

                <tr>

                  <td
                    colSpan="6"
                    style={styles.empty}
                  >

                    User records will
                    appear here once
                    connected to the
                    backend.

                  </td>

                </tr>

              )}

              {filteredUsers.map(
                (user) => (

                  <tr
                    key={user.username}
                  >

                    <td>
                      {user.fullname}
                    </td>

                    <td>
                      {user.username}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.role}
                    </td>

                    <td>

                      <span
                        style={
                          styles.active
                        }
                      >

                        {user.status ||
                          "Active"}

                      </span>

                    </td>

                    <td>

                      <button

                        style={
                          styles.deleteBtn
                        }

                        onClick={() =>
                          deleteUser(
                            user.username
                          )
                        }

                      >

                        Delete

                      </button>

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

  addBtn: {

    background: "#1e3a8a",

    color: "#fff",

    border: "none",

    padding: "10px 16px",

    borderRadius: "8px",

    cursor: "pointer",

  },

  searchSection: {

    marginBottom: "20px",

  },

  searchInput: {

    width: "100%",

    padding: "12px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    outline: "none",

  },

  tableCard: {

    background: "#fff",

    borderRadius: "12px",

    padding: "20px",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",

    overflowX: "auto",

  },

  table: {

    width: "100%",

    borderCollapse:
      "collapse",

  },

  active: {

    background: "#dcfce7",

    color: "#166534",

    padding: "6px 12px",

    borderRadius: "20px",

    fontWeight: "600",

  },

  deleteBtn: {

    background: "#dc2626",

    color: "#fff",

    border: "none",

    padding: "8px 14px",

    borderRadius: "6px",

    cursor: "pointer",

  },

  empty: {

    textAlign: "center",

    padding: "25px",

    color: "#6b7280",

  },

};