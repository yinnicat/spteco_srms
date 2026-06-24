import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";

import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import StudentProfile from "./pages/StudentProfile";

import Staff from "./pages/Staff";
import AddStaff from "./pages/AddStaff";
import StaffProfile from "./pages/StaffProfile";

import Departments from "./pages/Departments";

import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import CourseDetails from "./pages/CourseDetails";

import Enrolments from "./pages/Enrolments";
import AddEnrolment from "./pages/AddEnrolment";
import EnrolmentDetails from "./pages/EnrolmentDetails";

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
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/students/profile/:studentNo" element={<StudentProfile />} />

        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/add" element={<AddStaff />} />
        <Route path="/staff/profile/:staffId" element={<StaffProfile />} />

        <Route path="/departments" element={<Departments />} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/courses/details/:courseCode" element={<CourseDetails />} />

        <Route path="/enrolments" element={<Enrolments />} />
        <Route path="/enrolments/add" element={<AddEnrolment />} />
        <Route path="/enrolments/details/:enrolmentId" element={<EnrolmentDetails />} />

        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/mark" element={<MarkAttendance />} />
        <Route path="/attendance/analytics" element={<AttendanceAnalytics />} />
        <Route path="/attendance/graph" element={<AttendanceGraph />} />

        <Route path="/certificates" element={<Certificates />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/migration" element={<DataMigration />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;