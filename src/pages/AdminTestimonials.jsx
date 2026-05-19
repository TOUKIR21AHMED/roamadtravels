import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 5,
    message: "",
  });

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${API_BASE_URL}${img}`;
  };

  const fetchItems = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/testimonials`);
    setItems(res.data || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("location", form.location);
      data.append("rating", form.rating);
      data.append("message", form.message);

      if (imageFile) data.append("image", imageFile);

      await axios.post(`${API_BASE_URL}/api/testimonials`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Testimonial added successfully ✅");
      setForm({ name: "", location: "", rating: 5, message: "" });
      setImageFile(null);
      setPreview("");
      fetchItems();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add testimonial");
    }
  };

  const toggleStatus = async (item) => {
    await axios.put(`${API_BASE_URL}/api/testimonials/${item._id}/status`, {
      isActive: !item.isActive,
    });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await axios.delete(`${API_BASE_URL}/api/testimonials/${id}`);
    fetchItems();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: 35 }}>
      <div className="container">
        <div className="bg-white shadow rounded-4 p-4">
          <h2 style={{ color: "#1D3815", fontWeight: 900 }}>
            Manage Testimonials
          </h2>

          {message && <div className="alert alert-info mt-3">{message}</div>}

          <form onSubmit={submitForm} className="row g-3 mt-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Client Name</label>
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Location / Profession</label>
              <input
                name="location"
                className="form-control"
                value={form.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Rating</label>
              <select
                name="rating"
                className="form-select"
                value={form.rating}
                onChange={handleChange}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Client Image</label>

              <label
                style={{
                  width: "100%",
                  height: 220,
                  border: "2px dashed #9fcf8e",
                  borderRadius: 20,
                  background: "#f8fff4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-center">
                    <div style={{ fontSize: 44, color: "#277f0d" }}>+</div>
                    <h5>Upload Client Image</h5>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Client Message</label>
              <textarea
                name="message"
                rows="8"
                className="form-control"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <button className="btn btn-success rounded-pill px-5 py-3 fw-bold">
                Add Testimonial
              </button>
            </div>
          </form>

          <hr className="my-5" />

          <div className="row g-4">
            {items.map((item) => (
              <div className="col-lg-4 col-md-6" key={item._id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <img
                    src={getImageUrl(item.image) || "/assets/img/user.png"}
                    alt={item.name}
                    style={{ height: 220, objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{item.name}</h5>
                    <p className="text-muted mb-2">{item.location}</p>
                    <p>{item.message}</p>

                    <span
                      className={`badge ${
                        item.isActive ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {item.isActive ? "Active" : "Hidden"}
                    </span>

                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => toggleStatus(item)}
                      >
                        {item.isActive ? "Hide" : "Show"}
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && <p>No testimonials found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTestimonials;