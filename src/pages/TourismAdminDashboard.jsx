import React from "react";
import { Link, useNavigate } from "react-router-dom";

function TourismAdminDashboard() {

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

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f2",
        padding: "60px 15px",
      }}
    >

      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-5">

          <h1
            style={{
              color: "#1D3815",
              fontWeight: "700",
            }}
          >
            Tourism Admin Dashboard
          </h1>
          

          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>

        </div>

        <div className="row g-4">

          <div className="col-md-6 col-lg-3">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Add District
              </h4>

              <Link
                to="/admin/district"
                className="btn btn-success rounded-pill px-4"
              >
                Open
              </Link>

            </div>

          </div>

          <div className="col-md-6 col-lg-3">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Add Place
              </h4>

              <Link
                to="/admin/place"
                className="btn btn-success rounded-pill px-4"
              >
                Open
              </Link>

            </div>

          </div>

          <div className="col-md-6 col-lg-3">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Manage Districts
              </h4>

              <Link
                to="/admin/manage-districts"
                className="btn btn-success rounded-pill px-4"
              >
                Open
              </Link>

            </div>

          </div>

          <div className="col-md-6 col-lg-3">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Manage Places
              </h4>

              <Link
                to="/admin/manage-places"
                className="btn btn-success rounded-pill px-4"
              >
                Open
              </Link>

            </div>

          </div>
          <div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Create Event Package</h4>
    <Link
      to="/admin/create-event-package"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>

<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Manage Event Packages</h4>
    <Link
      to="/admin/manage-event-packages"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>

<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Manage Event Requests</h4>
    <Link
      to="/admin/manage-event-requests"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>
<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Flight Requests</h4>
    <Link
      to="/admin/flight-requests"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>
<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Visa Requests</h4>
    <Link
      to="/admin/visa-requests"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>
<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Home About</h4>
    <Link
      to="/admin/home-about"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>
<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Package Gallery</h4>
    <Link
      to="/admin/package-gallery"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>
<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Contact Messages</h4>
    <Link
      to="/admin/contact-messages"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>
<div className="col-md-6 col-lg-3">
  <div style={cardStyle}>
    <h4 className="mb-3">Testimonials</h4>
    <Link
      to="/admin/testimonials"
      className="btn btn-success rounded-pill px-4"
    >
      Open
    </Link>
  </div>
</div>

        </div>

      </div>

    </div>
  );
}

export default TourismAdminDashboard;