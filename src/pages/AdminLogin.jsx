import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      

      const res = await axios.post(
        `${API_BASE_URL}/api/admin-auth/login`,
        formData
      );

      localStorage.setItem(
        "adminToken",
        res.data.token
      );

      localStorage.setItem(
        "adminData",
        JSON.stringify(res.data.admin)
      );

      const role = res.data.admin.role;

      if (role === "super_admin") {
        navigate("/super-admin");
      } else if (role === "shop_admin") {
        navigate("/shop-admin");
      } else {
        navigate("/tourism-admin");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          padding: "40px",
          borderRadius: "20px",
          color: "#fff",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.8s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "700",
          }}
        >
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-control mb-3"
            style={{
              height: "50px",
              borderRadius: "12px",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control mb-4"
            style={{
              height: "50px",
              borderRadius: "12px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn w-100"
            style={{
              height: "50px",
              borderRadius: "12px",
              background: "#00c853",
              color: "#fff",
              fontWeight: "600",
              border: "none",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;