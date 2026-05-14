import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function FlightRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFileUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/inquiries`);

      const flightRequests = (res.data || []).filter(
        (item) => item.type === "flight"
      );

      setRequests(flightRequests);
    } catch (error) {
      console.log("Flight requests fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

const updateStatus = async (id, status) => {
  try {
    await axios.put(`${API_BASE_URL}/api/inquiries/${id}/status`, {
      status,
    });

    setRequests((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status } : item
      )
    );
  } catch (error) {
    alert(error.response?.data?.message || "Status update failed");
  }
};
  return (
    <div className="flight-admin-page">
      <style>{`
      .status-action-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.86rem;
}

.status-pill.pending {
  background: #fff3cd;
  color: #8a6200;
}

.status-pill.booked {
  background: #e8f8df;
  color: #277f0d;
}

.status-pill.canceled {
  background: #ffe7e7;
  color: #dc3545;
}

.book-btn,
.cancel-btn {
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 900;
}

.book-btn {
  background: #277f0d;
  color: white;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}
        .flight-admin-page {
          min-height: 100vh;
          background: #f4f8f2;
          padding: 35px 15px;
        }

        .flight-admin-card {
          max-width: 1250px;
          margin: auto;
          background: #fff;
          border-radius: 26px;
          box-shadow: 0 20px 55px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .flight-admin-header {
          background: linear-gradient(135deg, #1D3815, #66b80f);
          color: white;
          padding: 28px;
        }

        .flight-admin-header h2 {
          font-weight: 900;
          margin: 0;
        }

        .flight-admin-body {
          padding: 24px;
        }

        .request-box {
          background: #f9fcf8;
          border: 1px solid #e2eddd;
          border-radius: 22px;
          padding: 20px;
          margin-bottom: 18px;
        }

        .request-title {
          color: #1D3815;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .info-item {
          background: white;
          border-radius: 14px;
          padding: 12px;
          border: 1px solid #edf3ea;
        }

        .info-item small {
          display: block;
          color: #697466;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .info-item strong {
          color: #1D3815;
          word-break: break-word;
        }

        .document-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .doc-link {
          background: #277f0d;
          color: white;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 0.85rem;
        }

        .doc-link:hover {
          background: #1D3815;
          color: white;
        }

        .message-box {
          background: #fff;
          border: 1px solid #edf3ea;
          border-radius: 14px;
          padding: 14px;
          margin-top: 12px;
          color: #4f5a4a;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="flight-admin-card">
        <div className="flight-admin-header">
          <h2>Flight Booking Requests</h2>
          <p className="mb-0">All flight request form submissions from users.</p>
        </div>

        <div className="flight-admin-body">
          {loading ? (
            <h5 className="text-center py-5">Loading requests...</h5>
          ) : requests.length === 0 ? (
            <div className="text-center py-5">
              <h4>No flight request found</h4>
            </div>
          ) : (
            requests.map((item) => (
              <div className="request-box" key={item._id}>
                <h4 className="request-title">
                  <i className="fa fa-plane me-2"></i>
                  {item.name || "Unknown User"}
                </h4>

                <div className="info-grid">
                  <div className="info-item">
                    <small>Trip Type</small>
                    <strong>{item.tripType || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>Email</small>
                    <strong>{item.email || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>Phone</small>
                    <strong>{item.phone || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>From</small>
                    <strong>{item.from || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>To / Destination</small>
                    <strong>{item.destination || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>Travel Date</small>
                    <strong>{item.travelDate || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>Return Date</small>
                    <strong>{item.returnDate || "N/A"}</strong>
                  </div>

                  <div className="info-item">
                    <small>Submitted At</small>
                    <strong>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="message-box">
                  <strong>Additional Notes:</strong>
                  <p className="mb-0 mt-2">{item.message || "N/A"}</p>
                </div>
                <div className="status-action-row">
  <span className={`status-pill ${item.status || "pending"}`}>
    Status: {(item.status || "pending").toUpperCase()}
  </span>

  <button
    type="button"
    className="book-btn"
    onClick={() => updateStatus(item._id, "booked")}
    disabled={item.status === "booked"}
  >
    Book
  </button>

  <button
    type="button"
    className="cancel-btn"
    onClick={() => updateStatus(item._id, "canceled")}
    disabled={item.status === "canceled"}
  >
    Cancel
  </button>
</div>

                {item.documents?.length > 0 && (
                  <>
                    <h6 className="mt-3 fw-bold">Uploaded Documents</h6>

                    <div className="document-list">
                      {item.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={getFileUrl(doc.path)}
                          target="_blank"
                          rel="noreferrer"
                          className="doc-link"
                        >
                          View Document {index + 1}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FlightRequestsAdmin;