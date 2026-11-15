import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import { logout } from "./services/authService";
import FindInstructors from "./pages/learner/FindInstructors";
import InstructorDetails from "./pages/learner/InstructorDetails";
import LearnerDrivingTests from "./pages/learner/LearnerDrivingTests";
import MyTrainingPlans from "./pages/learner/MyTrainingPlans";
import LearnerReviews from "./pages/learner/LearnerReviews";
import LearnerPayments from "./pages/learner/LearnerPayments";
import LearnerLessons from "./pages/learner/LearnerLessons";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import InstructorApprovals from "./pages/admin/InstructorApprovals";
import ManageTraining from "./pages/admin/ManageTraining";
import ManageReviews from "./pages/admin/ManageReviews";
import ManageDrivingTests from "./pages/admin/ManageDrivingTests";
import ManageAdmins from "./pages/admin/ManageAdmins";
import ManageExaminers from "./pages/admin/ManageExaminers";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import TrainingRequests from "./pages/instructor/TrainingRequests";
import MyLearners from "./pages/instructor/MyLearners";
import InstructorLessons from "./pages/instructor/InstructorLessons";
import InstructorPayments from "./pages/instructor/InstructorPayments";
import ExaminerDashboard from "./pages/examiner/ExaminerDashboard";
import AssignedTests from "./pages/examiner/AssignedTests";
import Profile from "./pages/shared/Profile";
import "./App.css";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const tokenPayload = token.split(".")[1];
    const base64 = tokenPayload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return payload;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

function App() {
  const [user, setUser] = useState(getUserFromToken());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleExpiredSession() {
      setUser(null);
      setSidebarOpen(false);
    }
    function handleStorageChange(event) {
      if (event.key === "token") setUser(getUserFromToken());
    }
    window.addEventListener("darbi:auth-expired", handleExpiredSession);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("darbi:auth-expired", handleExpiredSession);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div className={user ? "app-layout" : "public-layout"}>
      {user ? (
        <>
          <Sidebar user={user} handleLogout={handleLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="app-main">
            <header className="mobile-header">
              <button className="mobile-menu-button" type="button" aria-label="Open navigation menu" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
                <span /><span /><span />
              </button>
              <Link className="mobile-brand" to="/dashboard" aria-label="DARBI dashboard">DARBI</Link>
              <span className="mobile-role">{user.role}</span>
            </header>
            <main className="app-content">
              <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Homepage />} />

        <Route path="/sign-up" element={<SignupPage />} />

        <Route
          path="/sign-in"
          element={<SignInPage setUser={setUser} />}
        />

        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/sign-in" />
            ) : user.role === "admin" || user.role === "superAdmin" ? (
              <AdminDashboard user={user} />
            ) : user.role === "instructor" ? (
              <InstructorDashboard user={user} />
            ) : user.role === "examiner" ? (
              <ExaminerDashboard user={user} />
            ) : (
              <Dashboard user={user} />
            )
          }
        />

        <Route
          path="/find-instructors"
          element={
            user?.role === "learner" ? (
              <FindInstructors />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/instructors/:id"
          element={
            user?.role === "learner" ? (
              <InstructorDetails user={user} />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/my-plans"
          element={
            user?.role === "learner" ? (
              <MyTrainingPlans />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/learner/my-training-plans"
          element={<Navigate to="/my-plans" />}
        />

        <Route
          path="/driving-tests"
          element={
            user?.role === "learner" ? (
              <LearnerDrivingTests user={user} />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/reviews"
          element={
            user?.role === "learner" ? (
              <LearnerReviews user={user} />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/payments"
          element={
            user?.role === "learner" ? (
              <LearnerPayments user={user} />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/lessons"
          element={
            user?.role === "learner" ? (
              <LearnerLessons user={user} />
            ) : (
              <Navigate to={user ? "/dashboard" : "/sign-in"} />
            )
          }
        />

        <Route
          path="/instructor/requests"
          element={
            user?.role === "instructor" ? (
              <TrainingRequests />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/instructor/learners"
          element={
            user?.role === "instructor" ? (
              <MyLearners />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/instructor/lessons"
          element={
            user?.role === "instructor" ? (
              <InstructorLessons />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/instructor/payments"
          element={
            user?.role === "instructor" ? (
              <InstructorPayments />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/examiner/assigned-tests"
          element={
            user?.role === "examiner" ? (
              <AssignedTests />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/users"
          element={
            user?.role === "admin" || user?.role === "superAdmin" ? (
              <ManageUsers />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/instructor-approvals"
          element={
            user?.role === "admin" || user?.role === "superAdmin" ? (
              <InstructorApprovals />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/training"
          element={
            user?.role === "admin" || user?.role === "superAdmin" ? (
              <ManageTraining />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/reviews"
          element={
            user?.role === "admin" || user?.role === "superAdmin" ? (
              <ManageReviews />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/driving-tests"
          element={
            user?.role === "admin" || user?.role === "superAdmin" ? (
              <ManageDrivingTests />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/manage-admins"
          element={
            user?.role === "superAdmin" ? (
              <ManageAdmins />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/admin/examiners"
          element={
            user?.role === "admin" || user?.role === "superAdmin" ? (
              <ManageExaminers />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <main className="public-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/sign-up" element={<SignupPage />} />
              <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
