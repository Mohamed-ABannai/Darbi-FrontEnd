import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
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
import AdminDashboard from "./pages/admin/AdminDashboard";


function App() {
  function getUserFromToken() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  }

  const [user, setUser] = useState(getUserFromToken());

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />
        <Route path="/find-instructors" element={<FindInstructors />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "admin" || user.role === "superAdmin"
                ? <AdminDashboard />
                : <Dashboard user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />
        <Route
          path="/instructors/:id"
          element={
            user ? (
              <InstructorDetails user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />{" "}
        <Route
          path="/driving-tests"
          element={
            user ? (
              <LearnerDrivingTests user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />
        <Route
          path="/my-plans"
          element={
            user ? <MyTrainingPlans user={user} /> : <Navigate to="/sign-in" />
          }
        />
        <Route
          path="/reviews"
          element={
            user ? <LearnerReviews user={user} /> : <Navigate to="/sign-in" />
          }
        />
        <Route
          path="/payments"
          element={
            user ? <LearnerPayments user={user} /> : <Navigate to="/sign-in" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
