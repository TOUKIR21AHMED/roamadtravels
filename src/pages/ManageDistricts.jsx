import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function ManageDistricts() {
  const [districts, setDistricts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/districts");
      setDistricts(res.data);
    } catch (error) {
      console.log("District fetch error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("তুমি কি district delete করতে চাও?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/districts/${id}`);
      setMessage("District deleted successfully");
      fetchDistricts();
    } catch (error) {
      console.log("Delete error:", error);
      setMessage("Failed to delete district");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "60px 15px" }}>
      <div className="container">
        <h2 className="mb-4" style={{ color: "#1D3815", fontWeight: "700" }}>
          Manage Districts
        </h2>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          {districts.map((district) => (
            <div className="col-lg-4 col-md-6 mb-4" key={district._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={district.image}
                  alt={district.nameBn}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>{district.nameBn}</h5>
                  <p>
                    <strong>Division:</strong> {district.divisionId?.nameBn}
                  </p>
                  <p>{district.shortDescription}</p>
                  
                  <div className="d-flex gap-2">
  <Link
    to={`/admin/edit-district/${district._id}`}
    className="btn btn-warning rounded-pill px-4"
  >
    Edit
  </Link>

  <button
    onClick={() => handleDelete(district._id)}
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

export default ManageDistricts;