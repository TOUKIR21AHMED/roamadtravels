import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";

function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    districtId: "",
    nameBn: "",
    shortDescription: "",
    fullDescription: "",
    locationBn: "",
  });

  const [message, setMessage] = useState("");

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${API_BASE_URL}${img}`;
  };

  useEffect(() => {
    fetchDistricts();
    fetchPlace();
  }, []);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/districts`);
      setDistricts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlace = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/places`);
      const found = res.data.find((item) => item._id === id);

      if (found) {
        setFormData({
          districtId: found.districtId?._id || found.districtId,
          nameBn: found.nameBn,
          shortDescription: found.shortDescription,
          fullDescription: found.fullDescription,
          locationBn: found.locationBn,
        });

        setImagePreview(getImageUrl(found.image));
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

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`${API_BASE_URL}/api/places/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Place updated successfully");

      setTimeout(() => {
        navigate("/admin/manage-places");
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage("Failed to update place");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f2",
        padding: "60px 15px",
      }}
    >
      <div className="container">
        <div
          className="bg-white shadow rounded p-4"
          style={{ maxWidth: "950px", margin: "0 auto" }}
        >
          <h2
            className="mb-4 text-center"
            style={{ color: "#1D3815" }}
          >
            Edit Place
          </h2>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">District</label>

              <select
                className="form-select"
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
              <label className="form-label">Place Name</label>

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
              <label className="form-label">Place Image</label>

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

                    <h5
                      style={{
                        fontWeight: 800,
                        color: "#1D3815",
                      }}
                    >
                      Upload Place Image
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

            <div className="col-md-6">
              <label className="form-label">Location</label>

              <input
                type="text"
                className="form-control"
                name="locationBn"
                value={formData.locationBn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Short Description</label>

              <textarea
                className="form-control"
                rows="3"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label">Full Description</label>

              <textarea
                className="form-control"
                rows="6"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-12 text-center">
              <button className="btn btn-success rounded-pill px-4">
                Update Place
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPlace;