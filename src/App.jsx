import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import StudentProfile from "./pages/StudentProfile";
import EditStudent from "./pages/EditStudent";

import Staff from "./pages/Staff";
import Courses from "./pages/Courses";
import Enrolments from "./pages/Enrolments";

import Attendance from "./pages/Attendance";
import MarkAttendance from "./pages/MarkAttendance";
import AttendanceAnalytics from "./pages/AttendanceAnalytics";
import AttendanceGraph from "./pages/AttendanceGraph";

import Certificates from "./pages/Certificates";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import DataMigration from "./pages/DataMigration";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Students */}
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route
          path="/students/profile/:studentNo"
          element={<StudentProfile />}
        />
        <Route
          path="/students/edit/:studentNo"
          element={<EditStudent />}
        />

        {/* Staff, Courses, Enrolments */}
        <Route path="/staff" element={<Staff />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/enrolments" element={<Enrolments />} />

        {/* Attendance */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/mark" element={<MarkAttendance />} />
        <Route
          path="/attendance/analytics"
          element={<AttendanceAnalytics />}
        />
        <Route path="/attendance/graph" element={<AttendanceGraph />} />

        {/* Certificates and Reports */}
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/reports" element={<Reports />} />

        {/* DB Admin */}
        <Route path="/users" element={<Users />} />
        <Route path="/migration" element={<DataMigration />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;