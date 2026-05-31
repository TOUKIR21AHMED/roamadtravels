import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

function EditDistrict() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [divisions, setDivisions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    divisionId: "",
    nameBn: "",
    slug: "",
    shortDescription: "",
  });

  const [message, setMessage] = useState("");

  const getImageUrl = (img) => resolveImageUrl(img);

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/divisions`);
        setDivisions(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    const loadDistrict = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/districts`);
        const found = res.data.find((item) => item._id === id);

        if (found) {
          setFormData({
            divisionId: found.divisionId?._id || found.divisionId || "",
            nameBn: found.nameBn || "",
            slug: found.slug || "",
            shortDescription: found.shortDescription || "",
          });

          setImagePreview(getImageUrl(found.image));
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadDivisions();
    loadDistrict();
  }, [id]);

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

      await axios.put(`${API_BASE_URL}/api/districts/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <h2 className="mb-4 text-center" style={{ color: "#1D3815" }}>
            Edit District
          </h2>

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
              <label className="form-label">District Image</label>

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
              <button type="submit" className="btn btn-success rounded-pill px-4">
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