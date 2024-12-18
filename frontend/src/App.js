import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { AuthProvider } from "./components/ProtectedRoutes/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";

// Import your components
import LandingPage from "./components/LadingPage/LandingPage";
import About from "./components/about/about";
import AdminOrUser from "./components/adminOrUser/adminOrUser";
import AdminLogin from "./components/adminLogin/adminLogin";
import StudentLandingPage from "./components/studentLandingPage/studentLandingPage";
import Studentgatepass from "./components/studentLandingPage/Studentgatepass";
import StudentComplaints from "./components/studentLandingPage/StudentComplaints";
import PaymentPage from "./components/payment/PaymentForm";
import QRcode from "./components/QRCode/QRcode";
import UserMess from "./components/MessMenu/MessMenu";

import Dashboard from "./components/Dashboard/Dashboard";
import Studentdetails from "./components/Dashboard/Studentdetails";
import Gatepassdetails from "./components/Dashboard/Gatepassdetails";
import Complaintbox from "./components/Dashboard/Complaintbox";
import Account from "./components/Dashboard/Account";
import MessMenu from "./components/Dashboard/messMenu";

import MessLogin from "./components/messLogin/messLogin";
import QRScanner from "./components/QRCode/QRreader";

import GateLogin from "./components/GateSecurity/gateLogin";

import MessSign from "./components/messLogin/messSignup";
import SuperLogin from "./components/superadmin/SuperLogin";
import Wardendetails from "./components/superadmin/Dashboard/Wardendetails";
import Warden from "./components/superadmin/Dashboard/Warden";
import GateSecurity from "./components/superadmin/Dashboard/GateSecurity";
import GuardDetails from "./components/superadmin/Dashboard/GuardDetails";
import Dashboard1 from "./components/superadmin/Dashboard/Dashboard1";
import SignUp from "./components/LoginRegister/SignUp";
import Login from "./components/LoginRegister/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-user" element={<AdminOrUser />} />
        <Route path="/student-signup" element={<SignUp/>} />
        <Route path="/student-login" element={<Login/>} />
        <Route path="/warden-signup" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/super-admin/login" element={<SuperLogin />} />
        <Route path="/guard/gate-login" element={<GateLogin />} />
        <Route path="/guard/mess-login" element={<MessLogin />} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLandingPage /></ProtectedRoute>} />
        <Route path="/student/my-gatepasses" element={<ProtectedRoute allowedRoles={['student']}><Studentgatepass /></ProtectedRoute>} />
        <Route path="/student/my-complaints" element={<ProtectedRoute allowedRoles={['student']}><StudentComplaints /></ProtectedRoute>} />
        <Route path="/student/booking/payment" element={<ProtectedRoute allowedRoles={['student']}><PaymentPage /></ProtectedRoute>} />
        <Route path="/student/QR" element={<ProtectedRoute allowedRoles={['student']}><QRcode /></ProtectedRoute>} />
        <Route path="/student/mess" element={<ProtectedRoute allowedRoles={['student']}><UserMess /></ProtectedRoute>} />

        <Route
          path="/warden/dashboard"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden/student-details"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <Studentdetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden/gatepasses"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <Gatepassdetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden/complaints"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <Complaintbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden/my-account"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden/update/mess-menu"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <MessMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warden/create/mess-security"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <MessSign />
            </ProtectedRoute>
          }
        />
        {/* Gaurd Routes */}
        <Route
          path="/guard/scanner"
          element={
            <ProtectedRoute allowedRoles={["mess-guard", 'gate-security']}>
              <QRScanner />
            </ProtectedRoute>
          }
        />


        {/* Super Admin Routes */}

        <Route
          path="/super-admin/login"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <SuperLogin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/details/wardens"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <Wardendetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/create/warden"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <Warden />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/create/gate-security"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <GateSecurity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/details/gate-security"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <GuardDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <Dashboard1 />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
