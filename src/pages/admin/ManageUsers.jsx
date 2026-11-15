import { useState, useEffect } from "react";
import { getUsers, updateUserStatus } from "../../services/userService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    let active = true;
    getUsers().then((response) => {
      if (active) setUsers(response);
    }).catch(() => {
      if (active) setError("Failed to load users");
    });
    return () => { active = false; };
  }, []);

  async function handleStatus(user) {
    try {
      await updateUserStatus(user._id, { isActive: !user.isActive });
      const response = await getUsers();
      setUsers(response);
    } catch {
      setError("Failed to update user status");
    }
  }

  const visibleUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [user.username, user.email, user.phone].some((value) => (value || "").toLowerCase().includes(query));
    return matchesSearch && (roleFilter === "all" || user.role === roleFilter);
  });

  return (
    <div className="manage-users-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Platform directory</span><h1>Manage users</h1><p>Search accounts and manage access across DARBI.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="table-toolbar"><label className="sr-only" htmlFor="user-search">Search users</label><input id="user-search" type="search" placeholder="Search name, email, or phone" value={search} onChange={(event) => setSearch(event.target.value)} /><label className="sr-only" htmlFor="role-filter">Filter by role</label><select id="role-filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option value="all">All roles</option>{[...new Set(users.map((user) => user.role))].map((role) => <option key={role} value={role}>{role}</option>)}</select><span className="result-count">{visibleUsers.length} accounts</span></div>
      <div className="table-scroll">
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
          {visibleUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td><span className="role-pill">{user.role}</span></td>
              <td><span className={`status-chip ${user.isActive ? "status-active" : "status-inactive"}`}>{user.isActive ? "Active" : "Inactive"}</span></td>
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
    </div>
  );
}

export default ManageUsers;
