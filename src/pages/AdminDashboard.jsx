import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const cardStyle = {
    border: "1px solid #dfe8d8",
    borderRadius: "18px",
    padding: "30px 20px",
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    height: "100%",
  };

  const topButtonStyle = {
    display: "inline-block",
    background: "#1D3815",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(29, 56, 21, 0.18)",
    transition: "0.3s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "60px 15px" }}>
      <div className="container">
        <h1 style={{ color: "#1D3815", fontWeight: "700" }} className="mb-3 text-center">
          Admin Dashboard
        </h1>

        <div className="text-center mb-5">
          <Link to="/admin-dashboard" style={topButtonStyle}>
            Admin Shop Stats
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Add District</h4>
              <Link to="/admin/district" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Add Place</h4>
              <Link to="/admin/place" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Manage Districts</h4>
              <Link to="/admin/manage-districts" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Manage Places</h4>
              <Link to="/admin/manage-places" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-12 mt-4">
            <h3
              className="text-center"
              style={{ color: "#1D3815", fontWeight: "700", marginBottom: "10px" }}
            >
              Shop Management
            </h3>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Add Category</h4>
              <Link to="/admin-category" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Manage Categories</h4>
              <Link to="/manage-categories" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Add Product</h4>
              <Link to="/admin-product" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Manage Products</h4>
              <Link to="/manage-products" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Manage Orders</h4>
              <Link to="/manage-orders" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Add Shop Banner</h4>
    <Link to="/admin-shop-banner" className="btn btn-success rounded-pill px-4">
      Open
    </Link>
  </div>
</div>

<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Manage Shop Banners</h4>
    <Link to="/manage-shop-banners" className="btn btn-success rounded-pill px-4">
      Open
    </Link>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;