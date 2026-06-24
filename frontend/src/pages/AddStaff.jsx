import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStaff() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employmentDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setStaff({
      ...staff,
      [e.target.name]: e.target.value,
    });
  };

  const saveStaff = (e) => {
    e.preventDefault();

    const existingStaff =
      JSON.parse(localStorage.getItem("staff")) || [];

    const staffExists = existingStaff.some(
      (item) =>
        item.staffId.toLowerCase() === staff.staffId.toLowerCase()
    );

    if (staffExists) {
      alert("Staff number already exists");
      return;
    }

    const newStaff = {
      ...staff,
      name: `${staff.firstName} ${staff.lastName}`,
    };

    localStorage.setItem(
      "staff",
      JSON.stringify([...existingStaff, newStaff])
    );

    alert("Staff saved successfully");
    navigate("/staff");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Add Staff</h1>
          <p>Register a new staff member into the SRMS</p>
        </div>

        <form onSubmit={saveStaff} style={styles.card}>
          <div style={styles.form}>
            <div style={styles.group}>
              <label>Staff Number</label>
              <input
                type="text"
                name="staffId"
                value={staff.staffId}
                onChange={handleChange}
                placeholder="EMP001"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={staff.firstName}
                onChange={handleChange}
                placeholder="First Name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={staff.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Gender</label>
              <select
                name="gender"
                value={staff.gender}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div style={styles.group}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={staff.dob}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.group}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={staff.email}
                onChange={handleChange}
                placeholder="staff@spteco.ac.bw"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={staff.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={staff.department}
                onChange={handleChange}
                placeholder="Department"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={staff.position}
                onChange={handleChange}
                placeholder="Lecturer, HOD, Admin Officer"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label>Employment Date</label>
              <input
                type="date"
                name="employmentDate"
                value={staff.employmentDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.group}>
              <label>Status</label>
              <select
                name="status"
                value={staff.status}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.saveBtn}>
              Save Staff
            </button>

            <button
              type="button"
              onClick={() => navigate("/staff")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
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
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "20px",
  },

  group: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
  },

  buttonContainer: {
    marginTop: "30px",
    display: "flex",
    gap: "12px",
  },

  saveBtn: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "14px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  cancelBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "14px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
};