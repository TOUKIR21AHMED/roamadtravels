import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";

const EditShopBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    serial: "",
    status: "active",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${API_BASE_URL}${img}`;
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/shop-banners/${id}`);

        setFormData({
          title: res.data.title || "",
          serial: res.data.serial ?? "",
          status: res.data.status || "active",
        });

        setImagePreview(getImageUrl(res.data.image));
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

      await axios.put(`${API_BASE_URL}/api/shop-banners/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
                    Click here and choose new image from your PC
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
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