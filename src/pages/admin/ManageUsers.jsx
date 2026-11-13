import { useState, useEffect } from "react";
import { getUsers, updateUserStatus } from "../../services/userService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

   async function getData() {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (err) {
        setError("Failed to load users");
      }
    }

  useEffect(() => {
 
    getData();
  }, []);

  async function handleStatus(user) {
    try {
      await updateUserStatus(user._id, { isActive: !user.isActive });
      const response = await getUsers();
      setUsers(response);
    } catch (err) {
      setError("Failed to update user status");
    }
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <p>View and manage DARBI user accounts.</p>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => handleStatus(user)}>
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;