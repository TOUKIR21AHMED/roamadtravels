import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
function AdminPlace() {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    districtId: "",
    nameBn: "",
    image: "",
    shortDescription: "",
    fullDescription: "",
    locationBn: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/districts`);
      setDistricts(res.data);
    } catch (error) {
      console.log("District fetch error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/places`, formData);

      setMessage("Place added successfully");

      setFormData({
        districtId: "",
        nameBn: "",
        image: "",
        shortDescription: "",
        fullDescription: "",
        locationBn: "",
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
            <label className="admin-label">Image URL</label>
            <input
              type="text"
              className="admin-input"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
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
            <textarea
              className="admin-textarea"
              name="fullDescription"
              rows="6"
              value={formData.fullDescription}
              onChange={handleChange}
              required
            ></textarea>
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