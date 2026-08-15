function MyOrders({
  orders,
  products,
  getProductName,
}) {
  const getProductPrice = (
    productId
  ) => {
    const product =
      products.find(
        (item) =>
          Number(item.id) ===
          Number(productId)
      );

    return product
      ? Number(
          product.price
        ).toFixed(2)
      : "0.00";
  };

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "CONFIRMED":
        return "status-confirmed";

      case "SHIPPED":
        return "status-shipped";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  return (
    <>
      <div className="page-heading">

        <div>
          <div className="eyebrow">
            ORDERS
          </div>

          <h1>
            My Orders
          </h1>

          <p>
            Track your orders and
            their current status.
          </p>
        </div>

        <div className="order-count-badge">
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </div>

      </div>

      <div className="card">

        <div className="card-header">

          <div>
            <h2>
              Order History
            </h2>

            <p>
              Your recent orders.
            </p>
          </div>

        </div>

        {orders.length ===
        0 ? (
          <div className="empty-state">

            <div>
              🛒
            </div>

            <h3>
              No orders yet
            </h3>

            <p>
              Your orders will
              appear here after
              you purchase a
              product.
            </p>

          </div>
        ) : (
          <div className="my-orders-list">

            {orders.map(
              (order) => {
                const price =
                  Number(
                    getProductPrice(
                      order.product
                    )
                  );

                const quantity =
                  Number(
                    order.quantity
                  );

                const total =
                  price *
                  quantity;

                return (
                  <div
                    className="my-order-card"
                    key={
                      order.id
                    }
                  >

                    <div className="my-order-main">

                      <div className="order-product-icon">
                        📦
                      </div>

                      <div>

                        <span className="order-number">
                          Order #
                          {
                            order.id
                          }
                        </span>

                        <h3>
                          {order.product_name ||
                            getProductName(
                              order.product
                            )}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {
                            order.quantity
                          }
                        </p>

                      </div>

                    </div>

                    <div className="my-order-details">

                      <div>
                        <span>
                          Price
                        </span>

                        <strong>
                          ₹
                          {price.toFixed(
                            2
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Total
                        </span>

                        <strong>
                          ₹
                          {total.toFixed(
                            2
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Status
                        </span>

                        <span
                          className={`order-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {
                            order.status
                          }
                        </span>
                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </>
  );
}

export default MyOrders;
