import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
const AdminShopBanner = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    serial: "",
    status: "active",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API_BASE_URL}/api/shop-banners`, {
        ...formData,
        serial: Number(formData.serial || 0),
      });

      setMessage("Banner added successfully");
      setFormData({
        title: "",
        image: "",
        serial: "",
        status: "active",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add banner");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <h2 className="mb-4">Add Shop Banner</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Banner Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter banner title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Banner Image URL</label>
            <input
              type="text"
              name="image"
              className="form-control"
              placeholder="Enter banner image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Serial</label>
            <input
              type="number"
              name="serial"
              className="form-control"
              placeholder="Enter serial number"
              value={formData.serial}
              onChange={handleChange}
            />
            <small className="text-muted">
              Smaller serial will show first in carousel
            </small>
          </div>

          <div className="mb-4">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success rounded-pill px-4">
            Add Banner
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminShopBanner;