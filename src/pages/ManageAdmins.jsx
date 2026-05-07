import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin-auth/admins`, {
        headers: {
          authorization: token,
        },
      });

      setAdmins(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/api/admin-auth/admins/${id}`, {
        headers: {
          authorization: token,
        },
      });

      alert(res.data.message);
      fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: "50px 15px" }}>
      <div className="container">
        <h2 style={{ color: "#1D3815", fontWeight: "700" }} className="mb-4">
          Manage Admins
        </h2>

        <div className="table-responsive bg-white rounded shadow-sm p-3">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-bordered align-middle">
              <thead className="table-success">
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.name}</td>
                    <td>{admin.username}</td>
                    <td>
                      <span className="badge bg-dark">{admin.role}</span>
                    </td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td>
  <Link
    to={`/edit-admin/${admin._id}`}
    className="btn btn-primary btn-sm me-2"
  >
    Edit
  </Link>

  {admin.role === "super_admin" ? (
    <span className="text-muted">Protected</span>
  ) : (
    <button
      onClick={() => deleteAdmin(admin._id)}
      className="btn btn-danger btn-sm"
    >
      Delete
    </button>
  )}
</td>
                  </tr>
                ))}

                {admins.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;