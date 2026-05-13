import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditEventPackage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
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

  const [itinerary, setItinerary] = useState([]);
  const [options, setOptions] = useState([]);

  const joinLines = (arr) => {
    if (!Array.isArray(arr)) return "";
    return arr.join("\n");
  };

  const splitLines = (text) => {
    return String(text || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    const fetchSingle = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/event-packages?published=all&limit=200`
        );

        const found = (res.data.items || []).find((item) => item._id === id);

        if (!found) {
          alert("Event package not found");
          navigate("/admin/manage-event-packages");
          return;
        }

        setForm({
          title: found.title || "",
          slug: found.slug || "",
          category: found.category || "Sightseeing & Day-Tours",
          location: found.location || "",
          country: found.country || "Bangladesh",
          mainImage: found.mainImage || "",
          galleryImages: joinLines(found.galleryImages),
          duration: found.duration || "",
          durationFilter: found.durationFilter || "24+ hours",
          timeSlot: found.timeSlot || "06-12",
          minimumPeople: found.minimumPeople || "",
          priceBdt: found.priceBdt || "",
          priceUsd: found.priceUsd || "",
          currencyDefault: found.currencyDefault || "BDT",
          shortDescription: found.shortDescription || "",
          overview: found.overview || "",
          locationDetails: found.locationDetails || "",
          timingDetails: found.timingDetails || "",
          description: found.description || "",
          mapEmbedUrl: found.mapEmbedUrl || "",
          cancellationPolicy: found.cancellationPolicy || "",
          refundPolicy: found.refundPolicy || "",
          inclusions: joinLines(found.inclusions),
          exclusions: joinLines(found.exclusions),
          requirements: joinLines(found.requirements),
          facilities: joinLines(found.facilities),
          additionalInfo: joinLines(found.additionalInfo),
          travelTips: joinLines(found.travelTips),
          isFeatured: Boolean(found.isFeatured),
          isPublished: Boolean(found.isPublished),
        });

        setItinerary(
          found.itinerary?.length
            ? found.itinerary
            : [{ dayTitle: "Day 1", location: "", time: "", details: "" }]
        );

        setOptions(
          found.options?.length
            ? found.options
            : [{ title: "", priceBdt: "", priceUsd: "", details: "" }]
        );
      } catch (error) {
        console.log(error);
        alert("Load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchSingle();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

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
        options: options.filter((op) => op.title?.trim()),
      };

      await axios.put(`${API_BASE_URL}/api/event-packages/${id}`, payload);

      alert("Event Package Updated Successfully ✅");
      navigate("/admin/manage-event-packages");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h3>Loading event package...</h3>
      </div>
    );
  }

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

        .remove-btn {
          border: none;
          background: #ffe7e7;
          color: #dc3545;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 800;
          margin-top: 10px;
        }
      `}</style>

      <div className="event-admin-container">
        <div className="event-admin-header">
          <h2>Edit Events & Packages</h2>
          <p className="mb-0">Update package content, price, gallery and policy.</p>
        </div>

        <form className="event-admin-body" onSubmit={handleUpdate}>
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
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Slug</label>
                <input
                  name="slug"
                  className="form-control"
                  value={form.slug}
                  onChange={handleChange}
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

              <div className="col-md-4">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  className="form-control"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
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
                />
              </div>
            </div>
          </div>

          <div className="event-section">
            <div className="event-section-title">Main Content</div>

            <div className="row g-3">
              {[
                ["shortDescription", "Short Description"],
                ["overview", "Overview"],
                ["locationDetails", "Location Details"],
                ["timingDetails", "Timing Details"],
                ["description", "Description"],
              ].map(([name, label]) => (
                <div className="col-md-12" key={name}>
                  <label className="form-label">{label}</label>
                  <textarea
                    name={name}
                    className="form-control"
                    value={form[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
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
                      placeholder="Time"
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
                      placeholder="Details"
                      value={item.details}
                      onChange={(e) => {
                        const copy = [...itinerary];
                        copy[index].details = e.target.value;
                        setItinerary(copy);
                      }}
                    />
                  </div>
                </div>

                {itinerary.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      setItinerary(itinerary.filter((_, i) => i !== index))
                    }
                  >
                    Remove Day
                  </button>
                )}
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
            <div className="event-section-title">Policy & Map</div>

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

                {options.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      setOptions(options.filter((_, i) => i !== index))
                    }
                  >
                    Remove Option
                  </button>
                )}
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

          <button className="submit-btn" disabled={saving}>
            {saving ? "Updating..." : "Update Event Package"}
          </button>
        </form>
      </div>
    </div>
  );
}