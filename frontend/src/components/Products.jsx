import { useState } from "react";

function Products({
  products,
  addProduct,
  isAdmin,
  onBuyProduct,
}) {
  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!isAdmin) {
      return;
    }

    if (!form.name.trim()) {
      alert(
        "Enter product name"
      );
      return;
    }

    if (!form.price) {
      alert(
        "Enter product price"
      );
      return;
    }

    if (!form.stock) {
      alert(
        "Enter product stock"
      );
      return;
    }

    setSubmitting(true);

    const success =
      await addProduct({
        name: form.name.trim(),
        price: Number(
          form.price
        ),
        stock: Number(
          form.stock
        ),
      });

    setSubmitting(false);

    if (success) {
      setForm({
        name: "",
        price: "",
        stock: "",
      });

      setShowForm(false);
    }
  };

  return (
    <>
      <div className="page-heading">

        <div>
          <div className="eyebrow">
            INVENTORY
          </div>

          <h1>
            Products
          </h1>

          <p>
            {isAdmin
              ? "Manage products and inventory."
              : "Browse available products and place orders."}
          </p>
        </div>

        {isAdmin && (
          <button
            className="primary-button"
            onClick={() =>
              setShowForm(
                !showForm
              )
            }
          >
            + Add Product
          </button>
        )}

      </div>

      {isAdmin &&
        showForm && (
          <form
            className="card product-form"
            onSubmit={
              handleSubmit
            }
          >

            <div className="card-header">

              <div>
                <h2>
                  Add Product
                </h2>

                <p>
                  Add a new product
                  to inventory.
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setShowForm(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Laptop"
                  autoComplete="off"
                />

              </div>

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    form.price
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: 50000"
                  min="0"
                  step="0.01"
                />

              </div>

              <div className="form-group">

                <label>
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={
                    form.stock
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: 25"
                  min="0"
                />

              </div>

            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Adding..."
                : "Add Product"}
            </button>

          </form>
        )}

      <div className="card">

        <div className="card-header">

          <div>
            <h2>
              All Products
            </h2>

            <p>
              {products.length}{" "}
              products
            </p>
          </div>

        </div>

        {products.length ===
        0 ? (
          <div className="empty-state">

            <div>
              📦
            </div>

            <p>
              No products found.
            </p>

          </div>
        ) : (
          <div className="products-grid">

            {products.map(
              (product) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  isAdmin={
                    isAdmin
                  }
                  onBuyProduct={
                    onBuyProduct
                  }
                />
              )
            )}

          </div>
        )}

      </div>
    </>
  );
}


function ProductCard({
  product,
  isAdmin,
  onBuyProduct,
}) {
  const stock =
    Number(
      product.stock || 0
    );

  return (
    <div className="product-card">

      <div className="product-icon">
        📦
      </div>

      <div className="product-card-info">

        <span>
          Product #{product.id}
        </span>

        <h3>
          {product.name}
        </h3>

        <strong>
          ₹
          {Number(
            product.price
          ).toFixed(2)}
        </strong>

      </div>

      <div className="product-card-actions">

        <div
          className="stock-badge"
        >
          {stock} in stock
        </div>

        {!isAdmin &&
          stock > 0 && (
            <button
              className="primary-button"
              onClick={() =>
                onBuyProduct(
                  product
                )
              }
            >
              Buy Now
            </button>
          )}

        {!isAdmin &&
          stock <= 0 && (
            <button
              className="primary-button"
              disabled
            >
              Out of Stock
            </button>
          )}

      </div>

    </div>
  );
}

export default Products;
