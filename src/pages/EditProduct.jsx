import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const getImageUrl = (img) => resolveImageUrl(img);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products/${id}`),
          axios.get(`${API_BASE_URL}/api/product-categories`),
        ]);

        const product = productRes.data;

        setFormData({
          categoryId: product.categoryId?._id || "",
          name: product.name || "",
          slug: product.slug || "",
          price: product.price || "",
          details: product.details || "",
          stock: product.stock || "",
          status: product.status || "active",
        });

        setImagePreview(getImageUrl(product.image));

        setCategories(categoryRes.data);
      } catch (error) {
        setMessage("Failed to load product data");
      }
    };

    fetchAllData();
  }, [id]);

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
      data.append("price", Number(formData.price));
      data.append("details", formData.details);
      data.append("stock", Number(formData.stock || 0));
      data.append("status", formData.status);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`${API_BASE_URL}/api/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/manage-products");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <h2 className="mb-4">Edit Product</h2>

        {message && <div className="alert alert-danger">{message}</div>}

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

          <div className="mb-3">
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
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;