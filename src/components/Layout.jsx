import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
        }}
      >
        <Topbar />

        <div
          style={{
            padding: "20px",
            background: "#f5f6fa",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}