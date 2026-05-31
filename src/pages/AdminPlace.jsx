import axios from "axios";
import { useEffect, useState } from "react";
import PlaceRichTextEditor from "../components/PlaceRichTextEditor";
import API_BASE_URL from "../config";
function AdminPlace() {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
  districtId: "",
  nameBn: "",
  shortDescription: "",
  fullDescription: "",
  locationBn: "",
  weatherLocationEn: "",
});

const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/districts`);
        setDistricts(res.data);
      } catch (error) {
        console.log("District fetch error:", error);
      }
    };

    fetchDistricts();
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

data.append("districtId", formData.districtId);
data.append("nameBn", formData.nameBn);
data.append("shortDescription", formData.shortDescription);
data.append("fullDescription", formData.fullDescription);
data.append("locationBn", formData.locationBn);
data.append("weatherLocationEn", formData.weatherLocationEn);

if (imageFile) {
  data.append("image", imageFile);
}

await axios.post(`${API_BASE_URL}/api/places`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      setMessage("Place added successfully");

      setFormData({
        districtId: "",
        nameBn: "",
        image: "",
        shortDescription: "",
        fullDescription: "",
        locationBn: "",
        weatherLocationEn: "",
      });
    } catch (error) {
      console.log("Place add error:", error);
      setMessage("Failed to add place");
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
          max-width: 950px;
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

        .place-rich-editor .ql-toolbar.ql-snow{
          border: 1px solid #d8e2d2;
          border-bottom: none;
          border-radius: 14px 14px 0 0;
          background: #f7fbf5;
        }

        .place-rich-editor .ql-container.ql-snow{
          border: 1px solid #d8e2d2;
          border-radius: 0 0 14px 14px;
          min-height: 220px;
          font-size: 16px;
          font-family: inherit;
        }

        .place-rich-editor .ql-editor{
          min-height: 220px;
          line-height: 1.85;
          color: #24331d;
        }

        .place-rich-editor .ql-editor.ql-blank::before{
          color: #86928a;
          font-style: normal;
          left: 15px;
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
        <h2 className="admin-form-title">Add Place</h2>

        {message && <div className="admin-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="admin-label">District</label>
            <select
              className="admin-select"
              name="districtId"
              value={formData.districtId}
              onChange={handleChange}
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.nameBn}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="admin-label">Place Name (Bangla)</label>
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
  <label className="admin-label">Place Image</label>

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
          Upload Place Image
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

          <div className="col-md-6">
            <label className="admin-label">Location (Bangla)</label>
            <input
              type="text"
              className="admin-input"
              name="locationBn"
              value={formData.locationBn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="admin-label">Weather Location English</label>
            <input
              type="text"
              className="admin-input"
              name="weatherLocationEn"
              value={formData.weatherLocationEn}
              onChange={handleChange}
              placeholder="Cox's Bazar / Dhaka / Sylhet / Bandarban / Chittagong"
            />
            <small style={{ color: "#60705b", display: "block", marginTop: 6 }}>
              আবহাওয়ার জন্য ইংরেজিতে লোকেশন দিন, যেমন Cox's Bazar / Dhaka / Sylhet।
            </small>
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

          <div className="col-12">
            <label className="admin-label">Full Description</label>
            <PlaceRichTextEditor
              value={formData.fullDescription}
              onChange={(content) =>
                setFormData((current) => ({
                  ...current,
                  fullDescription: content,
                }))
              }
              placeholder="পূর্ণ বিবরণ লিখুন, শিরোনাম, তালিকা, লিংক, রঙ সবকিছু যোগ করতে পারবেন"
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="admin-btn">
              Add Place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPlace;