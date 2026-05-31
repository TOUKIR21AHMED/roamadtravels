import axios from "axios";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

function AdminPackageGallery() {
  const [gallery, setGallery] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getImageUrl = (img) => resolveImageUrl(img);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/package-gallery`);
      setGallery(res.data || []);
    } catch (error) {
      setMessage("Gallery fetch failed");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removePreview = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!images.length) {
      setMessage("Please select at least one image");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();
      data.append("title", title);
      data.append("location", location);

      images.forEach((file) => {
        data.append("images", file);
      });

      await axios.post(`${API_BASE_URL}/api/package-gallery`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Gallery images uploaded successfully ✅");
      setImages([]);
      setPreviews([]);
      setTitle("");
      setLocation("");
      fetchGallery();
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (item) => {
    try {
      await axios.put(`${API_BASE_URL}/api/package-gallery/${item._id}/status`, {
        isActive: !item.isActive,
      });

      fetchGallery();
    } catch (error) {
      setMessage("Status update failed");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this gallery image?");
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/package-gallery/${id}`);
      setMessage("Image deleted successfully");
      fetchGallery();
    } catch (error) {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="gallery-admin-page">
      <style>{`
        .gallery-admin-page {
          min-height: 100vh;
          background: #f4f8f2;
          padding: 40px 15px;
        }

        .gallery-admin-card {
          max-width: 1200px;
          margin: auto;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 22px 60px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .gallery-admin-header {
          padding: 28px;
          background: linear-gradient(135deg, #1D3815, #66b80f);
          color: white;
        }

        .gallery-admin-header h2 {
          font-weight: 900;
          margin: 0;
        }

        .gallery-admin-body {
          padding: 28px;
        }

        .upload-box {
          border: 2px dashed #9fcf8e;
          border-radius: 24px;
          background: #f8fff4;
          padding: 30px;
          text-align: center;
          cursor: pointer;
        }

        .upload-box input {
          display: none;
        }

        .upload-icon {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #277f0d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 30px;
          font-weight: 900;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .preview-card {
          position: relative;
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #dce8d7;
        }

        .preview-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-preview {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: #dc3545;
          color: white;
          font-weight: 900;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 18px;
          margin-top: 28px;
        }

        .gallery-item {
          background: #fff;
          border: 1px solid #e4efdf;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }

        .gallery-item-img {
          height: 180px;
          width: 100%;
          object-fit: cover;
        }

        .gallery-item-body {
          padding: 14px;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .status-badge.active {
          background: #e8f8df;
          color: #277f0d;
        }

        .status-badge.inactive {
          background: #ffe7e7;
          color: #dc3545;
        }

        .action-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .action-row button {
          flex: 1;
          border: none;
          padding: 8px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 0.82rem;
        }

        .toggle-btn {
          background: #eef8ea;
          color: #277f0d;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }
      `}</style>

      <div className="gallery-admin-card">
        <div className="gallery-admin-header">
          <h2>Package Gallery Manager</h2>
          <p className="mb-0">
            Upload unlimited gallery images. Frontend will randomly show 9 images.
          </p>
        </div>

        <div className="gallery-admin-body">
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleUpload}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Common Title</label>
                <input
                  className="form-control"
                  placeholder="Example: Cox's Bazar Tour"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Common Location</label>
                <input
                  className="form-control"
                  placeholder="Example: Cox's Bazar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="upload-box">
                  <div className="upload-icon">+</div>
                  <h5 className="fw-bold">Upload Gallery Images</h5>
                  <p className="text-muted mb-0">
                    Select multiple JPG, PNG, WEBP images from your PC
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                  />
                </label>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="preview-grid">
                {previews.map((src, index) => (
                  <div className="preview-card" key={index}>
                    <img src={src} alt="" />
                    <button
                      type="button"
                      className="remove-preview"
                      onClick={() => removePreview(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn-success rounded-pill px-5 py-3 mt-4 fw-bold"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          </form>

          <hr className="my-5" />

          <h4 className="fw-bold" style={{ color: "#1D3815" }}>
            Uploaded Gallery Images
          </h4>

          <div className="gallery-grid">
            {gallery.map((item) => (
              <div className="gallery-item" key={item._id}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="gallery-item-img"
                />

                <div className="gallery-item-body">
                  <h6 className="fw-bold mb-1">{item.title || "No title"}</h6>
                  <p className="text-muted mb-2">
                    {item.location || "No location"}
                  </p>

                  <span
                    className={`status-badge ${
                      item.isActive ? "active" : "inactive"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>

                  <div className="action-row">
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => toggleStatus(item)}
                    >
                      {item.isActive ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {gallery.length === 0 && (
              <p className="text-muted">No gallery image uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPackageGallery;