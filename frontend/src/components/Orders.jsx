import { useState } from "react";

function Orders({
  orders,
  pendingOrders,
  confirmedOrders,
  shippedOrders,
  updateOrder,
  getProductName,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            SALES
          </div>

          <h1>Orders</h1>

          <p>
            Manage and process customer orders.
          </p>
        </div>

        <div className="status-summary">
          <span>{pendingOrders} Pending</span>
          <span>{confirmedOrders} Confirmed</span>
          <span>{shippedOrders} Shipped</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>All Orders</h2>

            <p>
              Update order status below.
            </p>
          </div>

          <span className="count-badge">
            {orders.length} orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div>🛒</div>
            <h3>No orders found</h3>
            <p>
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>QTY</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    updateOrder={updateOrder}
                    getProductName={getProductName}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}


function OrderRow({
  order,
  updateOrder,
  getProductName,
}) {
  const [status, setStatus] = useState(
    order.status || "PENDING"
  );

  const handleUpdate = () => {
    updateOrder(order.id, status);
  };

  return (
    <tr>
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
        <div className="status-control">

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="PENDING">
              PENDING
            </option>

            <option value="CONFIRMED">
              CONFIRMED
            </option>

            <option value="SHIPPED">
              SHIPPED
            </option>

            <option value="DELIVERED">
              DELIVERED
            </option>

            <option value="CANCELLED">
              CANCELLED
            </option>
          </select>

          <button
            type="button"
            className="small-button"
            onClick={handleUpdate}
          >
            Update
          </button>

        </div>
      </td>
    </tr>
  );
}

export default Orders;
