import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const ShopCheckout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    district: "",
    address: "",
    email: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [paymentData, setPaymentData] = useState({
    bkashLast3Digits: "",
    transactionId: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("shop_cart_items");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const subTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shipping = 110;
  const total = subTotal + shipping;

  const updateQty = (id, type) => {
    const updated = cartItems.map((item) => {
      if (item.productId === id) {
        if (type === "inc") return { ...item, quantity: item.quantity + 1 };
        if (type === "dec" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    setCartItems(updated);
    localStorage.setItem("shop_cart_items", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.productId !== id);
    setCartItems(updated);
    localStorage.setItem("shop_cart_items", JSON.stringify(updated));
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentInput = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const isValidPhone = (phone) => {
    return /^01\d{9}$/.test(phone);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateBilling = () => {
    if (!formData.customerName.trim()) {
      setMessage("Please enter your full name");
      return false;
    }

    if (!formData.phone.trim()) {
      setMessage("Please enter your phone number");
      return false;
    }

    if (!isValidPhone(formData.phone.trim())) {
      setMessage("Phone number must be exactly 11 digits and start with 01");
      return false;
    }

    if (!formData.district.trim()) {
      setMessage("Please enter your district");
      return false;
    }

    if (!formData.address.trim()) {
      setMessage("Please enter your full address");
      return false;
    }

    if (!formData.email.trim()) {
      setMessage("Please enter your email");
      return false;
    }

    if (!isValidEmail(formData.email.trim())) {
      setMessage("Please enter a valid email address");
      return false;
    }

    if (!cartItems.length) {
      setMessage("Your cart is empty");
      return false;
    }

    return true;
  };

  const submitOrder = async (extraPaymentData = {}) => {
    try {
      const payload = {
        ...formData,
        paymentMethod,
        ...extraPaymentData,
        cartItems,
        subTotal,
        shipping,
        total,
      };

      await axios.post(`${API}/api/orders`, payload);

      localStorage.removeItem("shop_cart_items");
      setCartItems([]);
      setShowPayment(false);
      setMessage("");
      navigate("/order-success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Order failed");
    }
  };

 const openPayment = async () => {
  setMessage("");

  if (!validateBilling()) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (paymentMethod === "cod") {
    await submitOrder({
      bkashLast3Digits: "N/A",
      transactionId: "COD",
    });
    return;
  }

  if (paymentMethod === "bkash" || paymentMethod === "nagad") {
    setShowPayment(true);
  }
};

  const confirmOrder = async () => {
    if (!paymentData.bkashLast3Digits.trim()) {
      setMessage(
        paymentMethod === "bkash"
          ? "Please enter the last 3 digits of your bKash number"
          : "Please enter the last 3 digits of your Nagad number"
      );
      return;
    }

    if (!paymentData.transactionId.trim()) {
      setMessage("Please enter transaction ID");
      return;
    }

    await submitOrder({
      bkashLast3Digits: paymentData.bkashLast3Digits.trim(),
      transactionId: paymentData.transactionId.trim(),
    });
  };

  const paymentTheme =
    paymentMethod === "bkash"
      ? {
          brand: "bKash",
          sendTo: "01710022087",
          bg: "linear-gradient(135deg, #e2136e, #c10f5f)",
          soft: "#fff0f6",
          button: "#e2136e",
          note: "#8a1648",
        }
      : {
          brand: "Nagad",
          sendTo: "01710022087",
          bg: "linear-gradient(135deg, #f97316, #ea580c)",
          soft: "#fff7ed",
          button: "#f97316",
          note: "#9a3412",
        };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Checkout</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row g-4">
        {/* Billing Form */}
        <div className="col-lg-6">
          <div className="card p-4 shadow-sm rounded-4 border-0">
            <h5 className="mb-3 fw-bold">Billing Information</h5>

            <input
              name="customerName"
              placeholder="Full Name"
              className="form-control mb-3"
              value={formData.customerName}
              onChange={handleInput}
            />

            <input
              name="phone"
              placeholder="Phone Number (11 digits)"
              className="form-control mb-3"
              value={formData.phone}
              onChange={handleInput}
            />

            <input
              name="district"
              placeholder="District"
              className="form-control mb-3"
              value={formData.district}
              onChange={handleInput}
            />

            <textarea
              name="address"
              placeholder="Full Address"
              className="form-control mb-3"
              value={formData.address}
              onChange={handleInput}
              rows="3"
            />

            <input
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleInput}
            />

            <textarea
              name="note"
              placeholder="Order note (optional)"
              className="form-control"
              value={formData.note}
              onChange={handleInput}
              rows="3"
            />
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-lg-6">
          <div className="card p-4 shadow-sm rounded-4 border-0">
            <h5 className="mb-3 fw-bold">Your Order</h5>

            {cartItems.length === 0 ? (
              <div className="alert alert-light border text-center rounded-4">
                Your cart is empty
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="d-flex align-items-center mb-3 p-3 rounded-4"
                    style={{ background: "#f8f9fb" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />

                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1 fw-bold">{item.name}</h6>
                      <p className="mb-2 text-success fw-bold">৳ {item.price}</p>

                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => updateQty(item.productId, "dec")}
                        >
                          -
                        </button>

                        <span className="px-2">{item.quantity}</span>

                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => updateQty(item.productId, "inc")}
                        >
                          +
                        </button>

                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="p-4 rounded-4 mt-3"
                  style={{ background: "#eef8fb", border: "1px solid #cfe8ef" }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span>Sub-total:</span>
                    <strong>৳ {subTotal}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <strong>৳ {shipping}</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0 fw-bold">Total:</h5>
                    <h5 className="mb-0 fw-bold text-success">৳ {total}</h5>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="mt-4">
                  <h5 className="mb-3 fw-bold">Payment Method</h5>

                  <div className="d-flex flex-column gap-3">
                    <label
                      className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Cash on Delivery</span>
                    </label>

                    <label
                      className={`payment-option ${paymentMethod === "bkash" ? "active bkash" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={paymentMethod === "bkash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Pay with bKash</span>
                    </label>

                    <label
                      className={`payment-option ${paymentMethod === "nagad" ? "active nagad" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={paymentMethod === "nagad"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Pay with Nagad</span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-success w-100 mt-4 py-3 fw-bold" onClick={openPayment}>
                  Confirm Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div
                className="p-4 text-white text-center"
                style={{ background: paymentTheme.bg }}
              >
                <h4 className="mb-2 fw-bold">Confirm {paymentTheme.brand} Payment</h4>
                <p className="mb-0">
                  Send Money to: <strong>{paymentTheme.sendTo}</strong>
                </p>
              </div>

              <div className="p-4" style={{ background: paymentTheme.soft }}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Last 3 digits of your {paymentTheme.brand} number
                  </label>
                  <input
                    name="bkashLast3Digits"
                    placeholder="e.g. 076"
                    className="form-control"
                    value={paymentData.bkashLast3Digits}
                    onChange={handlePaymentInput}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Transaction ID</label>
                  <input
                    name="transactionId"
                    placeholder="e.g. TX12345"
                    className="form-control"
                    value={paymentData.transactionId}
                    onChange={handlePaymentInput}
                  />
                </div>

                <p
                  className="small mb-4"
                  style={{ color: paymentTheme.note, lineHeight: "1.6" }}
                >
                  Please ensure the transaction is successful before submitting.
                </p>

                <button
                  className="btn w-100 text-white fw-bold"
                  style={{
                    background: paymentTheme.button,
                    border: "none",
                    padding: "12px 18px",
                  }}
                  onClick={confirmOrder}
                >
                  Submit Payment
                </button>

                <button
                  className="btn btn-light w-100 mt-2 fw-semibold"
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .payment-option{
          display:flex;
          align-items:center;
          gap:10px;
          padding:16px 18px;
          border:1px solid #e5e7eb;
          border-radius:16px;
          background:#fff;
          cursor:pointer;
          transition:0.3s;
          font-weight:600;
        }

        .payment-option:hover{
          border-color:#b7d6bf;
          box-shadow:0 8px 20px rgba(0,0,0,0.05);
        }

        .payment-option.active{
          border-color:#1D3815;
          background:#f3fbf3;
        }

        .payment-option.active.bkash{
          border-color:#e2136e;
          background:#fff0f6;
        }

        .payment-option.active.nagad{
          border-color:#f97316;
          background:#fff7ed;
        }

        .payment-option input{
          transform:scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ShopCheckout;