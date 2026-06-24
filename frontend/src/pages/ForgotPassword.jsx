import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Forgot Password</h1>
        <p style={styles.subtitle}>
          Self-service password reset is not available in this system.
        </p>
        <p style={styles.info}>
          Please contact your <strong>Database Administrator</strong> to reset your password.
          They can update it for you via the User Management page.
        </p>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f6fa" },
  card: { width: "450px", background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", textAlign: "center" },
  title: { color: "#111827", marginBottom: "12px" },
  subtitle: { color: "#6b7280", marginBottom: "16px" },
  info: { background: "#f0f9ff", borderLeft: "4px solid #0ea5e9", padding: "16px", borderRadius: "8px", textAlign: "left", fontSize: "14px", color: "#0369a1", marginBottom: "24px" },
  backBtn: { background: "#1e3a8a", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
};