import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {

  const orderId = "ROA" + Date.now().toString().slice(-6);

  return (
    <div className="container py-5 text-center">

      <h1 className="text-success">✔ Order Confirmed</h1>

      <h5 className="mt-3">Order ID: {orderId}</h5>

      <p className="mt-3">
        Your order has been received successfully.
      </p>

      <Link to="/shop" className="btn btn-success mt-3">
        Continue Shopping
      </Link>

    </div>
  );
};

export default OrderSuccess;