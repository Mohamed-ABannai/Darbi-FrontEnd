import { useState, useEffect } from "react";
import { getUsers, approveInstructor, updateUserStatus, getInstructorDocuments } from "../../services/userService";

function InstructorApprovals() {
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");

  async function getData() {
    try {
      const response = await getUsers();
      setInstructors(response.filter((user) => user.role === "instructor" && !user.isApproved && user.isActive));
    } catch {
      setError("Failed to load instructors");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(getData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleApprove(id) {
    try {
      await approveInstructor(id);
      await getData();
    } catch {
      setError("Failed to approve instructor");
    }
  }

  async function handleReject(id) {
    try {
      await updateUserStatus(id, { isActive: false });
      await getData();
    } catch {
      setError("Failed to reject instructor");
    }
  }

  async function handleDocument(id) {
    try {
      const response = await getInstructorDocuments(id);
      const url = URL.createObjectURL(response);
      window.open(url, "_blank");
    } catch {
      setError("Failed to open document");
    }
  }

  return (
    <div className="instructor-approvals-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Verification queue</span><h1>Instructor approvals</h1><p>Review instructor contact details and submitted verification documents before approving access.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      {instructors.length === 0 ? <div className="empty-state"><h2>No applications need review</h2><p>New instructor registrations will appear here.</p></div> :
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor._id}>
                  <td>{instructor.username}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.phone}</td>
                  <td><button onClick={() => handleDocument(instructor._id)}>View Document</button></td>
                  <td>
                    <button onClick={() => handleApprove(instructor._id)}>Approve</button>
                    <button className="button-danger" onClick={() => { if (window.confirm(`Reject ${instructor.username}'s instructor application?`)) handleReject(instructor._id); }}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div>
  );
}

export default InstructorApprovals;