import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";

import Topbar from "./Topbar";

export default function Layout({
  children,
}) {
  const navigate =
    useNavigate();

  useEffect(() => {
    const user =
      JSON.parse(
        localStorage.getItem(
          "loggedInUser"
        )
      );

    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <Topbar />

        <div
          style={styles.content}
        >
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

    background:
      "#f3f6fb",
  },

  main: {
    flex: 1,

    display: "flex",

    flexDirection:
      "column",
  },

  content: {
    flex: 1,

    padding: "25px",

    overflowY: "auto",
  },
};