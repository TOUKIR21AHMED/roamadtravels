import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const AdminShopBanner = () => {
  const [formData, setFormData] = useState({
    title: "",
    serial: "",
    status: "active",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("serial", formData.serial || 0);
      data.append("status", formData.status);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.post(`${API_BASE_URL}/api/shop-banners`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Banner added successfully");

      setFormData({
        title: "",
        serial: "",
        status: "active",
      });

      setImageFile(null);
      setImagePreview("");
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
            <label className="form-label">Banner Image</label>

            <label
              style={{
                width: "100%",
                minHeight: "260px",
                border: "2px dashed #9fcf8e",
                borderRadius: "20px",
                background: "#f8fff4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Banner Preview"
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#277f0d",
                      color: "#fff",
                      margin: "0 auto 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      fontWeight: 900,
                    }}
                  >
                    +
                  </div>

                  <h5 style={{ fontWeight: 800, color: "#1D3815" }}>
                    Upload Banner Image
                  </h5>

                  <p style={{ color: "#6b7467", marginBottom: 0 }}>
                    Click here and choose image from your PC
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                required
              />
            </label>
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