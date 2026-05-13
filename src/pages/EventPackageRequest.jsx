import axios from "axios";
import { useState } from "react";
import API_BASE_URL from "../config";

export default function EventPackageRequest() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    destination: "",
    journeyDate: "",
    firstName: "",
    lastName: "",
    phoneCode: "+880",
    phone: "",
    email: "",
    additionalRequirement: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/event-requests`, {
        ...form,
        requestType: "custom-tour",
      });

      alert("Custom request submitted successfully ✅");

      setForm({
        destination: "",
        journeyDate: "",
        firstName: "",
        lastName: "",
        phoneCode: "+880",
        phone: "",
        email: "",
        additionalRequirement: "",
      });
    } catch (error) {
      console.log(error);
      alert("Request submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-request-page">
      <style>{`
        .custom-request-page {
          min-height: 100vh;
          background: #f5f8f2;
        }

        .custom-request-hero {
          background:
            linear-gradient(rgba(16, 54, 8, 0.72), rgba(16, 54, 8, 0.62)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          padding: 90px 0 70px;
          color: white;
          text-align: center;
        }

        .custom-request-hero h1 {
          font-size: 3rem;
          font-weight: 950;
          margin-bottom: 10px;
        }

        .custom-request-hero p {
          opacity: 0.95;
          font-weight: 600;
        }

        .request-shell {
          max-width: 1050px;
          margin: -45px auto 0;
          position: relative;
          z-index: 2;
        }

        .request-card {
          background: white;
          border-radius: 30px;
          box-shadow: 0 20px 55px rgba(0,0,0,0.12);
          overflow: hidden;
        }

        .request-card-top {
          padding: 28px;
          background: linear-gradient(135deg, #1d5c09, #66b80f);
          color: white;
        }

        .request-card-top h2 {
          font-weight: 950;
          margin-bottom: 6px;
        }

        .request-card-body {
          padding: 30px;
        }

        .request-label {
          font-weight: 850;
          color: #1D3815;
          margin-bottom: 8px;
        }

        .request-input {
          width: 100%;
          border: 1px solid #dce8d7;
          border-radius: 16px;
          padding: 13px 15px;
          outline: none;
          min-height: 50px;
        }

        .request-input:focus {
          border-color: #277f0d;
          box-shadow: 0 0 0 4px rgba(39,127,13,0.08);
        }

        textarea.request-input {
          min-height: 150px;
        }

        .request-submit {
          border: none;
          background: #277f0d;
          color: white;
          border-radius: 999px;
          padding: 14px 30px;
          font-weight: 950;
          min-width: 210px;
        }

        .request-submit:disabled {
          opacity: 0.65;
        }

        .request-side-box {
          background: #f8fcf6;
          border: 1px solid #e3eddf;
          border-radius: 22px;
          padding: 22px;
          height: 100%;
        }

        .request-side-box h4 {
          color: #1D3815;
          font-weight: 950;
          margin-bottom: 14px;
        }

        .request-side-box ul {
          padding-left: 18px;
          margin: 0;
        }

        .request-side-box li {
          margin-bottom: 10px;
          color: #566151;
        }

        @media (max-width: 768px) {
          .custom-request-hero h1 {
            font-size: 2rem;
          }

          .request-card-body {
            padding: 20px;
          }
        }
      `}</style>

      <section className="custom-request-hero">
        <div className="container">
          <h1>Request Custom Event</h1>
          <p>Tell us your destination, date and requirements. We will contact you soon.</p>
        </div>
      </section>

      <section className="container pb-5">
        <div className="request-shell">
          <div className="request-card">
            <div className="request-card-top">
              <h2>Build Your Own Package</h2>
              <p className="mb-0">
                Create your personalized event, day-out, tour or travel experience.
              </p>
            </div>

            <form className="request-card-body" onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="request-label">Destination / Event Location</label>
                      <input
                        name="destination"
                        className="request-input"
                        placeholder="Cox's Bazar, Sajek, Sylhet, Dhaka..."
                        value={form.destination}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="request-label">Journey Date</label>
                      <input
                        name="journeyDate"
                        type="date"
                        className="request-input"
                        value={form.journeyDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="request-label">First Name</label>
                      <input
                        name="firstName"
                        className="request-input"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="request-label">Last Name</label>
                      <input
                        name="lastName"
                        className="request-input"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="request-label">Code</label>
                      <input
                        name="phoneCode"
                        className="request-input"
                        value={form.phoneCode}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-9">
                      <label className="request-label">Phone Number</label>
                      <input
                        name="phone"
                        className="request-input"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="request-label">Email</label>
                      <input
                        name="email"
                        type="email"
                        className="request-input"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="request-label">Additional Requirement</label>
                      <textarea
                        name="additionalRequirement"
                        className="request-input"
                        placeholder="How many people, hotel type, transport, food, budget, special request..."
                        value={form.additionalRequirement}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-12">
                      <button className="request-submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="request-side-box">
                    <h4>What you can request?</h4>
                    <ul>
                      <li>Custom day-out package</li>
                      <li>Family or group tour</li>
                      <li>Corporate event arrangement</li>
                      <li>Hotel, transport and food plan</li>
                      <li>Budget based travel package</li>
                      <li>Special destination experience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}