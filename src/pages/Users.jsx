import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
} from "react-icons/fa";

export default function Users() {
  const defaultUsers = [
    {
      id: "USR001",
      fullname: "Database Administrator",
      username: "dbadmin",
      role: "Database Admin",
      status: "Active",
      lastLogin: "Today",
    },

    {
      id: "USR002",
      fullname: "Registry Officer",
      username: "registry",
      role: "Admin Staff",
      status: "Active",
      lastLogin: "Yesterday",
    },

    {
      id: "USR003",
      fullname: "Lecturer User",
      username: "lecturer",
      role: "Lecturer",
      status: "Active",
      lastLogin: "2 days ago",
    },
  ];

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [newUser, setNewUser] =
    useState({
      fullname: "",
      username: "",
      role: "",
    });

  useEffect(() => {
    const savedUsers =
      JSON.parse(
        localStorage.getItem(
          "systemUsers"
        )
      ) || defaultUsers;

    setUsers(savedUsers);
  }, []);

  const addUser = () => {
    if (
      !newUser.fullname ||
      !newUser.username ||
      !newUser.role
    ) {
      alert(
        "Please fill all fields"
      );

      return;
    }

    const usernameExists =
      users.some(
        (user) =>
          user.username ===
          newUser.username
      );

    if (usernameExists) {
      alert(
        "Username already exists"
      );

      return;
    }

    const user = {
      id:
        "USR" +
        Date.now(),

      fullname:
        newUser.fullname,

      username:
        newUser.username,

      role: newUser.role,

      status: "Active",

      lastLogin: "Never",
    };

    const updatedUsers = [
      ...users,
      user,
    ];

    setUsers(updatedUsers);

    localStorage.setItem(
      "systemUsers",
      JSON.stringify(
        updatedUsers
      )
    );

    setNewUser({
      fullname: "",
      username: "",
      role: "",
    });
  };

  const toggleStatus = (
    id
  ) => {
    const updatedUsers =
      users.map((user) =>
        user.id === id
          ? {
              ...user,

              status:
                user.status ===
                "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      );

    setUsers(updatedUsers);

    localStorage.setItem(
      "systemUsers",

      JSON.stringify(
        updatedUsers
      )
    );
  };

  const filteredUsers =
    users.filter(
      (user) =>
        user.fullname
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        user.role
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

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
              User Management
            </h1>

            <p>
              Manage system
              users and
              permissions
            </p>
          </div>

          <div
            style={
              styles.headerIcon
            }
          >
            <FaUsers />
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
              Total Users
            </h3>

            <h1>
              {users.length}
            </h1>
          </div>

          <div
            style={
              styles.statCard
            }
          >
            <h3>
              Active Users
            </h3>

            <h1>
              {
                users.filter(
                  (
                    user
                  ) =>
                    user.status ===
                    "Active"
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
              Roles
            </h3>

            <h1>3</h1>
          </div>
        </div>

        <div
          style={styles.formCard}
        >
          <h2>
            Create User
          </h2>

          <div
            style={styles.form}
          >
            <input
              placeholder="Full Name"
              value={
                newUser.fullname
              }
              onChange={(e) =>
                setNewUser({
                  ...newUser,

                  fullname:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Username"
              value={
                newUser.username
              }
              onChange={(e) =>
                setNewUser({
                  ...newUser,

                  username:
                    e.target.value,
                })
              }
            />

            <select
              value={
                newUser.role
              }
              onChange={(e) =>
                setNewUser({
                  ...newUser,

                  role:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select Role
              </option>

              <option>
                Database Admin
              </option>

              <option>
                Admin Staff
              </option>

              <option>
                Lecturer
              </option>
            </select>

            <button
              style={
                styles.addBtn
              }
              onClick={
                addUser
              }
            >
              <FaUserPlus />

              Create User
            </button>
          </div>
        </div>

        <div
          style={
            styles.searchBox
          }
        >
          <FaSearch />

          <input
            placeholder="Search users"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div
          style={styles.tableCard}
        >
          <table
            style={styles.table}
          >
            <thead>
              <tr>
                <th>Name</th>

                <th>
                  Username
                </th>

                <th>Role</th>

                <th>
                  Last Login
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (user) => (
                  <tr
                    key={
                      user.id
                    }
                  >
                    <td>
                      {
                        user.fullname
                      }
                    </td>

                    <td>
                      {
                        user.username
                      }
                    </td>

                    <td>
                      {
                        user.role
                      }
                    </td>

                    <td>
                      {
                        user.lastLogin
                      }
                    </td>

                    <td>
                      <span
                        style={
                          user.status ===
                          "Active"
                            ? styles.active
                            : styles.inactive
                        }
                      >
                        {
                          user.status
                        }
                      </span>
                    </td>

                    <td>
                      <button
                        style={
                          styles.toggleBtn
                        }
                        onClick={() =>
                          toggleStatus(
                            user.id
                          )
                        }
                      >
                        {user.status ===
                        "Active"
                          ? "Deactivate"
                          : "Activate"}
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

    alignItems:
      "center",

    marginBottom:
      "20px",
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

    marginBottom:
      "20px",
  },

  statCard: {
    background: "#fff",

    padding: "20px",

    borderRadius:
      "10px",
  },

  formCard: {
    background: "#fff",

    padding: "20px",

    borderRadius:
      "10px",

    marginBottom:
      "20px",
  },

  form: {
    display: "grid",

    gridTemplateColumns:
      "repeat(4,1fr)",

    gap: "15px",
  },

  addBtn: {
    background:
      "#2563eb",

    color: "#fff",

    border: "none",

    borderRadius:
      "8px",

    cursor: "pointer",
  },

  searchBox: {
    background: "#fff",

    display: "flex",

    gap: "10px",

    alignItems:
      "center",

    padding: "15px",

    borderRadius:
      "10px",

    marginBottom:
      "20px",
  },

  tableCard: {
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

  active: {
    background:
      "#dcfce7",

    color: "#166534",

    padding:
      "6px 12px",

    borderRadius:
      "20px",
  },

  inactive: {
    background:
      "#fee2e2",

    color: "#991b1b",

    padding:
      "6px 12px",

    borderRadius:
      "20px",
  },

  toggleBtn: {
    background:
      "#111827",

    color: "#fff",

    border: "none",

    padding:
      "8px 12px",

    borderRadius:
      "6px",

    cursor: "pointer",
  },
};