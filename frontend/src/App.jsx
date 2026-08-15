import {
  useEffect,
  useState,
} from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Login from "./components/Login";
import Register from "./components/Register";
import MyOrders from "./components/MyOrders";


const API =
  `http://${window.location.hostname}:8000/api`;


function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      !!sessionStorage.getItem(
        "access_token"
      )
    );

  const [showRegister, setShowRegister] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [page, setPage] =
    useState("dashboard");

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /*
   * =========================
   * AUTHENTICATED FETCH
   * =========================
   */

  const authFetch = async (
    url,
    options = {}
  ) => {

    const token =
      sessionStorage.getItem(
        "access_token"
      );

    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    return fetch(
      url,
      {
        ...options,
        headers,
      }
    );
  };


  /*
   * =========================
   * CURRENT USER
   * =========================
   */

  const fetchCurrentUser =
    async () => {

      try {

        const response =
          await authFetch(
            `${API}/me/`
          );

        if (!response.ok) {
          throw new Error(
            "Unable to get current user"
          );
        }

        const data =
          await response.json();

        setCurrentUser(data);

        return data;

      } catch (error) {

        console.error(
          "Current user:",
          error
        );

        handleLogout();

        return null;
      }
    };


  /*
   * =========================
   * LOGIN
   * =========================
   */

  const handleLogin =
    async () => {

      setShowRegister(false);

      const user =
        await fetchCurrentUser();

      if (!user) {
        return;
      }

      setIsLoggedIn(true);

      if (user.is_staff) {

        setPage(
          "dashboard"
        );

      } else {

        setPage(
          "products"
        );
      }
    };


  /*
   * =========================
   * LOGOUT
   * =========================
   */

  const handleLogout =
    () => {

      sessionStorage.removeItem(
        "access_token"
      );

      sessionStorage.removeItem(
        "refresh_token"
      );

      sessionStorage.removeItem(
        "username"
      );

      setCurrentUser(null);

      setProducts([]);

      setOrders([]);

      setUsers([]);

      setPage("dashboard");

      setShowRegister(false);

      setIsLoggedIn(false);
    };


  /*
   * =========================
   * PRODUCTS
   * =========================
   */

  const fetchProducts =
    async () => {

      try {

        const response =
          await authFetch(
            `${API}/products/`
          );

        if (!response.ok) {
          throw new Error(
            "Products API failed"
          );
        }

        const data =
          await response.json();

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Products:",
          error
        );

        setProducts([]);
      }
    };


  /*
   * =========================
   * ORDERS
   * =========================
   */

  const fetchOrders =
    async () => {

      try {

        const response =
          await authFetch(
            `${API}/orders/`
          );

        if (!response.ok) {
          throw new Error(
            "Orders API failed"
          );
        }

        const data =
          await response.json();

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Orders:",
          error
        );

        setOrders([]);
      }
    };


  /*
   * =========================
   * USERS
   * =========================
   */

  const fetchUsers =
    async () => {

      try {

        const response =
          await authFetch(
            `${API}/users/`
          );

        if (!response.ok) {
          setUsers([]);
          return;
        }

        const data =
          await response.json();

        setUsers(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Users:",
          error
        );

        setUsers([]);
      }
    };


  /*
   * =========================
   * LOAD DATA
   * =========================
   */

  const loadData =
    async (user) => {

      if (!user) {
        return;
      }

      setLoading(true);

      await fetchProducts();

      await fetchOrders();

      if (user.is_staff) {
        await fetchUsers();
      }

      setLoading(false);
    };


  /*
   * =========================
   * INITIAL SESSION CHECK
   * =========================
   */

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }

    const initialize =
      async () => {

        const user =
          await fetchCurrentUser();

        if (user) {
          await loadData(user);
        }
      };

    initialize();

  }, []);


  /*
   * =========================
   * LOGIN DATA LOAD
   * =========================
   */

  useEffect(() => {

    if (
      isLoggedIn &&
      currentUser
    ) {

      loadData(
        currentUser
      );
    }

  }, [
    isLoggedIn,
    currentUser,
  ]);


  /*
   * =========================
   * MESSAGE
   * =========================
   */

  const showMessage =
    (text) => {

      setMessage(text);

      setTimeout(() => {
        setMessage("");
      }, 4000);
    };


  /*
   * =========================
   * ADD PRODUCT
   * =========================
   */

  const addProduct =
    async (
      productData
    ) => {

      try {

        if (
          !currentUser?.is_staff
        ) {

          showMessage(
            "Only administrators can add products."
          );

          return false;
        }

        const response =
          await authFetch(
            `${API}/products/`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                productData
              ),
            }
          );

        if (!response.ok) {

          const error =
            await response
              .json()
              .catch(
                () => ({})
              );

          throw new Error(
            error.detail ||
            error.error ||
            "Failed to add product"
          );
        }

        await fetchProducts();

        showMessage(
          "Product added successfully."
        );

        return true;

      } catch (error) {

        console.error(
          error
        );

        showMessage(
          error.message
        );

        return false;
      }
    };


  /*
   * =========================
   * PLACE ORDER
   * =========================
   */

  const placeOrder =
    async (
      product,
      quantity
    ) => {

      try {

        const numericQuantity =
          Number(quantity);

        if (
          !Number.isInteger(
            numericQuantity
          ) ||
          numericQuantity <= 0
        ) {

          showMessage(
            "Enter a valid quantity."
          );

          return false;
        }

        if (
          numericQuantity >
          Number(
            product.stock
          )
        ) {

          showMessage(
            "Requested quantity is greater than available stock."
          );

          return false;
        }

        const username =
          sessionStorage.getItem(
            "username"
          );

        const response =
          await authFetch(
            `${API}/orders/`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                product:
                  product.id,

                quantity:
                  numericQuantity,

                customer_name:
                  username,
              }),
            }
          );

        if (!response.ok) {

          const error =
            await response
              .json()
              .catch(
                () => ({})
              );

          throw new Error(
            error.error ||
            error.detail ||
            "Failed to place order"
          );
        }

        await Promise.all([
          fetchProducts(),
          fetchOrders(),
        ]);

        showMessage(
          "Order placed successfully."
        );

        setPage(
          "my-orders"
        );

        return true;

      } catch (error) {

        console.error(
          "Place order:",
          error
        );

        showMessage(
          error.message
        );

        return false;
      }
    };


  /*
   * =========================
   * BUY PRODUCT
   * =========================
   */

  const handleBuyProduct =
    async (
      product
    ) => {

      if (!currentUser) {
        return;
      }

      const quantityText =
        window.prompt(
          `How many "${product.name}" would you like to order?\nAvailable stock: ${product.stock}`,
          "1"
        );

      if (
        quantityText === null
      ) {
        return;
      }

      const quantity =
        Number(
          quantityText
        );

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity <= 0
      ) {

        showMessage(
          "Please enter a valid quantity."
        );

        return;
      }

      await placeOrder(
        product,
        quantity
      );
    };


  /*
   * =========================
   * UPDATE ORDER
   * =========================
   */

  const updateOrder =
    async (
      orderId,
      status
    ) => {

      try {

        if (
          !currentUser?.is_staff
        ) {

          showMessage(
            "Only administrators can update orders."
          );

          return;
        }

        const response =
          await authFetch(
            `${API}/orders/${orderId}/`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                status,
              }),
            }
          );

        if (!response.ok) {

          const error =
            await response
              .json()
              .catch(
                () => ({})
              );

          throw new Error(
            error.error ||
            error.detail ||
            "Failed to update order"
          );
        }

        await Promise.all([
          fetchOrders(),
          fetchProducts(),
        ]);

        showMessage(
          `Order #${orderId} updated to ${status}.`
        );

      } catch (error) {

        console.error(
          error
        );

        showMessage(
          error.message
        );
      }
    };


  /*
   * =========================
   * PRODUCT NAME
   * =========================
   */

  const getProductName =
    (productId) => {

      const product =
        products.find(
          (item) =>
            Number(
              item.id
            ) ===
            Number(
              productId
            )
        );

      return product
        ? product.name
        : `Product #${productId}`;
    };


  /*
   * =========================
   * ORDER STATISTICS
   * =========================
   */

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "PENDING"
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "CONFIRMED"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "SHIPPED"
    ).length;

  const totalStock =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        Number(
          product.stock || 0
        ),
      0
    );


  /*
   * =========================
   * LOGIN / REGISTER
   * =========================
   */

  if (!isLoggedIn) {

    if (showRegister) {

      return (
        <Register
          onBackToLogin={() =>
            setShowRegister(
              false
            )
          }
        />
      );
    }

    return (
      <Login
        onLogin={
          handleLogin
        }

        onRegister={() =>
          setShowRegister(
            true
          )
        }
      />
    );
  }


  /*
   * =========================
   * APPLICATION
   * =========================
   */

  return (
    <div className="app">

      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={
          handleLogout
        }
        isAdmin={
          currentUser?.is_staff
        }
        username={
          currentUser?.username ||
          sessionStorage.getItem(
            "username"
          )
        }
      />

      <main className="main">

        {message && (
          <div className="alert">

            <span>
              ✓
            </span>

            <span>
              {message}
            </span>

            <button
              onClick={() =>
                setMessage("")
              }
            >
              ×
            </button>

          </div>
        )}

        {loading && (
          <div className="loading">
            Loading data...
          </div>
        )}


        {/* ADMIN DASHBOARD */}

        {currentUser?.is_staff &&
          page ===
            "dashboard" && (

            <Dashboard
              products={
                products
              }

              orders={
                orders
              }

              pendingOrders={
                pendingOrders
              }

              totalStock={
                totalStock
              }

              getProductName={
                getProductName
              }

              setPage={
                setPage
              }
            />
          )}


        {/* PRODUCTS */}

        {page ===
          "products" && (

          <Products
            products={
              products
            }

            addProduct={
              addProduct
            }

            isAdmin={
              currentUser?.is_staff
            }

            onBuyProduct={
              handleBuyProduct
            }
          />
        )}


        {/* ADMIN ORDERS */}

        {currentUser?.is_staff &&
          page ===
            "orders" && (

            <Orders
              orders={
                orders
              }

              products={
                products
              }

              pendingOrders={
                pendingOrders
              }

              confirmedOrders={
                confirmedOrders
              }

              shippedOrders={
                shippedOrders
              }

              updateOrder={
                updateOrder
              }

              getProductName={
                getProductName
              }
            />
          )}


        {/* ADMIN USERS */}

        {currentUser?.is_staff &&
          page ===
            "users" && (

            <Users
              users={
                users
              }
            />
          )}


        {/* CUSTOMER MY ORDERS */}

        {!currentUser?.is_staff &&
          page ===
            "my-orders" && (

            <MyOrders
              orders={
                orders
              }

              products={
                products
              }

              getProductName={
                getProductName
              }
            />
          )}

      </main>

    </div>
  );
}

export default App;
