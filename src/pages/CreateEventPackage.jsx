import axios from "axios";
import { useState } from "react";
import API_BASE_URL from "../config";

export default function CreateEventPackage() {
  const [loading, setLoading] = useState(false);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "Sightseeing & Day-Tours",
    location: "",
    country: "Bangladesh",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const splitLines = (text) =>
    text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview("");
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryFiles((prev) => [...prev, ...newImages]);
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImageFile) {
      alert("Please upload main image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("mainImage", mainImageFile);

      galleryFiles.forEach((item) => {
        formData.append("galleryImages", item.file);
      });

formData.append("priceBdt", form.priceBdt || 0);
formData.append("priceUsd", form.priceUsd || 0);

      formData.append("inclusions", JSON.stringify(splitLines(form.inclusions)));
      formData.append("exclusions", JSON.stringify(splitLines(form.exclusions)));
      formData.append("requirements", JSON.stringify(splitLines(form.requirements)));
      formData.append("facilities", JSON.stringify(splitLines(form.facilities)));
      formData.append("additionalInfo", JSON.stringify(splitLines(form.additionalInfo)));
      formData.append("travelTips", JSON.stringify(splitLines(form.travelTips)));

      formData.append("itinerary", JSON.stringify(itinerary));
      formData.append(
        "options",
        JSON.stringify(options.filter((op) => op.title.trim()))
      );

      await axios.post(`${API_BASE_URL}/api/event-packages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

        .image-upload-box {
          position: relative;
          min-height: 230px;
          border: 2px dashed #9fcf8e;
          border-radius: 22px;
          background: linear-gradient(135deg, #f8fff4, #eef8ea);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .image-upload-box:hover {
          border-color: #277f0d;
          background: #f5fff0;
        }

        .upload-placeholder {
          text-align: center;
          color: #1D3815;
          padding: 25px;
        }

        .upload-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #277f0d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 12px;
          font-weight: 900;
        }

        .upload-placeholder h5 {
          font-weight: 900;
          margin-bottom: 6px;
        }

        .upload-placeholder p {
          margin: 0;
          color: #6b7467;
          font-size: 0.9rem;
        }

        .image-upload-box input {
          display: none;
        }

        .main-preview {
          width: 100%;
          height: 260px;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #dc3545;
          color: white;
          font-size: 20px;
          font-weight: 900;
          line-height: 1;
          z-index: 5;
        }

        .gallery-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
          gap: 14px;
          margin-top: 15px;
        }

        .gallery-preview-card {
          position: relative;
          height: 105px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #dce8d7;
          background: #f6fbf4;
        }

        .gallery-preview-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: #dc3545;
          color: white;
          font-weight: 900;
          line-height: 1;
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
          <p>Admin can upload package images directly from PC.</p>
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

            <div className="row g-4">
              <div className="col-md-12">
                <label className="form-label">Main Image</label>

                <label className="image-upload-box">
                  {mainImagePreview ? (
                    <>
                      <img
                        src={mainImagePreview}
                        alt="Main Preview"
                        className="main-preview"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          removeMainImage();
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">+</div>
                      <h5>Upload Main Image</h5>
                      <p>Click here and choose image from your PC</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImage}
                  />
                </label>
              </div>

              <div className="col-md-12">
                <label className="form-label">Gallery Images</label>

                <label className="image-upload-box">
                  <div className="upload-placeholder">
                    <div className="upload-icon">+</div>
                    <h5>Upload Gallery Images</h5>
                    <p>You can select multiple images</p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImages}
                  />
                </label>

                {galleryFiles.length > 0 && (
                  <div className="gallery-preview-grid">
                    {galleryFiles.map((item, index) => (
                      <div className="gallery-preview-card" key={index}>
                        <img src={item.preview} alt={`Gallery ${index + 1}`} />

                        <button
                          type="button"
                          className="gallery-remove-btn"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                <div
                  className={name === "description" ? "col-md-12" : "col-md-6"}
                  key={name}
                >
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