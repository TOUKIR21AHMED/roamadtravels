import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function Visa() {
  const [formData, setFormData] = useState({
    type: "visa",
    name: "",
    email: "",
    phone: "",
    destination: "",
    visaType: "Tourist Visa",
    processingType: "Normal",
    travelDate: "",
    passportNumber: "",
    message: "",
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocuments = (e) => {
    setDocuments(Array.from(e.target.files || []));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      documents.forEach((file) => {
        data.append("documents", file);
      });

      const res = await axios.post(`${API_BASE_URL}/api/inquiries`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message || "Visa request submitted successfully");

      setFormData({
        type: "visa",
        name: "",
        email: "",
        phone: "",
        destination: "",
        visaType: "Tourist Visa",
        processingType: "Normal",
        travelDate: "",
        passportNumber: "",
        message: "",
      });

      setDocuments([]);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f4f8f2,#dfead8)",
        padding: "80px 15px",
      }}
    >
      <a
        href="https://wa.me/8801336082503"
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",
          right: "22px",
          bottom: "90px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "#25D366",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          textDecoration: "none",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          zIndex: 999,
        }}
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1
              style={{
                fontSize: "52px",
                fontWeight: "800",
                color: "#1D3815",
              }}
            >
              Visa Processing Support
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#50604b",
                lineHeight: "1.8",
              }}
            >
              Submit your visa request with passport information and documents.
              Our team will contact you personally for visa assistance and processing.
            </p>

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "22px",
                boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
                marginTop: "25px",
              }}
            >
              <h4
                style={{
                  color: "#1D3815",
                  fontWeight: "700",
                }}
              >
                Need quick help?
              </h4>

              <p
                style={{
                  marginBottom: 0,
                  color: "#667",
                }}
              >
                WhatsApp us directly at <strong>01336082503</strong>.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <form
              onSubmit={submitForm}
              style={{
                background: "rgba(255,255,255,0.9)",
                padding: "35px",
                borderRadius: "26px",
                boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
                animation: "floatForm 3s ease-in-out infinite",
              }}
            >
              <h3
                style={{
                  color: "#1D3815",
                  fontWeight: "800",
                  marginBottom: "25px",
                }}
              >
                Request Visa Support
              </h3>

              <input
                className="form-control mb-3"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-3"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-3"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                className="form-control mb-3"
                name="destination"
                placeholder="Destination Country"
                value={formData.destination}
                onChange={handleChange}
              />

              <select
                className="form-select mb-3"
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
              >
                <option>Tourist Visa</option>
                <option>Student Visa</option>
                <option>Work Visa</option>
                <option>Business Visa</option>
                <option>Medical Visa</option>
              </select>

              <select
                className="form-select mb-3"
                name="processingType"
                value={formData.processingType}
                onChange={handleChange}
              >
                <option>Normal</option>
                <option>Urgent</option>
                <option>Super Fast</option>
              </select>

              <input
                className="form-control mb-3"
                name="passportNumber"
                placeholder="Passport Number"
                value={formData.passportNumber}
                onChange={handleChange}
              />

              <input
                className="form-control mb-3"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleChange}
              />

              <textarea
                className="form-control mb-3"
                name="message"
                rows="4"
                placeholder="Tell us your visa details..."
                value={formData.message}
                onChange={handleChange}
              />

              <label className="form-label fw-bold">
                Upload Documents
              </label>

              <input
                className="form-control mb-2"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,image/*"
                onChange={handleDocuments}
              />

              {documents.length > 0 && (
                <div className="mb-3">
                  {documents.map((file, index) => (
                    <small
                      key={index}
                      className="d-block text-muted"
                    >
                      {index + 1}. {file.name}
                    </small>
                  ))}
                </div>
              )}

              <button
                className="btn w-100"
                disabled={loading}
                style={{
                  background: "#1D3815",
                  color: "#fff",
                  height: "52px",
                  borderRadius: "999px",
                  fontWeight: "700",
                }}
              >
                {loading ? "Submitting..." : "Submit Visa Request"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatForm {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

export default Visa;