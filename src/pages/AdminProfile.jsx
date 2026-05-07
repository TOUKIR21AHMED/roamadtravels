import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function AdminProfile() {
  const savedAdmin = JSON.parse(localStorage.getItem("adminData"));

  const [formData, setFormData] = useState({
    name: savedAdmin?.name || "",
    username: savedAdmin?.username || "",
    oldPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("adminToken");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/admin-auth/profile`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      localStorage.setItem("adminData", JSON.stringify(res.data.admin));
      alert(res.data.message);

      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "50px 15px" }}>
      <div className="container">
        <div
          style={{
            maxWidth: "650px",
            margin: "auto",
            background: "#fff",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#1D3815", fontWeight: "700" }} className="mb-4">
            My Profile
          </h2>

          <form onSubmit={handleUpdate}>
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

            <hr />

            <h5 className="mb-3">Change Password</h5>

            <div className="mb-3">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                className="form-control"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Required only if changing password"
              />
            </div>

            <div className="mb-4">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank if you do not want to change password"
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;