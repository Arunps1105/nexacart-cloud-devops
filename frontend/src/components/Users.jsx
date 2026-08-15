function Users({ users = [] }) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ACCESS MANAGEMENT</div>
          <h1>Users</h1>
          <p>Manage application users and roles.</p>
        </div>

        <span className="count-badge">
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>Application Users</h2>
            <p>Registered users</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♙</div>

            <h3>No users found</h3>

            <p>
              No application users are currently registered.
            </p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USERNAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>

                    <td>
                      <strong>
                        {user.username || user.name || "Unknown"}
                      </strong>
                    </td>

                    <td>
                      {user.email || "—"}
                    </td>

                    <td>
                      <span className="role-badge">
                        {user.is_staff || user.role === "admin"
                          ? "ADMIN"
                          : "USER"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
