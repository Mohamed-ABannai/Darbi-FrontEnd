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
    password: "",
    hourlyRate: ""
  });
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  function handleDocumentChange(event) {
    const file = event.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("The verification document must be 5 MB or smaller.");
      setDocuments(null);
      event.target.value = "";
      return;
    }
    setError("");
    setDocuments(file || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("password", formData.password);
      data.append("role", role);

      if (role === "instructor") {
        const hourlyRate = Number(formData.hourlyRate);
        if (!Number.isFinite(hourlyRate) || hourlyRate < 22) {
          setError("Hourly rate must be at least 22 BHD.");
          return;
        }
        data.append("hourlyRate", String(hourlyRate));
        if (!documents) {
          setError("Verification document is required");
          return;
        }
        data.append("documents", documents);
      }

      await signUp(data);
      navigate("/sign-in");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <aside className="auth-aside"><div><span className="hero-eyebrow">A confident start</span><h1>Learn at<br />your own pace.</h1><p>Build your driving journey with organized lessons, a clear training plan, and an instructor who fits your needs.</p></div><small>DARBI · Your road, your progress.</small></aside>
      <section className="auth-panel">
        <h1>Create your account</h1>
        <p>Choose how you want to join DARBI.</p>
        <div className="role-picker">
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
            <div className="password-field"><input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} minLength={6} required /><button className="password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Hide" : "Show"}</button></div>
          </div>
          {role === "instructor" && (
            <>
              <div>
                <label htmlFor="hourlyRate">Hourly Rate (BHD)</label>
                <input id="hourlyRate" type="number" name="hourlyRate" min="22" step="0.001" value={formData.hourlyRate} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="documents">Verification Document</label>
                <input id="documents" type="file" name="documents" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentChange} required />
                <p>PDF, JPG, or PNG (maximum 5 MB).</p>
              </div>
            </>
          )}
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? "Creating account…" : "Create Account"}</button>
        </form>
        <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
      </section>
    </main>
  );
}

export default SignUp;
