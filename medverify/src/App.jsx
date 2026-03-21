import "./styles/global.css";
import { useAuth } from "./hooks/useAuth.js";

import LandingPage      from "./components/landing/LandingPage.jsx";
import LoginPage        from "./components/auth/LoginPage.jsx";
import SignupPage       from "./components/auth/SignupPage.jsx";
import ForgotPassword   from "./components/auth/ForgotPassword.jsx";
import PatientDashboard from "./components/patient/PatientDashboard.jsx";
import LabDashboard     from "./components/lab/LabDashboard.jsx";
import AdminDashboard   from "./components/admin/AdminDashboard.jsx";
import VerifyPage       from "./components/verify/VerifyPage.jsx";

export default function App() {
  const { user, page, navigate, login, logout, isLab, isAdmin } = useAuth();

  return (
    <>
      {page === "landing"          && <LandingPage     onNavigate={navigate} />}
      {page === "login"            && <LoginPage       onNavigate={navigate} onLogin={login} />}
      {page === "signup"           && <SignupPage      onNavigate={navigate} onLogin={login} />}
      {page === "forgot-password"  && <ForgotPassword  onNavigate={navigate} />}
      {page === "verify"           && <VerifyPage      onNavigate={navigate} />}
      {page === "app" && user && (
        isAdmin   ? <AdminDashboard   user={user} onLogout={logout} /> :
        isLab     ? <LabDashboard     user={user} onLogout={logout} /> :
                    <PatientDashboard user={user} onLogout={logout} />
      )}
    </>
  );
}
