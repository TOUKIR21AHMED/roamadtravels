import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const timeSlots = [
  { label: "00:00 - 06:00", value: "00-06" },
  { label: "06:00 - 12:00", value: "06-12" },
  { label: "12:00 - 18:00", value: "12-18" },
  { label: "18:00 - 00:00", value: "18-00" },
];

export default function EventsPackages() {
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return suggestions.slice(0, 7);
    return suggestions
      .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 7);
  }, [search, suggestions]);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      params.append("currency", currency);

      if (search.trim()) params.append("search", search.trim());
      if (category) params.append("category", category);
      if (duration) params.append("duration", duration);
      if (timeSlot) params.append("timeSlot", timeSlot);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await axios.get(
        `${API_BASE_URL}/api/event-packages?${params.toString()}`
      );

      setItems(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.log("Events packages fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/event-packages/suggestions`
      );
      setSuggestions(res.data || []);
    } catch (error) {
      console.log("Suggestions error:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [page, category, duration, timeSlot, currency]);

  const handleSearch = () => {
    setPage(1);
    fetchItems();
    setShowSuggest(false);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDuration("");
    setTimeSlot("");
    setMinPrice("");
    setMaxPrice("");
    setCurrency("BDT");
    setPage(1);
    setTimeout(fetchItems, 100);
  };

  return (
    <div className="events-page">
      <style>{`
        .events-page {
          background: #f5f8f2;
          min-height: 100vh;
        }

        .events-hero {
          background:
            linear-gradient(rgba(20, 55, 12, 0.65), rgba(20, 55, 12, 0.55)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          padding: 90px 0 70px;
          color: white;
        }

        .events-hero h1 {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .events-hero p {
          font-size: 1.05rem;
          opacity: 0.95;
        }

        .events-search-box {
          max-width: 820px;
          margin: 32px auto 0;
          position: relative;
          background: white;
          border-radius: 22px;
          padding: 12px;
          display: flex;
          gap: 10px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.22);
        }

        .events-search-box input {
          flex: 1;
          border: none;
          outline: none;
          padding: 14px 18px;
          font-size: 1rem;
          border-radius: 16px;
        }

        .events-search-box button {
          border: none;
          background: #277f0d;
          color: white;
          border-radius: 16px;
          padding: 0 28px;
          font-weight: 800;
        }

        .suggest-box {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          background: white;
          color: #1D3815;
          border-radius: 18px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.16);
          overflow: hidden;
          z-index: 10;
        }

        .suggest-item {
          padding: 13px 18px;
          cursor: pointer;
          font-weight: 700;
          border-bottom: 1px solid #eef3eb;
        }

        .suggest-item:hover {
          background: #eef8ea;
          color: #277f0d;
        }

        .category-tabs {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 30px 0;
        }

        .category-tab {
          border: none;
          background: white;
          color: #1D3815;
          padding: 11px 18px;
          border-radius: 999px;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .category-tab.active {
          background: #277f0d;
          color: white;
        }

        .filter-card {
          background: white;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.07);
          position: sticky;
          top: 20px;
        }

        .filter-title {
          font-weight: 900;
          color: #1D3815;
          font-size: 1.15rem;
          margin-bottom: 18px;
        }

        .filter-label {
          font-weight: 800;
          color: #1D3815;
          margin-bottom: 8px;
          font-size: 0.92rem;
        }

        .filter-control {
          border: 1px solid #dce8d7;
          border-radius: 14px;
          padding: 11px 13px;
          width: 100%;
          outline: none;
          margin-bottom: 14px;
          background: white;
        }

        .currency-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .currency-btn {
          border: 1px solid #dce8d7;
          background: white;
          border-radius: 14px;
          padding: 10px;
          font-weight: 900;
          color: #1D3815;
        }

        .currency-btn.active {
          background: #277f0d;
          color: white;
        }

        .reset-btn {
          width: 100%;
          border: none;
          background: #ffe7e7;
          color: #dc3545;
          border-radius: 999px;
          padding: 11px;
          font-weight: 900;
        }

        .event-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 14px 35px rgba(0,0,0,0.08);
          height: 100%;
          transition: 0.25s ease;
        }

        .event-card:hover {
          transform: translateY(-7px);
        }

        .event-img-wrap {
          height: 235px;
          position: relative;
          overflow: hidden;
        }

        .event-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.35s ease;
        }

        .event-card:hover .event-img {
          transform: scale(1.08);
        }

        .event-category-badge {
          position: absolute;
          left: 14px;
          top: 14px;
          background: rgba(255,255,255,0.92);
          color: #277f0d;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .event-body {
          padding: 20px;
        }

        .event-title {
          color: #1D3815;
          font-size: 1.18rem;
          font-weight: 900;
          margin-bottom: 10px;
          min-height: 55px;
        }

        .event-meta {
          color: #687365;
          font-size: 0.9rem;
          margin-bottom: 7px;
        }

        .event-desc {
          color: #5b6557;
          line-height: 1.65;
          margin: 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 72px;
        }

        .event-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 15px;
        }

        .event-price {
          color: #277f0d;
          font-weight: 950;
          font-size: 1.15rem;
        }

        .details-btn {
          background: #277f0d;
          color: white;
          text-decoration: none;
          border-radius: 999px;
          padding: 9px 16px;
          font-weight: 900;
          white-space: nowrap;
        }

        .details-btn:hover {
          background: #1d5c09;
          color: white;
        }

        .skeleton-card {
          height: 430px;
          border-radius: 24px;
          background: linear-gradient(90deg, #eaf0e6, #ffffff, #eaf0e6);
          background-size: 200% 100%;
          animation: skeletonMove 1.1s infinite linear;
        }

        @keyframes skeletonMove {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .pagination-wrap {
          display: flex;
          justify-content: center;
          gap: 9px;
          margin-top: 35px;
          flex-wrap: wrap;
        }

        .page-btn {
          border: none;
          background: white;
          color: #1D3815;
          min-width: 42px;
          height: 42px;
          border-radius: 50%;
          font-weight: 900;
          box-shadow: 0 8px 20px rgba(0,0,0,0.07);
        }

        .page-btn.active {
          background: #277f0d;
          color: white;
        }

        .request-banner {
          background: linear-gradient(135deg, #1d5c09, #67b90f);
          border-radius: 28px;
          padding: 30px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 35px;
        }

        .request-banner h3 {
          font-weight: 900;
          margin-bottom: 6px;
        }

        .request-banner a {
          background: white;
          color: #1d5c09;
          padding: 12px 22px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
        }

        @media (max-width: 768px) {
          .events-hero h1 {
            font-size: 2rem;
          }

          .events-search-box {
            flex-direction: column;
          }

          .events-search-box button {
            padding: 13px;
          }

          .filter-card {
            position: static;
            margin-bottom: 25px;
          }

          .event-img-wrap {
            height: 170px;
          }
        }
      `}</style>

      <section className="events-hero">
        <div className="container text-center">
          <h1>Events & Packages</h1>
          <p>Find premium events, tours, activities and custom travel packages.</p>

          <div className="events-search-box">
            <input
              type="text"
              placeholder="Search destination, location or package..."
              value={search}
              onFocus={() => setShowSuggest(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggest(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button type="button" onClick={handleSearch}>
              Search
            </button>

            {showSuggest && filteredSuggestions.length > 0 && (
              <div className="suggest-box">
                {filteredSuggestions.map((item, index) => (
                  <div
                    className="suggest-item"
                    key={index}
                    onMouseDown={() => {
                      setSearch(item);
                      setShowSuggest(false);
                      setTimeout(handleSearch, 50);
                    }}
                  >
                    <i className="fa fa-search me-2"></i>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="request-banner">
          <div>
            <h3>Can’t find your perfect Tour Package?</h3>
            <p className="mb-0">Create your own custom tour or event request.</p>
          </div>

          <Link to="/event-package-request">Request Now</Link>
        </div>

        <div className="category-tabs">
          <button
            className={`category-tab ${category === "" ? "active" : ""}`}
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${category === cat ? "active" : ""}`}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="filter-card">
              <div className="filter-title">
                <i className="fa fa-sliders-h me-2"></i>
                Filters
              </div>

              <div className="filter-label">Currency</div>
              <div className="currency-switch">
                <button
                  type="button"
                  className={`currency-btn ${currency === "BDT" ? "active" : ""}`}
                  onClick={() => {
                    setCurrency("BDT");
                    setPage(1);
                  }}
                >
                  BDT
                </button>
                <button
                  type="button"
                  className={`currency-btn ${currency === "USD" ? "active" : ""}`}
                  onClick={() => {
                    setCurrency("USD");
                    setPage(1);
                  }}
                >
                  USD
                </button>
              </div>

              <div className="filter-label">Price Range</div>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="filter-control"
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    className="filter-control"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="details-btn w-100 border-0 text-center mb-3"
                onClick={() => {
                  setPage(1);
                  fetchItems();
                }}
              >
                Apply Price
              </button>

              <div className="filter-label">Duration</div>
              <select
                className="filter-control"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Duration</option>
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div className="filter-label">Time</div>
              <select
                className="filter-control"
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">00:00-04:00</option>
                {timeSlots.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <button type="button" className="reset-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="row g-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div className="col-lg-6 col-md-6" key={index}>
                    <div className="skeleton-card"></div>
                  </div>
                ))
              ) : items.length > 0 ? (
                items.map((item) => (
                  <div className="col-lg-6 col-md-6" key={item._id}>
                    <div className="event-card">
                      <div className="event-img-wrap">
                        <img
                          src={
  item.mainImage?.startsWith("http")
    ? item.mainImage
    : `${API_BASE_URL}${item.mainImage}`
}
                          alt={item.title}
                          className="event-img"
                        />
                        <div className="event-category-badge">
                          {item.category}
                        </div>
                      </div>

                      <div className="event-body">
                        <h3 className="event-title">{item.title}</h3>

                        <div className="event-meta">
                          <i className="fa fa-map-marker-alt text-primary me-2"></i>
                          {item.location}, {item.country}
                        </div>

                        <div className="event-meta">
                          <i className="fa fa-clock text-primary me-2"></i>
                          {item.duration || item.durationFilter}
                        </div>

                        <p className="event-desc">{item.shortDescription}</p>

                        <div className="event-bottom">
                          <div className="event-price">
                            {currency === "USD"
                              ? `$${Number(item.priceUsd || 0).toLocaleString()}`
                              : `৳${Number(item.priceBdt || 0).toLocaleString()}`}
                          </div>

                          <Link
                            to={`/events-packages/${item.slug}`}
                            className="details-btn"
                          >
                            বিস্তারিত
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center bg-white rounded-4 p-5">
                    <h4>No package found</h4>
                    <p>Try changing search or filter.</p>
                  </div>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination-wrap">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`page-btn ${page === index + 1 ? "active" : ""}`}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}