import React from "react";
import { Link, useNavigate } from "react-router-dom";

function SuperAdminDashboard() {

  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("adminData")
  );

  const handleLogout = () => {

    localStorage.removeItem("adminToken");

    localStorage.removeItem("adminData");

    navigate("/admin");
  };

  const cardStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
    height: "100%",
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#eef5eb",
        padding: "40px 20px",
      }}
    >

      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-5">

          <div>

            <h2
              style={{
                color: "#1D3815",
                fontWeight: "700",
              }}
            >
              Super Admin Panel
            </h2>

            <p>
              Welcome,
              {" "}
              <strong>
                {admin?.name}
              </strong>
            </p>

          </div>
          

          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>

        </div>

        <div className="row g-4">

          <div className="col-md-4">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Create Admin
              </h4>

              <Link
                to="/create-admin"
                className="btn btn-success"
              >
                Open
              </Link>

            </div>

          </div>

          <div className="col-md-4">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Shop Management
              </h4>

              <Link
                to="/shop-admin"
                className="btn btn-dark"
              >
                Open
              </Link>

            </div>

          </div>

          <div className="col-md-4">

            <div style={cardStyle}>

              <h4 className="mb-3">
                Tourism Management
              </h4>

              <Link
                to="/tourism-admin"
                className="btn btn-primary"
              >
                Open
              </Link>

            </div>

          </div>
          <div className="col-md-4">

  <div style={cardStyle}>

    <h4 className="mb-3">
      Admin Shop Stats
    </h4>

    <Link
      to="/admin-dashboard"
      className="btn btn-success"
    >
      Open
    </Link>

  </div>

</div>
          <div className="col-md-4">
  <div style={cardStyle}>
    <h4 className="mb-3">Manage Admins</h4>
    <Link to="/manage-admins" className="btn btn-warning">
      Open
    </Link>
  </div>
</div>

        </div>

      </div>

    </div>
  );
}

export default SuperAdminDashboard;