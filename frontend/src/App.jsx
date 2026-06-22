import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import Staff from "./pages/Staff";
import Courses from "./pages/Courses";
import Enrolments from "./pages/Enrolments";
import Certificates from "./pages/Certificates";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import DataMigration from "./pages/DataMigration";
import Settings from "./pages/Settings";
import StudentProfile from "./pages/StudentProfile";
import StaffProfile from "./pages/StaffProfile";
import AddCourse from "./pages/AddCourse";
import CourseDetails from "./pages/CourseDetails";
import AddEnrolment from "./pages/AddEnrolment";
import EnrolmentDetails from "./pages/EnrolmentDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/enrolments" element={<Enrolments />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/migration" element={<DataMigration />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/students/profile" element={<StudentProfile />} />
        <Route path="/staff/profile" element={<StaffProfile />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/courses/details" element={<CourseDetails />} />
        <Route path="/enrolments/add" element={<AddEnrolment />} />
        <Route path="/enrolments/details" element={<EnrolmentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;