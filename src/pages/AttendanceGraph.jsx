import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AttendanceGraph() {
  const monthlyData = [
    { month: "Jan", attendance: 85 },
    { month: "Feb", attendance: 82 },
    { month: "Mar", attendance: 76 },
    { month: "Apr", attendance: 88 },
    { month: "May", attendance: 91 },
    { month: "Jun", attendance: 87 },
  ];

  const studentData = [
    { name: "BTC001", attendance: 92 },
    { name: "BTC002", attendance: 76 },
    { name: "BTC003", attendance: 68 },
    { name: "BTC004", attendance: 89 },
    { name: "BTC005", attendance: 95 },
  ];

  const eligibilityData = [
    { name: "Eligible", value: 78 },
    { name: "Not Eligible", value: 22 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Attendance Analytics Dashboard</h1>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Average Attendance</h3>
            <h1>86%</h1>
          </div>

          <div style={styles.card}>
            <h3>Exam Eligible</h3>
            <h1>78%</h1>
          </div>

          <div style={styles.card}>
            <h3>Allowance Eligible</h3>
            <h1>65%</h1>
          </div>

          <div style={styles.cardDanger}>
            <h3>At Risk Students</h3>
            <h1>22</h1>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h2>Monthly Attendance Trend</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.doubleGrid}>
          <div style={styles.chartCard}>
            <h2>Top Student Attendance</h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={studentData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="attendance"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h2>Eligibility Breakdown</h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={eligibilityData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {eligibilityData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.rules}>
          <h3>Attendance Policy</h3>

          <p>
            ✅ Exam Eligibility:
            Minimum 80% Attendance
          </p>

          <p>
            ✅ Allowance Eligibility:
            Minimum 85% Attendance
          </p>

          <p>
            ⚠ Students below 80% are
            flagged as At Risk.
          </p>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 1px 4px rgba(0,0,0,0.1)",
  },

  cardDanger: {
    background: "#fee2e2",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  chartCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow:
      "0 1px 4px rgba(0,0,0,0.1)",
  },

  doubleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  rules: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      "0 1px 4px rgba(0,0,0,0.1)",
  },
};