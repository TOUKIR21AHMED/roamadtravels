import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";
function EditDistrict() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [divisions, setDivisions] = useState([]);
  const [formData, setFormData] = useState({
    divisionId: "",
    nameBn: "",
    slug: "",
    image: "",
    shortDescription: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDivisions();
    fetchDistrict();
  }, []);

  const fetchDivisions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/divisions`);
      setDivisions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDistrict = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/districts`);
      const found = res.data.find((item) => item._id === id);

      if (found) {
        setFormData({
          divisionId: found.divisionId?._id || found.divisionId,
          nameBn: found.nameBn,
          slug: found.slug,
          image: found.image,
          shortDescription: found.shortDescription,
        });
      }
    } catch (error) {
      console.log(error);
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
      await axios.put(`${API_BASE_URL}/api/districts/${id}`, formData);
      setMessage("District updated successfully");

      setTimeout(() => {
        navigate("/admin/manage-districts");
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage("Failed to update district");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "60px 15px" }}>
      <div className="container">
        <div className="bg-white shadow rounded p-4" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="mb-4 text-center" style={{ color: "#1D3815" }}>Edit District</h2>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Division</label>
              <select
                className="form-select"
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
              <label className="form-label">District Name</label>
              <input
                type="text"
                className="form-control"
                name="nameBn"
                value={formData.nameBn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-control"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-control"
                rows="5"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-12 text-center">
              <button className="btn btn-success rounded-pill px-4">
                Update District
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditDistrict;