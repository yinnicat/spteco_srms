import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import logo from "../assets/SPTECO logo.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Later this will save to database
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <img src={logo} alt="SPTECO Logo" style={styles.logo} />

        <h1 style={styles.title}>SPTECO</h1>

        <h2 style={styles.subtitle}>
          Student Records Management System
        </h2>

        <p style={styles.college}>
          Selebi-Phikwe Technical College
        </p>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2>Create Account</h2>
          <p>Fill in the details to create your account</p>

          <form onSubmit={handleSignup}>
            <div style={styles.inputGroup}>
              <FaUser />
              <input
                type="text"
                placeholder="Full Name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaUser />
              <input
                type="text"
                placeholder="Username"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaEnvelope />
              <input
                type="email"
                placeholder="Email Address"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                required
              />
              <FaEye />
            </div>

            <div style={styles.inputGroup}>
              <FaLock />
              <input
                type="password"
                placeholder="Confirm Password"
                style={styles.input}
                required
              />
              <FaEye />
            </div>

            <select style={styles.select}>
              <option>Select Role</option>
              <option>Administrator</option>
              <option>DB Administrator</option>
              <option>Lecturer</option>
            </select>

            <div style={styles.checkbox}>
              <input type="checkbox" required />
              <span>I agree to the terms and conditions</span>
            </div>

            <button type="submit" style={styles.signupBtn}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: "20px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  leftPanel: {
    flex: 1,
    background: "#1e3a8a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  logo: {
    width: "140px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    maxWidth: "350px",
  },

  college: {
    marginTop: "15px",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },

  formCard: {
    width: "500px",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },

  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "15px",
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "15px",
  },

  checkbox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  signupBtn: {
    width: "100%",
    padding: "14px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};