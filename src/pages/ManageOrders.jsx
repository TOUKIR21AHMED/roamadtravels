import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (error) {
      setMessage("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (id) => {
    const confirmDeliver = window.confirm(
      "Are you sure this product is delivered?"
    );

    if (!confirmDeliver) return;

    try {
      await axios.put(`${API_BASE_URL}/api/orders/${id}/status`, {
        orderStatus: "delivered",
        paymentStatus: "verified",
      });

      setMessage("Order marked as delivered");
      fetchOrders();

      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: "delivered",
          paymentStatus: "verified",
        }));
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? Stock will be added back."
    );

    if (!confirmCancel) return;

    try {
      await axios.put(`${API_BASE_URL}/api/orders/${id}/status`, {
        orderStatus: "cancelled",
      });

      setMessage("Order cancelled successfully");
      fetchOrders();

      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: "cancelled",
        }));
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "delivered") return "btn-success";
    if (status === "cancelled") return "btn-danger";
    return "btn-warning";
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <h2 className="mb-4">Manage Orders</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Actions</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phone}</td>
                    <td>৳ {order.total}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span
                        className={`btn btn-sm ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{order.transactionId}</td>

                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {order.orderStatus === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleDeliver(order._id)}
                            >
                              Deliver
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCancel(order._id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {order.orderStatus === "delivered" && (
                          <button className="btn btn-sm btn-success" disabled>
                            Delivered
                          </button>
                        )}

                        {order.orderStatus === "cancelled" && (
                          <button className="btn btn-sm btn-danger" disabled>
                            Cancelled
                          </button>
                        )}
                      </div>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>District:</strong> {selectedOrder.district}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Note:</strong> {selectedOrder.note || "N/A"}</p>
                <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                <p><strong>bKash Last 3 Digits:</strong> {selectedOrder.bkashLast3Digits}</p>
                <p><strong>Transaction ID:</strong> {selectedOrder.transactionId}</p>
                <p><strong>Sub Total:</strong> ৳ {selectedOrder.subTotal}</p>
                <p><strong>Shipping:</strong> ৳ {selectedOrder.shipping}</p>
                <p><strong>Total:</strong> ৳ {selectedOrder.total}</p>

                <hr />

                <h6>Ordered Products</h6>
                {selectedOrder.cartItems?.map((item, index) => (
                  <div key={index} className="border rounded-3 p-3 mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="mb-1">Price: ৳ {item.price}</p>
                        <p className="mb-1">Quantity: {item.quantity}</p>
                        <p className="mb-0">Category: {item.categoryName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                {selectedOrder.orderStatus === "pending" && (
                  <>
                    <button
                      className="btn btn-success rounded-pill"
                      onClick={() => handleDeliver(selectedOrder._id)}
                    >
                      Mark as Delivered
                    </button>

                    <button
                      className="btn btn-danger rounded-pill"
                      onClick={() => handleCancel(selectedOrder._id)}
                    >
                      Cancel Order
                    </button>
                  </>
                )}

                <button
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;