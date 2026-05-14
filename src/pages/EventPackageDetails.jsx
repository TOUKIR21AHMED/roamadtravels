import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

const tabs = ["Details", "Itinerary", "Options", "Policy"];

export default function EventPackageDetails() {
  const { slug } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [activeTab, setActiveTab] = useState("Details");
  const [currency, setCurrency] = useState("BDT");
  const [submitting, setSubmitting] = useState(false);

  const [request, setRequest] = useState({
    firstName: "",
    lastName: "",
    phoneCode: "+880",
    phone: "",
    email: "",
    journeyDate: "",
    additionalRequirement: "",
  });

  useEffect(() => {
    const fetchSingle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/event-packages/${slug}`);
        setItem(res.data);
        setActiveImg(res.data.mainImage);
        setCurrency(res.data.currencyDefault || "BDT");
      } catch (error) {
        console.log("Single event package fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingle();
  }, [slug]);

  const gallery = useMemo(() => {
    if (!item) return [];
    return [item.mainImage, ...(item.galleryImages || [])].filter(Boolean);
  }, [item]);

  const price = currency === "USD"
    ? `$${Number(item?.priceUsd || 0).toLocaleString()}`
    : `৳${Number(item?.priceBdt || 0).toLocaleString()}`;

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  const submitConsultation = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/event-requests`, {
        ...request,
        requestType: "consultation",
        eventPackageId: item._id,
        destination: item.title,
      });

      alert("Request submitted successfully ✅");
      setRequest({
        firstName: "",
        lastName: "",
        phoneCode: "+880",
        phone: "",
        email: "",
        journeyDate: "",
        additionalRequirement: "",
      });
    } catch (error) {
      console.log(error);
      alert("Request submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <style>{skeletonStyle}</style>
        <div className="container py-5">
          <div className="details-skeleton hero"></div>
          <div className="row g-4 mt-3">
            <div className="col-lg-8">
              <div className="details-skeleton block"></div>
            </div>
            <div className="col-lg-4">
              <div className="details-skeleton side"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-5 text-center">
        <h3>Event package not found</h3>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <style>{`
        ${skeletonStyle}

        .event-details-page {
          background: #f5f8f2;
          min-height: 100vh;
          color: #1D3815;
        }

        .details-hero {
          background:
            linear-gradient(rgba(17, 48, 8, 0.6), rgba(17, 48, 8, 0.52)),
            url('${
  item.mainImage?.startsWith("http")
    ? item.mainImage
    : `${API_BASE_URL}${item.mainImage}`
}');
          background-size: cover;
          background-position: center;
          padding: 90px 0 80px;
          color: white;
        }

        .details-hero h1 {
          font-size: 2.8rem;
          font-weight: 950;
          max-width: 900px;
          margin-bottom: 14px;
        }

        .details-hero-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-weight: 800;
          opacity: 0.95;
        }

        .details-card {
          background: white;
          border-radius: 26px;
          box-shadow: 0 14px 38px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .gallery-main {
          width: 100%;
          height: 430px;
          object-fit: cover;
          display: block;
        }

        .gallery-thumbs {
          display: flex;
          gap: 12px;
          padding: 16px;
          overflow-x: auto;
          background: #fff;
        }

        .gallery-thumb {
          width: 96px;
          height: 70px;
          object-fit: cover;
          border-radius: 14px;
          cursor: pointer;
          border: 3px solid transparent;
        }

        .gallery-thumb.active {
          border-color: #277f0d;
        }

        .content-card {
          padding: 26px;
          margin-top: 24px;
        }

        .details-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .details-tab {
          border: none;
          background: #eef8ea;
          color: #1D3815;
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 900;
        }

        .details-tab.active {
          background: #277f0d;
          color: white;
        }

        .section-heading {
          font-size: 1.35rem;
          font-weight: 950;
          margin: 22px 0 12px;
        }

        .details-text {
          color: #566151;
          line-height: 1.85;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin: 18px 0;
        }

        .info-box {
          background: #f8fcf6;
          border: 1px solid #e1eddd;
          border-radius: 18px;
          padding: 16px;
        }

        .info-box small {
          display: block;
          color: #6c7668;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .info-box strong {
          color: #1D3815;
        }

        .list-box {
          background: #f8fcf6;
          border: 1px solid #e1eddd;
          border-radius: 18px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .list-box ul {
          padding-left: 20px;
          margin: 0;
        }

        .list-box li {
          margin-bottom: 9px;
          color: #566151;
        }

        .itinerary-item {
          position: relative;
          padding-left: 30px;
          margin-bottom: 22px;
          border-left: 3px solid #dcefd5;
        }

        .itinerary-dot {
          position: absolute;
          left: -10px;
          top: 0;
          width: 18px;
          height: 18px;
          background: #277f0d;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 3px #dcefd5;
        }

        .itinerary-title {
          font-weight: 950;
          font-size: 1.1rem;
        }

        .option-card {
          border: 1px solid #e1eddd;
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 15px;
          background: #f8fcf6;
        }

        .option-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
        }

        .side-card {
          background: white;
          border-radius: 26px;
          box-shadow: 0 14px 38px rgba(0,0,0,0.08);
          padding: 24px;
          position: sticky;
          top: 20px;
        }

        .price-box {
          background: linear-gradient(135deg, #1d5c09, #66b80f);
          color: white;
          border-radius: 22px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .price-box small {
          opacity: 0.88;
          font-weight: 800;
        }

        .price-box h2 {
          font-weight: 950;
          margin: 5px 0 0;
        }

        .currency-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 18px;
        }

        .currency-btn {
          border: 1px solid #dce8d7;
          background: white;
          border-radius: 14px;
          padding: 10px;
          font-weight: 950;
          color: #1D3815;
        }

        .currency-btn.active {
          background: #277f0d;
          color: white;
        }

        .consult-input {
          width: 100%;
          border: 1px solid #dce8d7;
          border-radius: 14px;
          padding: 12px 14px;
          margin-bottom: 12px;
          outline: none;
        }

        .consult-btn {
          width: 100%;
          border: none;
          background: #277f0d;
          color: white;
          border-radius: 999px;
          padding: 13px;
          font-weight: 950;
        }

        .map-frame {
          width: 100%;
          height: 330px;
          border: 0;
          border-radius: 22px;
          margin-top: 14px;
        }

        @media (max-width: 768px) {
          .details-hero {
            padding: 65px 0 55px;
          }

          .details-hero h1 {
            font-size: 1.85rem;
          }

          .gallery-main {
            height: 260px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .side-card {
            position: static;
          }
        }
      `}</style>

      <section className="details-hero">
        <div className="container">
          <h1>{item.title}</h1>
          <div className="details-hero-meta">
            <span><i className="fa fa-map-marker-alt me-2"></i>{item.location}, {item.country}</span>
            <span><i className="fa fa-clock me-2"></i>{item.duration || item.durationFilter}</span>
            <span><i className="fa fa-tag me-2"></i>{item.category}</span>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="details-card">
              <img
  src={
    activeImg?.startsWith("http")
      ? activeImg
      : `${API_BASE_URL}${activeImg}`
  }
  alt={item.title}
  className="gallery-main"
/>

              <div className="gallery-thumbs">
                {gallery.map((img, index) => (
                  <img
                    key={index}
                    src={
  img?.startsWith("http")
    ? img
    : `${API_BASE_URL}${img}`
}
                    alt=""
                    className={`gallery-thumb ${activeImg === img ? "active" : ""}`}
                    onClick={() => setActiveImg(img)}
                  />
                ))}
              </div>
            </div>

            <div className="details-card content-card">
              <div className="details-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`details-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Details" && (
                <>
                  <div className="info-grid">
                    <div className="info-box">
                      <small>Location</small>
                      <strong>{item.location}</strong>
                    </div>
                    <div className="info-box">
                      <small>Duration</small>
                      <strong>{item.duration || item.durationFilter}</strong>
                    </div>
                    <div className="info-box">
                      <small>Minimum People</small>
                      <strong>{item.minimumPeople || "Not specified"}</strong>
                    </div>
                    <div className="info-box">
                      <small>Time Slot</small>
                      <strong>{item.timeSlot}</strong>
                    </div>
                  </div>

                  <h3 className="section-heading">Overview</h3>
                  <p className="details-text">{item.overview || item.shortDescription}</p>

                  <h3 className="section-heading">Location</h3>
                  <p className="details-text">{item.locationDetails || item.location}</p>

                  <h3 className="section-heading">Timing</h3>
                  <p className="details-text">{item.timingDetails || item.duration}</p>

                  {item.requirements?.length > 0 && (
                    <div className="list-box">
                      <h3 className="section-heading mt-0">Requirements</h3>
                      <ul>
                        {item.requirements.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  )}

                  {item.facilities?.length > 0 && (
                    <div className="list-box">
                      <h3 className="section-heading mt-0">Facilities</h3>
                      <ul>
                        {item.facilities.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  )}

                  <h3 className="section-heading">Description</h3>
                  <p className="details-text">{item.description}</p>

                  {item.additionalInfo?.length > 0 && (
                    <div className="list-box">
                      <h3 className="section-heading mt-0">Additional Information</h3>
                      <ul>
                        {item.additionalInfo.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  )}

                  {item.travelTips?.length > 0 && (
                    <div className="list-box">
                      <h3 className="section-heading mt-0">Travel Tips</h3>
                      <ul>
                        {item.travelTips.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  )}

                  {item.mapEmbedUrl && (
                    <>
                      <h3 className="section-heading">Map</h3>
                      <iframe
                        title={item.title}
                        src={item.mapEmbedUrl}
                        className="map-frame"
                        loading="lazy"
                      ></iframe>
                    </>
                  )}
                </>
              )}

              {activeTab === "Itinerary" && (
                <>
                  <h3 className="section-heading mt-0">Itinerary</h3>

                  {item.itinerary?.length > 0 ? (
                    item.itinerary.map((day, index) => (
                      <div className="itinerary-item" key={index}>
                        <span className="itinerary-dot"></span>
                        <div className="itinerary-title">{day.dayTitle}</div>
                        <div className="details-text">
                          <strong>{day.location}</strong> {day.time && `• ${day.time}`}
                        </div>
                        <p className="details-text mb-0">{day.details}</p>
                      </div>
                    ))
                  ) : (
                    <p>No itinerary added.</p>
                  )}
                </>
              )}

              {activeTab === "Options" && (
                <>
                  <h3 className="section-heading mt-0">Package Options</h3>

                  {item.options?.length > 0 ? (
                    item.options.map((op, index) => (
                      <div className="option-card" key={index}>
                        <div className="option-top">
                          <h5>{op.title}</h5>
                          <strong className="event-price">
                            {currency === "USD"
                              ? `$${Number(op.priceUsd || 0).toLocaleString()}`
                              : `৳${Number(op.priceBdt || 0).toLocaleString()}`}
                          </strong>
                        </div>
                        <p className="details-text mb-0">{op.details}</p>
                      </div>
                    ))
                  ) : (
                    <p>No options added.</p>
                  )}

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <div className="list-box">
                        <h4>Inclusions</h4>
                        <ul>
                          {(item.inclusions || []).map((x, i) => <li key={i}>{x}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="list-box">
                        <h4>Exclusions</h4>
                        <ul>
                          {(item.exclusions || []).map((x, i) => <li key={i}>{x}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Policy" && (
                <>
                  <h3 className="section-heading mt-0">Cancellation Policy</h3>
                  <p className="details-text">{item.cancellationPolicy || "No cancellation policy added."}</p>

                  <h3 className="section-heading">Refund Policy</h3>
                  <p className="details-text">{item.refundPolicy || "No refund policy added."}</p>
                </>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="side-card">
              <div className="price-box">
                <small>Starting from</small>
                <h2>{price}</h2>
              </div>

              <div className="currency-switch">
                <button
                  type="button"
                  className={`currency-btn ${currency === "BDT" ? "active" : ""}`}
                  onClick={() => setCurrency("BDT")}
                >
                  BDT
                </button>
                <button
                  type="button"
                  className={`currency-btn ${currency === "USD" ? "active" : ""}`}
                  onClick={() => setCurrency("USD")}
                >
                  USD
                </button>
              </div>

              <h4 className="section-heading mt-0">Get Consultation</h4>

              <form onSubmit={submitConsultation}>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      name="firstName"
                      className="consult-input"
                      placeholder="First Name"
                      value={request.firstName}
                      onChange={handleRequestChange}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <input
                      name="lastName"
                      className="consult-input"
                      placeholder="Last Name"
                      value={request.lastName}
                      onChange={handleRequestChange}
                    />
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-4">
                    <input
                      name="phoneCode"
                      className="consult-input"
                      value={request.phoneCode}
                      onChange={handleRequestChange}
                    />
                  </div>
                  <div className="col-8">
                    <input
                      name="phone"
                      className="consult-input"
                      placeholder="Phone"
                      value={request.phone}
                      onChange={handleRequestChange}
                      required
                    />
                  </div>
                </div>

                <input
                  name="email"
                  type="email"
                  className="consult-input"
                  placeholder="Email"
                  value={request.email}
                  onChange={handleRequestChange}
                />

                <input
                  name="journeyDate"
                  type="date"
                  className="consult-input"
                  value={request.journeyDate}
                  onChange={handleRequestChange}
                />

                <textarea
                  name="additionalRequirement"
                  className="consult-input"
                  placeholder="Additional requirement"
                  value={request.additionalRequirement}
                  onChange={handleRequestChange}
                  style={{ minHeight: 95 }}
                />

                <button className="consult-btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const skeletonStyle = `
  .event-details-page {
    background: #f5f8f2;
    min-height: 100vh;
  }

  .details-skeleton {
    background: linear-gradient(90deg, #eaf0e6, #ffffff, #eaf0e6);
    background-size: 200% 100%;
    animation: skeletonMove 1.1s infinite linear;
    border-radius: 24px;
  }

  .details-skeleton.hero {
    height: 330px;
  }

  .details-skeleton.block {
    height: 520px;
  }

  .details-skeleton.side {
    height: 430px;
  }

  @keyframes skeletonMove {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;