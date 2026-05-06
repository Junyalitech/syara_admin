import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  // Fetch all orders (Admin)
  const fetchOrders = async (pageNumber = 1, searchQuery = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/getorders?page=${pageNumber}&search=${searchQuery}`
      );

      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);

    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, search);
  }, [page, search]);

  const markAsDelivered = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/delivered`
      );

      // refresh orders
      fetchOrders(page, search);

    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong. Please try again.");
    }
    finally {
      setUpdatingId(null);
    }
  };


  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toLowerCase();
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>All Orders</h2>

        <input
          type="text"
          placeholder="Search by name / phone / order id..."
          value={search}
          onChange={(e) => {
            setPage(1); // reset page
            setSearch(e.target.value);
          }}
          className="search-input"
        />
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Address</th>
              <th>Order Date</th>
              {/* <th>Expected Delivery</th> */}
              <th>Delivery Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="order-loading">
                  Loading orders...
                </td>
              </tr>

            ) : orders.length === 0 ? (
              <p className="empty">No orders found</p>
            ) : orders.map((order) => (
              <tr key={order.orderId}>
                <td>#{order.orderId}</td>
                <td>{order.User.name} <br />
                  {order.User.phone}
                </td>
                <td>{order.OrderItems.map((item) => (
                  <div key={item.itemId} style={{ marginBottom: '12px' }}>
                    {item?.Product?.productName}  ({item.quantity})
                    Package : {item.package} <br />
                    Price: ₹{item.package == '1Kg' ? item.Product.packeoption1kgrate : item.Product.packeoption500gmrate}
                  </div>
                ))}</td>
                <td>
                  <span
                    className={
                      order.orderStatus === "delivered"
                        ? "status delivered"
                        : "status pending"
                    }
                  >
                    {order.orderStatus === "delivered"
                      ? "Delivered"
                      : "Processing"}
                  </span>
                </td>
                <td>₹{order.grandTotal}</td>
                <td>{order.paymentType}</td>

                <td>{order.address}</td>
                <td style={{ textTransform: 'capitalize' }}>{formatDate(order.createdAt)}</td>

                {/* <td>{new Date(order.deliveryTime).toLocaleDateString()}</td> */}
                <td style={{ textTransform: 'capitalize' }}>
                  {order.orderStatus === "delivered"
                    ? formatDate(order.deliveryTime)
                    : `${formatDate(order.deliveryTime)} (expected)`}
                </td>
                <td>
                  <button
                    className="deliver-btn"
                    disabled={order.orderStatus === "delivered" || updatingId === order.orderId}
                    onClick={() => markAsDelivered(order.orderId)}
                  >
                    {updatingId === order.orderId
                      ? "Updating..."
                      : order.orderStatus === "delivered"
                        ? "Delivered"
                        : "Mark Delivered"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1 || loading}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>


      </div>
    </div>
  );
};

export default Orders;