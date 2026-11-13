import { useState, useEffect } from "react";
import { getUsers, approveInstructor, updateUserStatus, getInstructorDocuments } from "../../services/userService";

function InstructorApprovals() {
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");

  async function getData() {
    try {
      const response = await getUsers();
      setInstructors(response.filter((user) => user.role === "instructor" && !user.isApproved && user.isActive));
    } catch (err) {
      setError("Failed to load instructors");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleApprove(id) {
    try {
      const response = await approveInstructor(id);
      getData();
    } catch (err) {
      setError("Failed to approve instructor");
    }
  }

  async function handleReject(id) {
    try {
      const response = await updateUserStatus(id, { isActive: false });
      getData();
    } catch (err) {
      setError("Failed to reject instructor");
    }
  }

  async function handleDocument(id) {
    try {
      const response = await getInstructorDocuments(id);
      const url = URL.createObjectURL(response);
      window.open(url, "_blank");
    } catch (err) {
      setError("Failed to open document");
    }
  }

  return (
    <div>
      <h1>Instructor Approvals</h1>
      <p>Review and approve instructor registrations.</p>
      {error && <p>{error}</p>}
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
                <button onClick={() => handleReject(instructor._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstructorApprovals;
