function Dashboard({
  products,
  orders,
  pendingOrders,
  totalStock,
  getProductName,
  setPage,
}) {
  return (
    <>
      <div className="page-heading">

        <div>
          <div className="eyebrow">
            OVERVIEW
          </div>

          <h1>Dashboard</h1>

          <p>
            Monitor your products, orders and inventory.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setPage("products")}
        >
          + Add Product
        </button>

      </div>

      <div className="stats-grid">

        <StatCard
          icon="📦"
          title="Total Products"
          value={products.length}
        />

        <StatCard
          icon="🛒"
          title="Total Orders"
          value={orders.length}
        />

        <StatCard
          icon="⏳"
          title="Pending Orders"
          value={pendingOrders}
        />

        <StatCard
          icon="📊"
          title="Total Stock"
          value={totalStock}
        />

      </div>

      <div className="dashboard-grid">

        <div className="card">

          <div className="card-header">

            <div>
              <h2>Products</h2>
              <p>Available inventory</p>
            </div>

            <button
              className="text-button"
              onClick={() => setPage("products")}
            >
              View all
            </button>

          </div>

          {products.length === 0 ? (
            <EmptyState text="No products available." />
          ) : (
            products.slice(0, 5).map((product) => (
              <ProductRow
                key={product.id}
                product={product}
              />
            ))
          )}

        </div>

        <OrderSummary
          orders={orders}
          getProductName={getProductName}
        />

      </div>

      <div className="card">

        <div className="card-header">

          <div>
            <h2>Recent Orders</h2>
            <p>Customer order activity</p>
          </div>

          <span className="count-badge">
            {orders.length} orders
          </span>

        </div>

        {orders.length === 0 ? (
          <EmptyState text="No orders yet." />
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>QUANTITY</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>

                    <td>
                      <strong>
                        #{order.id}
                      </strong>
                    </td>

                    <td>
                      {order.customer_name}
                    </td>

                    <td>
                      {order.product_name ||
                        getProductName(order.product)}
                    </td>

                    <td>
                      {order.quantity}
                    </td>

                    <td>
                      <span className="status-badge">
                        {order.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function ProductRow({ product }) {
  return (
    <div className="product-row">

      <div className="product-icon">
        📦
      </div>

      <div className="product-info">

        <strong>
          {product.name}
        </strong>

        <span>
          Product #{product.id}
        </span>

      </div>

      <div className="product-price">
        ₹{Number(product.price).toFixed(2)}
      </div>

      <div className="stock-badge">
        {product.stock} in stock
      </div>

    </div>
  );
}

function OrderSummary({
  orders,
  getProductName,
}) {
  return (
    <div className="card">

      <div className="card-header">

        <div>
          <h2>Order Activity</h2>
          <p>Latest customer orders</p>
        </div>

      </div>

      {orders.length === 0 ? (
        <EmptyState text="No orders yet." />
      ) : (
        orders.slice(0, 4).map((order) => (
          <div
            className="activity-row"
            key={order.id}
          >

            <div className="activity-number">
              #{order.id}
            </div>

            <div className="activity-info">

              <strong>
                {order.customer_name}
              </strong>

              <span>
                {order.product_name ||
                  getProductName(order.product)}
                {" × "}
                {order.quantity}
              </span>

            </div>

            <span className="status-badge">
              {order.status}
            </span>

          </div>
        ))
      )}

    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">

      <div>📭</div>

      <p>{text}</p>

    </div>
  );
}

export default Dashboard;
