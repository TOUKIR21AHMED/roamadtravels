import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const AdminProduct = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    slug: "",
    price: "",
    details: "",
    stock: "",
    status: "active",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/product-categories`);
        setCategories(res.data.filter((cat) => cat.status === "active"));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

      data.append("categoryId", formData.categoryId);
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("price", formData.price || 0);
      data.append("details", formData.details);
      data.append("stock", formData.stock || 0);
      data.append("status", formData.status);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.post(`${API_BASE_URL}/api/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Product added successfully");

      setFormData({
        categoryId: "",
        name: "",
        slug: "",
        price: "",
        details: "",
        stock: "",
        status: "active",
      });

      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <h2 className="mb-4">Add Product</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Category</label>

            <select
              name="categoryId"
              className="form-select"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Name</label>

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
            <label className="form-label">Slug</label>

            <input
              type="text"
              name="slug"
              className="form-control"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Image</label>

            <label
              style={{
                width: "100%",
                minHeight: "240px",
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
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "240px",
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

                  <h5
                    style={{
                      fontWeight: 800,
                      color: "#1D3815",
                    }}
                  >
                    Upload Product Image
                  </h5>

                  <p
                    style={{
                      color: "#6b7467",
                      marginBottom: 0,
                    }}
                  >
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
            <label className="form-label">Price</label>

            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Stock</label>

            <input
              type="number"
              name="stock"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Details</label>

            <textarea
              name="details"
              className="form-control"
              rows="5"
              value={formData.details}
              onChange={handleChange}
              required
            ></textarea>
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

          <button
            type="submit"
            className="btn btn-success rounded-pill px-4"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProduct;