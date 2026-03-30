import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageShopBanners = () => {
  const [banners, setBanners] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/shop-banners");
      setBanners(res.data || []);
    } catch (error) {
      setMessage("Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this banner?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/shop-banners/${id}`);
      setMessage("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete banner");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Shop Banners</h2>
          <Link to="/admin-shop-banner" className="btn btn-success rounded-pill">
            Add Banner
          </Link>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Serial</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.length > 0 ? (
                banners.map((banner, index) => (
                  <tr key={banner._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={banner.image}
                        alt={banner.title || "Banner"}
                        style={{
                          width: "120px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </td>
                    <td>{banner.title || "No title"}</td>
                    <td>{banner.serial}</td>
                    <td>
                      <span
                        className={`badge ${
                          banner.status === "active" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {banner.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/edit-shop-banner/${banner._id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(banner._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageShopBanners;