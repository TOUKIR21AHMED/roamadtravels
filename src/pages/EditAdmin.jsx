import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";

function EditAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "shop_admin",
    password: "",
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin-auth/admins`, {
          headers: { authorization: token },
        });

        const selectedAdmin = res.data.find((admin) => admin._id === id);

        if (!selectedAdmin) {
          alert("Admin not found");
          navigate("/manage-admins");
          return;
        }

        setFormData({
          name: selectedAdmin.name,
          username: selectedAdmin.username,
          role: selectedAdmin.role,
          password: "",
        });
      } catch (error) {
        alert("Failed to load admin");
      }
    };

    fetchAdmin();
  }, [id, navigate, token]);

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
        `${API_BASE_URL}/api/admin-auth/admins/${id}`,
        formData,
        {
          headers: { authorization: token },
        }
      );

      alert(res.data.message);
      navigate("/manage-admins");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "50px 15px" }}>
      <div className="container">
        <div
          style={{
            maxWidth: "600px",
            margin: "auto",
            background: "#fff",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#1D3815", fontWeight: "700" }} className="mb-4">
            Edit Admin
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

            <div className="mb-3">
              <label>Role</label>
              <select
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="shop_admin">Shop Admin</option>
                <option value="tourism_admin">Tourism Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep old password"
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Update Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAdmin;