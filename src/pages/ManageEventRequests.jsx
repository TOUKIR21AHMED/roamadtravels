import axios from "axios";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

const statusOptions = ["new", "contacted", "confirmed", "cancelled"];

export default function ManageEventRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/event-requests`);
      setRequests(res.data || []);
    } catch (error) {
      console.log("Event requests fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/event-requests/${id}`, { status });
      fetchRequests();
    } catch (error) {
      console.log(error);
      alert("Status update failed");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/event-requests/${id}`);
      fetchRequests();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="request-admin-page">
      <style>{`
        .request-admin-page {
          min-height: 100vh;
          background: #f3f8f1;
          padding: 35px 18px;
        }

        .request-admin-container {
          max-width: 1200px;
          margin: auto;
          background: white;
          border-radius: 28px;
          box-shadow: 0 20px 55px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .request-admin-header {
          background: linear-gradient(135deg, #1d5c09, #66b80f);
          color: white;
          padding: 28px;
        }

        .request-admin-header h2 {
          margin: 0;
          font-weight: 950;
        }

        .request-admin-body {
          padding: 24px;
        }

        .request-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .request-card {
          background: #f9fcf8;
          border: 1px solid #e2eddf;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 10px 26px rgba(0,0,0,0.04);
        }

        .request-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .request-title {
          color: #1D3815;
          font-weight: 950;
          font-size: 1.1rem;
        }

        .request-type {
          display: inline-block;
          background: #eef8ea;
          color: #277f0d;
          padding: 6px 11px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .request-info {
          color: #556150;
          margin-bottom: 8px;
          font-size: 0.94rem;
        }

        .request-info strong {
          color: #1D3815;
        }

        .request-message {
          background: white;
          border-radius: 16px;
          padding: 14px;
          color: #566151;
          line-height: 1.65;
          margin: 12px 0;
          min-height: 70px;
        }

        .status-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .status-select {
          border: 1px solid #dce8d7;
          border-radius: 999px;
          padding: 9px 12px;
          outline: none;
          font-weight: 800;
          color: #1D3815;
          background: white;
        }

        .delete-btn {
          border: none;
          background: #ffe7e7;
          color: #dc3545;
          padding: 9px 14px;
          border-radius: 999px;
          font-weight: 900;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 11px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 950;
          text-transform: capitalize;
        }

        .status-new {
          background: #eaf3ff;
          color: #0b5ed7;
        }

        .status-contacted {
          background: #fff3cd;
          color: #8a6200;
        }

        .status-confirmed {
          background: #e8f8df;
          color: #277f0d;
        }

        .status-cancelled {
          background: #ffe7e7;
          color: #dc3545;
        }

        .skeleton-request {
          height: 250px;
          border-radius: 22px;
          background: linear-gradient(90deg, #eaf0e6, #ffffff, #eaf0e6);
          background-size: 200% 100%;
          animation: skeletonMove 1.1s infinite linear;
        }

        @keyframes skeletonMove {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .request-grid {
            grid-template-columns: 1fr;
          }

          .request-admin-page {
            padding: 20px 10px;
          }

          .request-admin-body {
            padding: 16px;
          }
        }
      `}</style>

      <div className="request-admin-container">
        <div className="request-admin-header">
          <h2>Manage Event Requests</h2>
          <p className="mb-0">
            Consultation and custom event/package requests from users.
          </p>
        </div>

        <div className="request-admin-body">
          {loading ? (
            <div className="request-grid">
              <div className="skeleton-request"></div>
              <div className="skeleton-request"></div>
              <div className="skeleton-request"></div>
              <div className="skeleton-request"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-5">
              <h4>No request found</h4>
            </div>
          ) : (
            <div className="request-grid">
              {requests.map((req) => (
                <div className="request-card" key={req._id}>
                  <div className="request-top">
                    <div>
                      <div className="request-title">
                        {req.firstName} {req.lastName}
                      </div>
                      <div className="request-info mb-0">
                        {new Date(req.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <span className="request-type">
                      {req.requestType === "custom-tour"
                        ? "Custom Tour"
                        : "Consultation"}
                    </span>
                  </div>

                  <div className="request-info">
                    <strong>Destination:</strong>{" "}
                    {req.destination || req.eventPackageId?.title || "N/A"}
                  </div>

                  {req.eventPackageId?.title && (
                    <div className="request-info">
                      <strong>Package:</strong> {req.eventPackageId.title}
                    </div>
                  )}

                  <div className="request-info">
                    <strong>Date:</strong> {req.journeyDate || "Not given"}
                  </div>

                  <div className="request-info">
                    <strong>Phone:</strong> {req.phoneCode} {req.phone}
                  </div>

                  <div className="request-info">
                    <strong>Email:</strong> {req.email || "Not given"}
                  </div>

                  <div className="request-message">
                    {req.additionalRequirement || "No additional requirement."}
                  </div>

                  <span className={`status-badge status-${req.status}`}>
                    {req.status}
                  </span>

                  <div className="status-row">
                    <select
                      className="status-select"
                      value={req.status}
                      onChange={(e) => updateStatus(req._id, e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteRequest(req._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}