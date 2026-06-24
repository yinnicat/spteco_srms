import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <Topbar />

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f6fa",
  },

  main: {
    flex: 1,
    marginLeft: "260px",
    display: "flex",
    flexDirection: "column",
  },

  content: {
    flex: 1,
    padding: "25px",
    background: "#f5f6fa",
  },
};