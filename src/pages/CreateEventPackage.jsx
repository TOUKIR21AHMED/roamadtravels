import axios from "axios";
import { useState } from "react";
import API_BASE_URL from "../config";

const categories = [
  "Attractions & Shows",
  "Activities & Experiences",
  "Sightseeing & Day-Tours",
  "Day-Out Packages",
  "Adventure",
];

const durations = [
  "Less than 6 hours",
  "6 - 12 hours",
  "12 - 24 hours",
  "24+ hours",
];

const timeSlots = ["00-06", "06-12", "12-18", "18-00"];

export default function CreateEventPackage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Sightseeing & Day-Tours",
    location: "",
    country: "Bangladesh",
    mainImage: "",
    galleryImages: "",
    duration: "",
    durationFilter: "24+ hours",
    timeSlot: "06-12",
    minimumPeople: "",
    priceBdt: "",
    priceUsd: "",
    currencyDefault: "BDT",
    shortDescription: "",
    overview: "",
    locationDetails: "",
    timingDetails: "",
    description: "",
    mapEmbedUrl: "",
    cancellationPolicy: "",
    refundPolicy: "",
    inclusions: "",
    exclusions: "",
    requirements: "",
    facilities: "",
    additionalInfo: "",
    travelTips: "",
    isFeatured: false,
    isPublished: true,
  });

  const [itinerary, setItinerary] = useState([
    { dayTitle: "Day 1", location: "", time: "", details: "" },
  ]);

  const [options, setOptions] = useState([
    { title: "", priceBdt: "", priceUsd: "", details: "" },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const splitLines = (text) => {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        priceBdt: Number(form.priceBdt),
        priceUsd: Number(form.priceUsd || 0),
        galleryImages: splitLines(form.galleryImages),
        inclusions: splitLines(form.inclusions),
        exclusions: splitLines(form.exclusions),
        requirements: splitLines(form.requirements),
        facilities: splitLines(form.facilities),
        additionalInfo: splitLines(form.additionalInfo),
        travelTips: splitLines(form.travelTips),
        itinerary,
        options: options.filter((op) => op.title.trim()),
      };

      await axios.post(`${API_BASE_URL}/api/event-packages`, payload);

      alert("Event Package Created Successfully ✅");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-admin-page">
      <style>{`
        .event-admin-page {
          min-height: 100vh;
          background: #f3f8f1;
          padding: 35px 18px;
        }

        .event-admin-container {
          max-width: 1180px;
          margin: auto;
          background: rgba(255,255,255,0.96);
          border-radius: 28px;
          box-shadow: 0 22px 60px rgba(0,0,0,0.09);
          overflow: hidden;
        }

        .event-admin-header {
          padding: 28px;
          background: linear-gradient(135deg, #1d5c09, #66b80f);
          color: white;
        }

        .event-admin-header h2 {
          margin: 0;
          font-weight: 900;
        }

        .event-admin-header p {
          margin: 8px 0 0;
          opacity: 0.9;
        }

        .event-admin-body {
          padding: 28px;
        }

        .event-section {
          background: #ffffff;
          border: 1px solid #e6efe3;
          border-radius: 22px;
          padding: 22px;
          margin-bottom: 22px;
        }

        .event-section-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1D3815;
          margin-bottom: 18px;
        }

        .form-label {
          font-weight: 700;
          color: #1D3815;
          margin-bottom: 7px;
        }

        .form-control,
        .form-select {
          border-radius: 14px;
          min-height: 46px;
          border: 1px solid #dce8d7;
        }

        textarea.form-control {
          min-height: 110px;
        }

        .hint {
          font-size: 0.82rem;
          color: #6b7467;
          margin-top: 5px;
        }

        .mini-card {
          background: #f8fcf6;
          border: 1px dashed #bad7ae;
          border-radius: 18px;
          padding: 16px;
          margin-bottom: 14px;
        }

        .submit-btn {
          border: none;
          width: 100%;
          background: #277f0d;
          color: white;
          padding: 15px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 1rem;
        }

        .submit-btn:disabled {
          opacity: 0.65;
        }
      `}</style>

      <div className="event-admin-container">
        <div className="event-admin-header">
          <h2>Create Events & Packages</h2>
          <p>Premium dynamic event/package upload system for admin.</p>
        </div>

        <form className="event-admin-body" onSubmit={handleSubmit}>
          <div className="event-section">
            <div className="event-section-title">Basic Information</div>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Title</label>
                <input
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Kandy, Nuwara Eliya, Bentota & Colombo - 5 Days"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  className="form-control"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Sri Lanka / Cox's Bazar / Sajek"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input
                  name="country"
                  className="form-control"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Images</div>

            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">Main Image URL</label>
                <input
                  name="mainImage"
                  className="form-control"
                  value={form.mainImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Gallery Images URL</label>
                <textarea
                  name="galleryImages"
                  className="form-control"
                  value={form.galleryImages}
                  onChange={handleChange}
                  placeholder="One image URL per line"
                />
                <div className="hint">Prottek line e ekta image URL diba.</div>
              </div>
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Pricing & Timing</div>

            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">BDT Price</label>
                <input
                  name="priceBdt"
                  type="number"
                  className="form-control"
                  value={form.priceBdt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">USD Price</label>
                <input
                  name="priceUsd"
                  type="number"
                  className="form-control"
                  value={form.priceUsd}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Default Currency</label>
                <select
                  name="currencyDefault"
                  className="form-select"
                  value={form.currencyDefault}
                  onChange={handleChange}
                >
                  <option>BDT</option>
                  <option>USD</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Duration Text</label>
                <input
                  name="duration"
                  className="form-control"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="5 days"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Duration Filter</label>
                <select
                  name="durationFilter"
                  className="form-select"
                  value={form.durationFilter}
                  onChange={handleChange}
                >
                  {durations.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Time Slot</label>
                <select
                  name="timeSlot"
                  className="form-select"
                  value={form.timeSlot}
                  onChange={handleChange}
                >
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Minimum People</label>
                <input
                  name="minimumPeople"
                  className="form-control"
                  value={form.minimumPeople}
                  onChange={handleChange}
                  placeholder="Minimum 2 people"
                />
              </div>
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Main Content</div>

            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">Short Description</label>
                <textarea
                  name="shortDescription"
                  className="form-control"
                  value={form.shortDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Overview</label>
                <textarea
                  name="overview"
                  className="form-control"
                  value={form.overview}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location Details</label>
                <textarea
                  name="locationDetails"
                  className="form-control"
                  value={form.locationDetails}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Timing Details</label>
                <textarea
                  name="timingDetails"
                  className="form-control"
                  value={form.timingDetails}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Itinerary</div>

            {itinerary.map((item, index) => (
              <div className="mini-card" key={index}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      placeholder="Day 1"
                      value={item.dayTitle}
                      onChange={(e) => {
                        const copy = [...itinerary];
                        copy[index].dayTitle = e.target.value;
                        setItinerary(copy);
                      }}
                    />
                  </div>

                  <div className="col-md-3">
                    <input
                      className="form-control"
                      placeholder="Location"
                      value={item.location}
                      onChange={(e) => {
                        const copy = [...itinerary];
                        copy[index].location = e.target.value;
                        setItinerary(copy);
                      }}
                    />
                  </div>

                  <div className="col-md-2">
                    <input
                      className="form-control"
                      placeholder="12:00 AM"
                      value={item.time}
                      onChange={(e) => {
                        const copy = [...itinerary];
                        copy[index].time = e.target.value;
                        setItinerary(copy);
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <textarea
                      className="form-control"
                      placeholder="Day details"
                      value={item.details}
                      onChange={(e) => {
                        const copy = [...itinerary];
                        copy[index].details = e.target.value;
                        setItinerary(copy);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() =>
                setItinerary([
                  ...itinerary,
                  {
                    dayTitle: `Day ${itinerary.length + 1}`,
                    location: "",
                    time: "",
                    details: "",
                  },
                ])
              }
            >
              + Add Day
            </button>
          </div>

          <div className="event-section">
            <div className="event-section-title">List Based Information</div>

            <div className="row g-3">
              {[
                ["inclusions", "Inclusions"],
                ["exclusions", "Exclusions"],
                ["requirements", "Requirements"],
                ["facilities", "Facilities"],
                ["additionalInfo", "Additional Information"],
                ["travelTips", "Travel Tips"],
              ].map(([name, label]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <textarea
                    name={name}
                    className="form-control"
                    value={form[name]}
                    onChange={handleChange}
                    placeholder="One item per line"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Policy</div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Cancellation Policy</label>
                <textarea
                  name="cancellationPolicy"
                  className="form-control"
                  value={form.cancellationPolicy}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Refund Policy</label>
                <textarea
                  name="refundPolicy"
                  className="form-control"
                  value={form.refundPolicy}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Free Map Embed URL</label>
                <input
                  name="mapEmbedUrl"
                  className="form-control"
                  value={form.mapEmbedUrl}
                  onChange={handleChange}
                  placeholder="OpenStreetMap iframe src URL"
                />
              </div>
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Options</div>

            {options.map((op, index) => (
              <div className="mini-card" key={index}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      placeholder="Option title"
                      value={op.title}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[index].title = e.target.value;
                        setOptions(copy);
                      }}
                    />
                  </div>

                  <div className="col-md-2">
                    <input
                      className="form-control"
                      placeholder="BDT"
                      type="number"
                      value={op.priceBdt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[index].priceBdt = Number(e.target.value);
                        setOptions(copy);
                      }}
                    />
                  </div>

                  <div className="col-md-2">
                    <input
                      className="form-control"
                      placeholder="USD"
                      type="number"
                      value={op.priceUsd}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[index].priceUsd = Number(e.target.value);
                        setOptions(copy);
                      }}
                    />
                  </div>

                  <div className="col-md-5">
                    <textarea
                      className="form-control"
                      placeholder="Option details"
                      value={op.details}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[index].details = e.target.value;
                        setOptions(copy);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() =>
                setOptions([
                  ...options,
                  { title: "", priceBdt: "", priceUsd: "", details: "" },
                ])
              }
            >
              + Add Option
            </button>
          </div>

          <div className="event-section">
            <div className="row">
              <div className="col-md-6">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="me-2"
                  />
                  Featured
                </label>
              </div>

              <div className="col-md-6">
                <label>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="me-2"
                  />
                  Published
                </label>
              </div>
            </div>
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Event Package"}
          </button>
        </form>
      </div>
    </div>
  );
}