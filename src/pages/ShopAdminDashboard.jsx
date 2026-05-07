import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ShopAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin");
  };

  const cardStyle = {
    border: "1px solid #dfe8d8",
    borderRadius: "18px",
    padding: "30px 20px",
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    height: "100%",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "60px 15px" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 style={{ color: "#1D3815", fontWeight: "700" }}>Shop Admin Dashboard</h1>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div style={cardStyle}>
              <h4 className="mb-3">Shop Stats</h4>
              <Link to="/admin-dashboard" className="btn btn-success rounded-pill px-4">
                Open
              </Link>
            </div>
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

export default ShopAdminDashboard;