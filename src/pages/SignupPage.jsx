import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "../services/authService";

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("learner");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: ""
  });
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("password", formData.password);
      data.append("role", role);

      if (role === "instructor") {
        if (!documents) {
          setError("Verification document is required");
          return;
        }
        data.append("documents", documents);
      }

      const response = await signUp(data);
      navigate("/sign-in");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    }
  }

  return (
    <div>
      <h1>Create Your DARBI Account</h1>
      <p>Choose how you want to join DARBI.</p>
      <div>
        <button type="button" onClick={() => setRole("learner")} disabled={role === "learner"}>Learner</button>
        <button type="button" onClick={() => setRole("instructor")} disabled={role === "instructor"}>Instructor</button>
      </div>
      <h2>{role === "learner" ? "Learner Registration" : "Instructor Registration"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} minLength={3} maxLength={30} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} required />
        </div>
        {role === "instructor" && (
          <div>
            <label htmlFor="documents">Verification Document</label>
            <input id="documents" type="file" name="documents" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setDocuments(event.target.files[0])} required />
            <p>PDF, JPG, or PNG (maximum 5 MB).</p>
          </div>
        )}
        {error && <p>{error}</p>}
        <button type="submit">Create Account</button>
      </form>
      <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
    </div>
  );
}

export default SignUp;