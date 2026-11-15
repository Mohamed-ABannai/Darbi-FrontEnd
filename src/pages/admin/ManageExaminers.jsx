import { useEffect, useState } from "react";
import {
  createExaminer,
  getExaminerById,
  getExaminers,
  updateExaminerStatus
} from "../../services/userService";

function ManageExaminers() {
  const [examiners, setExaminers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: ""
  });
  const [selectedExaminer, setSelectedExaminer] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadExaminers() {
    try {
      const response = await getExaminers();
      setExaminers(response);
    } catch {
      setError("Failed to load examiners");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadExaminers, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await createExaminer(formData);
      setMessage("Examiner created successfully");
      setFormData({ username: "", email: "", phone: "", dateOfBirth: "", password: "" });
      await loadExaminers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create examiner");
    }
  }

  async function handleDetails(examiner) {
    setError("");
    try {
      const response = await getExaminerById(examiner._id);
      setSelectedExaminer(response);
    } catch {
      setError("Failed to load examiner details");
    }
  }

  async function handleStatus(examiner) {
    setError("");
    setMessage("");
    try {
      await updateExaminerStatus(examiner._id, !examiner.isActive);
      setMessage("Examiner status updated successfully");
      if (selectedExaminer?._id === examiner._id) {
        setSelectedExaminer({ ...selectedExaminer, isActive: !examiner.isActive });
      }
      await loadExaminers();
    } catch {
      setError("Failed to update examiner status");
    }
  }

  return (
    <div className="manage-examiners-page admin-table-page">
      <div className="page-heading">
        <span className="section-kicker">Driving test team</span>
        <h1>Manage examiners</h1>
        <p>Create examiner accounts and manage their access to assigned driving tests.</p>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}
      <h2>Create an examiner account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="examiner-username">Name / Username</label>
          <input id="examiner-username" type="text" name="username" value={formData.username} onChange={handleChange} minLength={3} required />
        </div>
        <div>
          <label htmlFor="examiner-email">Email</label>
          <input id="examiner-email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="examiner-phone">Phone Number</label>
          <input id="examiner-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="examiner-date-of-birth">Date of Birth</label>
          <input id="examiner-date-of-birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="examiner-password">Password</label>
          <input id="examiner-password" type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} required />
        </div>
        <button type="submit">Create Examiner</button>
      </form>
      <h2>Examiner accounts</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {examiners.map((examiner) => (
              <tr key={examiner._id}>
                <td>{examiner.username}</td>
                <td>{examiner.email}</td>
                <td><span className={`status-chip ${examiner.isActive ? "status-active" : "status-inactive"}`}>{examiner.isActive ? "Active" : "Inactive"}</span></td>
                <td>
                  <button type="button" onClick={() => handleDetails(examiner)}>View details</button>
                  <button type="button" onClick={() => handleStatus(examiner)}>{examiner.isActive ? "Deactivate" : "Activate"}</button>
                </td>
              </tr>
            ))}
            {examiners.length === 0 && <tr><td colSpan="4">No examiner accounts found.</td></tr>}
          </tbody>
        </table>
      </div>
      {selectedExaminer && (
        <section className="profile-overview" aria-label="Examiner details">
          <div>
            <h2>{selectedExaminer.username}</h2>
            <p>Email: {selectedExaminer.email}</p>
            <p>Phone: {selectedExaminer.phone}</p>
            <p>Date of birth: {selectedExaminer.dateOfBirth ? new Date(selectedExaminer.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
            <p>Account status: {selectedExaminer.isActive ? "Active" : "Inactive"}</p>
          </div>
          <button type="button" onClick={() => setSelectedExaminer(null)}>Close details</button>
        </section>
      )}
    </div>
  );
}

export default ManageExaminers;
