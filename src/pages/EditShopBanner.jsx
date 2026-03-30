import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";
const EditShopBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    serial: "",
    status: "active",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/shop-banners/${id}`);

        setFormData({
          title: res.data.title || "",
          image: res.data.image || "",
          serial: res.data.serial ?? "",
          status: res.data.status || "active",
        });
      } catch (error) {
        setMessage("Failed to load banner data");
      }
    };

    fetchBanner();
  }, [id]);

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
      await axios.put(`${API_BASE_URL}/api/shop-banners/${id}`, {
        ...formData,
        serial: Number(formData.serial || 0),
      });

      navigate("/manage-shop-banners");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update banner");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <h2 className="mb-4">Edit Shop Banner</h2>

        {message && <div className="alert alert-danger">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Banner Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter banner title"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Banner Image URL</label>
            <input
              type="text"
              name="image"
              className="form-control"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter banner image URL"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Serial</label>
            <input
              type="number"
              name="serial"
              className="form-control"
              value={formData.serial}
              onChange={handleChange}
              placeholder="Enter serial number"
            />
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
            Update Banner
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditShopBanner;