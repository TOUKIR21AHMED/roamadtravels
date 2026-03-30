import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
function ManagePlaces() {
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/places`);
      setPlaces(res.data);
    } catch (error) {
      console.log("Place fetch error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("তুমি কি place delete করতে চাও?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/places/${id}`);
      setMessage("Place deleted successfully");
      fetchPlaces();
    } catch (error) {
      console.log("Delete error:", error);
      setMessage("Failed to delete place");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "60px 15px" }}>
      <div className="container">
        <h2 className="mb-4" style={{ color: "#1D3815", fontWeight: "700" }}>
          Manage Places
        </h2>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          {places.map((place) => (
            <div className="col-lg-4 col-md-6 mb-4" key={place._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={place.image}
                  alt={place.nameBn}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>{place.nameBn}</h5>
                  <p>
                    <strong>District:</strong> {place.districtId?.nameBn}
                  </p>
                  <p>{place.shortDescription}</p>
                  <div className="d-flex gap-2">
  <Link
    to={`/admin/edit-place/${place._id}`}
    className="btn btn-warning rounded-pill px-4"
  >
    Edit
  </Link>

  <button
    onClick={() => handleDelete(place._id)}
    className="btn btn-danger rounded-pill px-4"
  >
    Delete
  </button>
</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagePlaces;