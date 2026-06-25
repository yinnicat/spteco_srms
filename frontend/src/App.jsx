import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
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
import Modules from "./pages/Modules";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* All logged in */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/students/profile/:studentNo" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        <Route path="/staff/profile/:staffId" element={<ProtectedRoute><StaffProfile /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/courses/details/:courseCode" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        <Route path="/enrolments" element={<ProtectedRoute><Enrolments /></ProtectedRoute>} />
        <Route path="/enrolments/details/:enrolmentId" element={<ProtectedRoute><EnrolmentDetails /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/attendance/mark" element={<ProtectedRoute><MarkAttendance /></ProtectedRoute>} />
        <Route path="/attendance/analytics" element={<ProtectedRoute><AttendanceAnalytics /></ProtectedRoute>} />
        <Route path="/attendance/graph" element={<ProtectedRoute><AttendanceGraph /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
        
        {/* Admin and DB Admin only */}
        <Route path="/students/add" element={<ProtectedRoute allowedRoles={["Admin", "DB Admin"]}><AddStudent /></ProtectedRoute>} />
        <Route path="/staff/add" element={<ProtectedRoute allowedRoles={["Admin", "DB Admin"]}><AddStaff /></ProtectedRoute>} />
        <Route path="/courses/add" element={<ProtectedRoute allowedRoles={["Admin", "DB Admin"]}><AddCourse /></ProtectedRoute>} />
        <Route path="/enrolments/add" element={<ProtectedRoute allowedRoles={["Admin", "DB Admin"]}><AddEnrolment /></ProtectedRoute>} />
        <Route path="/migration" element={<ProtectedRoute allowedRoles={["Admin", "DB Admin"]}><DataMigration /></ProtectedRoute>} />

        {/* DB Admin only */}
        <Route path="/users" element={<ProtectedRoute allowedRoles={["DB Admin"]}><Users /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;