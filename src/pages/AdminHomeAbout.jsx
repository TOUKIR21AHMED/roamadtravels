import axios from "axios";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

function AdminHomeAbout() {
  const [form, setForm] = useState({
    sectionLabel: "",
    titleBeforeHighlight: "",
    highlightedTitle: "",
    paragraphOne: "",
    paragraphTwo: "",
    features: "",
    buttonText: "",
    buttonLink: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  const getImageUrl = (img) => resolveImageUrl(img);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/home-about`);
        const data = res.data;

        setForm({
          sectionLabel: data.sectionLabel || "",
          titleBeforeHighlight: data.titleBeforeHighlight || "",
          highlightedTitle: data.highlightedTitle || "",
          paragraphOne: data.paragraphOne || "",
          paragraphTwo: data.paragraphTwo || "",
          features: Array.isArray(data.features) ? data.features.join("\n") : "",
          buttonText: data.buttonText || "",
          buttonLink: data.buttonLink || "",
        });

        setImagePreview(getImageUrl(data.image));
      } catch (error) {
        setMessage("Failed to load about section");
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      Object.keys(form).forEach((key) => {
        if (key === "features") {
          const featuresArray = form.features
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);

          data.append("features", JSON.stringify(featuresArray));
        } else {
          data.append(key, form[key]);
        }
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`${API_BASE_URL}/api/home-about`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Home About section updated successfully ✅");
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "40px 15px" }}>
      <div className="container">
        <div className="bg-white shadow rounded-4 p-4" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 className="mb-4" style={{ color: "#1D3815", fontWeight: 900 }}>
            Manage Home About Section
          </h2>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Section Label</label>
              <input
                name="sectionLabel"
                className="form-control"
                value={form.sectionLabel}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Title Before Highlight</label>
              <input
                name="titleBeforeHighlight"
                className="form-control"
                value={form.titleBeforeHighlight}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Highlighted Title</label>
              <input
                name="highlightedTitle"
                className="form-control"
                value={form.highlightedTitle}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Paragraph One</label>
              <textarea
                name="paragraphOne"
                className="form-control"
                rows="4"
                value={form.paragraphOne}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Paragraph Two</label>
              <textarea
                name="paragraphTwo"
                className="form-control"
                rows="4"
                value={form.paragraphTwo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Features</label>
              <textarea
                name="features"
                className="form-control"
                rows="8"
                value={form.features}
                onChange={handleChange}
                placeholder="One feature per line"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">About Image</label>

              <label
                style={{
                  width: "100%",
                  height: 260,
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
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-center">
                    <div style={{ fontSize: 42, color: "#277f0d" }}>+</div>
                    <h5>Upload About Image</h5>
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

            <div className="col-md-6">
              <label className="form-label fw-bold">Button Text</label>
              <input
                name="buttonText"
                className="form-control"
                value={form.buttonText}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Button Link</label>
              <input
                name="buttonLink"
                className="form-control"
                value={form.buttonLink}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button className="btn btn-success rounded-pill px-5 py-3 fw-bold">
                Update About Section
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminHomeAbout;