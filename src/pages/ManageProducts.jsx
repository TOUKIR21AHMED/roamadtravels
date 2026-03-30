import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?limit=1000`);
      setProducts(res.data.products || []);
    } catch (error) {
      setMessage("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      setMessage("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Products</h2>
          <Link to="/admin-product" className="btn btn-success rounded-pill">
            Add Product
          </Link>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.categoryId?.name || "N/A"}</td>
                    <td>৳ {product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.status === "active" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No products found
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

export default ManageProducts;