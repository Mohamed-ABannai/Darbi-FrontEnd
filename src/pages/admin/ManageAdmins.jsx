import { useState, useEffect } from "react";
import { createAdmin } from "../../services/authService";
import { getUsers, updateUserStatus } from "../../services/userService";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getUsers();
      setAdmins(response.filter((user) => user.role === "admin"));
    } catch {
      setError("Failed to load admins");
    }
  }

  useEffect(() => {
    let active = true;
    getUsers().then((response) => {
      if (active) setAdmins(response.filter((user) => user.role === "admin"));
    }).catch(() => {
      if (active) setError("Failed to load admins");
    });
    return () => { active = false; };
  }, []);

  function handleChange(event) {
    setFormData({...formData,[event.target.name]: event.target.value});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await createAdmin(formData);
      setMessage("Admin created successfully");
      setFormData({
        username: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: ""
      });
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin");
    }
  }

  async function handleStatus(admin) {
    setError("");
    setMessage("");
    try {
      await updateUserStatus(admin._id, { isActive: !admin.isActive });
      setMessage("Admin status updated successfully");
      getData();
    } catch {
      setError("Failed to update admin status");
    }
  }

  return (
    <div className="manage-admins-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Privileged access</span><h1>Manage admins</h1><p>Create trusted administrator accounts and review their access status.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}
      <h2>Create an admin account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} minLength={3} required />
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
        <button type="submit">Create Admin</button>
      </form>
      <h2>Admin accounts</h2>
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td><span className={`status-chip ${admin.isActive ? "status-active" : "status-inactive"}`}>{admin.isActive ? "Active" : "Inactive"}</span></td>
              <td>
                <button onClick={() => handleStatus(admin)}>
                  {admin.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}

export default ManageAdmins;
