import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function CreateAdmin() {

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "shop_admin",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const res = await axios.post(
        `${API_BASE_URL}/api/admin-auth/create-admin`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      alert(res.data.message);

      setFormData({
        name: "",
        username: "",
        password: "",
        role: "shop_admin",
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#eef5eb",
        padding: "40px",
      }}
    >

      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >

        <h2
          style={{
            marginBottom: "30px",
            color: "#1D3815",
            fontWeight: "700",
          }}
        >
          Create New Admin
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label>Name</label>

            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">

            <label>Username</label>

            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">

            <label>Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">

            <label>Role</label>

            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="shop_admin">
                Shop Admin
              </option>

              <option value="tourism_admin">
                Tourism Admin
              </option>

            </select>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-100"
            style={{
              height: "50px",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >

            {loading
              ? "Creating..."
              : "Create Admin"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateAdmin;