import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function AdminDistrict() {
  const [divisions, setDivisions] = useState([]);
const [formData, setFormData] = useState({
  divisionId: "",
  nameBn: "",
  slug: "",
  shortDescription: "",
});

const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/divisions`);
        setDivisions(res.data || []);
      } catch (error) {
        console.log("Division fetch error:", error);
      }
    };

    loadDivisions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
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

    try {
      const data = new FormData();

data.append("divisionId", formData.divisionId);
data.append("nameBn", formData.nameBn);
data.append("slug", formData.slug);
data.append("shortDescription", formData.shortDescription);

if (imageFile) {
  data.append("image", imageFile);
}

await axios.post(`${API_BASE_URL}/api/districts`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      setMessage("District added successfully");

      setFormData({
        divisionId: "",
        nameBn: "",
        slug: "",
        image: "",
        shortDescription: "",
      });
    } catch (error) {
      console.log("District add error:", error);
      setMessage("Failed to add district");
    }
  };

  return (
    <div className="admin-page-wrapper">
      <style>{`
        .admin-page-wrapper{
          min-height: 100vh;
          background: #f4f8f2;
          padding: 60px 15px;
        }

        .admin-form-card{
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          padding: 35px;
        }

        .admin-form-title{
          font-size: 2rem;
          font-weight: 700;
          color: #1D3815;
          margin-bottom: 25px;
          text-align: center;
        }

        .admin-label{
          font-weight: 600;
          color: #1D3815;
          margin-bottom: 8px;
          display: block;
        }

        .admin-input,
        .admin-select,
        .admin-textarea{
          width: 100%;
          border: 1px solid #d8e2d2;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          outline: none;
          transition: 0.25s ease;
          background: #fff;
        }

        .admin-input:focus,
        .admin-select:focus,
        .admin-textarea:focus{
          border-color: #277f0d;
          box-shadow: 0 0 0 3px rgba(39,127,13,0.10);
        }

        .admin-textarea{
          min-height: 130px;
          resize: vertical;
        }

        .admin-btn{
          background: #277f0d;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          transition: 0.25s ease;
        }

        .admin-btn:hover{
          background: #1d5c09;
        }

        .admin-alert{
          background: #eef8ea;
          color: #1d5c09;
          border: 1px solid #cfe2c8;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-weight: 500;
        }
      `}</style>

      <div className="admin-form-card">
        <h2 className="admin-form-title">Add District</h2>

        {message && <div className="admin-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="admin-label">Division</label>
            <select
              className="admin-select"
              name="divisionId"
              value={formData.divisionId}
              onChange={handleChange}
              required
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.nameBn}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="admin-label">District Name (Bangla)</label>
            <input
              type="text"
              className="admin-input"
              name="nameBn"
              value={formData.nameBn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="admin-label">Slug</label>
            <input
              type="text"
              className="admin-input"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="example: kishoreganj"
              required
            />
          </div>

          <div className="col-md-6">
  <label className="admin-label">District Image</label>

  <label
    style={{
      width: "100%",
      minHeight: "220px",
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
          height: "220px",
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
          Upload District Image
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

          <div className="col-12">
            <label className="admin-label">Short Description</label>
            <textarea
              className="admin-textarea"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="admin-btn">
              Add District
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminDistrict;