function Sidebar({
  page,
  setPage,
  onLogout,
  isAdmin,
  username,
}) {
  const displayName =
    username || "User";

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          ◆
        </div>

        <div>
          <h2>
            OrderFlow
          </h2>

          <span>
            Order Management
          </span>
        </div>

      </div>

      <div className="menu-title">
        MAIN MENU
      </div>

      {isAdmin && (
        <button
          className={
            page === "dashboard"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setPage(
              "dashboard"
            )
          }
        >
          <span className="nav-icon">
            ▦
          </span>

          <span>
            Dashboard
          </span>
        </button>
      )}

      <button
        className={
          page === "products"
            ? "nav-item active"
            : "nav-item"
        }
        onClick={() =>
          setPage("products")
        }
      >
        <span className="nav-icon">
          ▣
        </span>

        <span>
          Products
        </span>
      </button>

      {isAdmin && (
        <>
          <button
            className={
              page === "orders"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage("orders")
            }
          >
            <span className="nav-icon">
              🛒
            </span>

            <span>
              Orders
            </span>
          </button>

          <button
            className={
              page === "users"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage("users")
            }
          >
            <span className="nav-icon">
              ♙
            </span>

            <span>
              Users
            </span>
          </button>
        </>
      )}

      {!isAdmin && (
        <button
          className={
            page === "my-orders"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setPage(
              "my-orders"
            )
          }
        >
          <span className="nav-icon">
            🛍
          </span>

          <span>
            My Orders
          </span>
        </button>
      )}

      <div className="sidebar-bottom">

        <div className="admin-card">

          <div className="admin-avatar">
            {displayName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <strong>
              {displayName}
            </strong>

            <span>
              {isAdmin
                ? "Administrator"
                : "Customer"}
            </span>

          </div>

        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <span>
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
