import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contact-messages`);
      setMessages(res.data || []);
    } catch (error) {
      console.log("Contact messages fetch error:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    await axios.put(`${API_BASE_URL}/api/contact-messages/${id}/read`);
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await axios.delete(`${API_BASE_URL}/api/contact-messages/${id}`);
    fetchMessages();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8f2", padding: 35 }}>
      <div className="container">
        <div className="bg-white shadow rounded-4 p-4">
          <h2 style={{ color: "#1D3815", fontWeight: 900 }}>
            Contact Messages
          </h2>

          <div className="table-responsive mt-4">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.subject}</td>
                    <td>{item.message}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === "read" ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => markRead(item._id)}
                      >
                        Read
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMessage(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {messages.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No message found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactMessagesAdmin;