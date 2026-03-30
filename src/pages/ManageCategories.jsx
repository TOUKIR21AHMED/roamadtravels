import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/product-categories`);
      setCategories(res.data);
    } catch (error) {
      setMessage("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/product-categories/${id}`);
      setMessage("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Categories</h2>
          <Link to="/admin-category" className="btn btn-success rounded-pill">
            Add Category
          </Link>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td>
                    <td>{cat.name}</td>
                    <td>{cat.slug}</td>
                    <td>
                      <span
                        className={`badge ${
                          cat.status === "active" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/edit-category/${cat._id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No category found
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

export default ManageCategories;