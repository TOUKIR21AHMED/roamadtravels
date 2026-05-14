import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

export default function ManageEventPackages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/event-packages?published=all&limit=100`
      );
      setItems(res.data.items || []);
    } catch (error) {
      console.log("Fetch event packages error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event package?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/event-packages/${id}`);
      fetchItems();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const togglePublish = async (item) => {
    try {
      await axios.put(`${API_BASE_URL}/api/event-packages/${item._id}`, {
        isPublished: !item.isPublished,
      });
      fetchItems();
    } catch (error) {
      console.log(error);
      alert("Status update failed");
    }
  };

  return (
    <div className="manage-event-page">
      <style>{`
        .manage-event-page {
          min-height: 100vh;
          background: #f3f8f1;
          padding: 35px 18px;
        }

        .manage-event-container {
          max-width: 1200px;
          margin: auto;
          background: white;
          border-radius: 28px;
          box-shadow: 0 20px 55px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .manage-event-header {
          background: linear-gradient(135deg, #1d5c09, #66b80f);
          color: white;
          padding: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .manage-event-header h2 {
          margin: 0;
          font-weight: 900;
        }

        .create-btn {
          background: white;
          color: #1d5c09;
          padding: 11px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 800;
        }

        .manage-event-body {
          padding: 24px;
        }

        .event-table-wrap {
          overflow-x: auto;
        }

        .event-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 14px;
        }

        .event-table th {
          color: #1D3815;
          font-size: 0.9rem;
          padding: 10px;
          white-space: nowrap;
        }

        .event-table td {
          background: #f9fcf8;
          padding: 14px 10px;
          vertical-align: middle;
          border-top: 1px solid #e4eee0;
          border-bottom: 1px solid #e4eee0;
        }

        .event-table td:first-child {
          border-left: 1px solid #e4eee0;
          border-radius: 16px 0 0 16px;
        }

        .event-table td:last-child {
          border-right: 1px solid #e4eee0;
          border-radius: 0 16px 16px 0;
        }

        .event-thumb {
          width: 90px;
          height: 65px;
          object-fit: cover;
          border-radius: 12px;
        }

        .event-title {
          font-weight: 800;
          color: #1D3815;
          min-width: 220px;
        }

        .event-small {
          font-size: 0.85rem;
          color: #63705d;
          margin-top: 4px;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .published {
          background: #e8f8df;
          color: #277f0d;
        }

        .unpublished {
          background: #fff1d6;
          color: #b26b00;
        }

        .action-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 210px;
        }

        .action-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.84rem;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
        }

        .view-btn {
          background: #eef8ea;
          color: #277f0d;
        }

        .edit-btn {
          background: #eaf3ff;
          color: #0b5ed7;
        }

        .toggle-btn {
          background: #fff3cd;
          color: #8a6200;
        }

        .delete-btn {
          background: #ffe7e7;
          color: #dc3545;
        }

        .skeleton-row {
          height: 90px;
          background: linear-gradient(90deg, #eef4eb, #ffffff, #eef4eb);
          background-size: 200% 100%;
          animation: skeletonMove 1.1s infinite linear;
          border-radius: 18px;
          margin-bottom: 14px;
        }

        @keyframes skeletonMove {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 576px) {
          .manage-event-page {
            padding: 20px 10px;
          }

          .manage-event-header {
            padding: 22px;
          }

          .manage-event-body {
            padding: 14px;
          }
        }
      `}</style>

      <div className="manage-event-container">
        <div className="manage-event-header">
          <div>
            <h2>Manage Events & Packages</h2>
            <p className="mb-0">Edit, publish, unpublish and delete packages.</p>
          </div>

          <Link to="/admin/create-event-package" className="create-btn">
            + Create New
          </Link>
        </div>

        <div className="manage-event-body">
          {loading ? (
            <>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <h4>No event package found</h4>
              <Link to="/admin/create-event-package" className="create-btn">
                Create First Event
              </Link>
            </div>
          ) : (
            <div className="event-table-wrap">
              <table className="event-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Package</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
  src={
    item.mainImage?.startsWith("http")
      ? item.mainImage
      : `${API_BASE_URL}${item.mainImage}`
  }
  alt={item.title}
  className="event-thumb"
/>
                      </td>

                      <td>
                        <div className="event-title">{item.title}</div>
                        <div className="event-small">
                          <i className="fa fa-map-marker-alt me-1"></i>
                          {item.location}
                        </div>
                        <div className="event-small">{item.duration}</div>
                      </td>

                      <td>{item.category}</td>

                      <td>
                        <strong>BDT {Number(item.priceBdt).toLocaleString()}</strong>
                        {item.priceUsd > 0 && (
                          <div className="event-small">
                            USD {Number(item.priceUsd).toLocaleString()}
                          </div>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            item.isPublished ? "published" : "unpublished"
                          }`}
                        >
                          {item.isPublished ? "Published" : "Unpublished"}
                        </span>
                      </td>

                      <td>
                        <div className="action-group">
                          <Link
                            to={`/events-packages/${item.slug}`}
                            className="action-btn view-btn"
                          >
                            View
                          </Link>

                          <Link
                            to={`/admin/edit-event-package/${item._id}`}
                            className="action-btn edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="action-btn toggle-btn"
                            onClick={() => togglePublish(item)}
                          >
                            {item.isPublished ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}