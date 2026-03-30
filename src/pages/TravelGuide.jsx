import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
function TravelGuide() {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [activeDivisionName, setActiveDivisionName] = useState("");
  const [activePlace, setActivePlace] = useState(null);

  const divisionOrder = [
    "ঢাকা",
    "চট্টগ্রাম",
    "রাজশাহী",
    "খুলনা",
    "সিলেট",
    "বরিশাল",
    "ময়মনসিংহ",
    "ময়মনসিংহ",
    "রংপুর"
  ];

  useEffect(() => {
  fetchDivisions();
}, [fetchDivisions]);

  const fetchDivisions = useCallback(async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/divisions`);

    const sortedDivisions = [...res.data].sort((a, b) => {
      const aIndex = divisionOrder.indexOf(a.nameBn);
      const bIndex = divisionOrder.indexOf(b.nameBn);

      const safeA = aIndex === -1 ? 999 : aIndex;
      const safeB = bIndex === -1 ? 999 : bIndex;

      return safeA - safeB;
    });

    setDivisions(sortedDivisions);
  } catch (error) {
    console.log("Division fetch error:", error);
  }
}, [divisionOrder]);

  const fetchDistricts = async (id, name) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/districts/by-division/${id}`
      );
      setDistricts(res.data);
      setActiveDivisionName(name);
    } catch (error) {
      console.log("District fetch error:", error);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearchDone(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/places/search/${search}`
      );
      setSearchResults(res.data);
      setSearchDone(true);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  const staticCards = [
    {
      id: 1,
      title: "সাজেক ভ্যালি",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      text: "বাংলাদেশের অন্যতম জনপ্রিয় পাহাড়ি পর্যটন কেন্দ্র।",
      fullDescription:
        "সাজেক ভ্যালি বাংলাদেশের অন্যতম জনপ্রিয় পাহাড়ি ভ্রমণ স্থান। মেঘের খেলা, পাহাড়ি রাস্তা, শান্ত পরিবেশ এবং প্রাকৃতিক সৌন্দর্যের জন্য এটি পর্যটকদের কাছে খুবই আকর্ষণীয়। রাঙামাটি জেলার অন্তর্গত এই স্থানটি পরিবার, বন্ধু বা দম্পতিদের জন্য অসাধারণ একটি ভ্রমণ গন্তব্য।"
    },
    {
      id: 2,
      title: "সেন্ট মার্টিন",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      text: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ, অপরূপ সৌন্দর্যে ভরা।",
      fullDescription:
        "সেন্ট মার্টিন বাংলাদেশের একমাত্র প্রবাল দ্বীপ এবং সমুদ্রপ্রেমীদের জন্য স্বর্গের মতো একটি জায়গা। নীল পানি, সাদা বালু, প্রবালের বৈচিত্র্য এবং শান্ত পরিবেশ এই দ্বীপকে বিশেষভাবে অনন্য করেছে। যারা সমুদ্রের পাশে নিরিবিলি সময় কাটাতে চান, তাদের জন্য এটি দারুণ একটি destination।"
    },
    {
      id: 3,
      title: "রাঙ্গামাটি",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      text: "কাপ্তাই লেক আর পাহাড়ি সৌন্দর্যের এক অনন্য মিশ্রণ।",
      fullDescription:
        "রাঙ্গামাটি বাংলাদেশের অন্যতম সুন্দর পাহাড়ি জেলা, যা কাপ্তাই লেকের জন্য বিশেষভাবে বিখ্যাত। এখানে নীল জল, পাহাড়, সবুজ গাছপালা ও নৌভ্রমণের অভিজ্ঞতা মিলিয়ে চমৎকার একটি পরিবেশ পাওয়া যায়। প্রকৃতি ভালোবাসেন এমন সবার জন্য রাঙ্গামাটি দারুণ একটি পর্যটন কেন্দ্র।"
    },
    {
      id: 4,
      title: "সুন্দরবন",
      image:
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
      text: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন ও রয়েল বেঙ্গল টাইগারের আবাস।",
      fullDescription:
        "সুন্দরবন বিশ্বের সবচেয়ে বড় ম্যানগ্রোভ বন এবং বাংলাদেশে প্রকৃতিপ্রেমীদের জন্য একটি অসাধারণ স্থান। এটি রয়েল বেঙ্গল টাইগার, হরিণ, কুমির এবং নানা প্রজাতির পাখির আবাসস্থল। নদী, খাল, বন ও বন্যপ্রাণীর সমন্বয়ে এটি এক অনন্য প্রাকৃতিক ঐতিহ্য।"
    },
    {
      id: 5,
      title: "কুয়াকাটা",
      image:
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
      text: "এক জায়গা থেকে সূর্যোদয় আর সূর্যাস্ত দেখার জন্য বিখ্যাত।",
      fullDescription:
        "কুয়াকাটা বাংলাদেশের এমন একটি সমুদ্র সৈকত, যেখানে একই জায়গা থেকে সূর্যোদয় ও সূর্যাস্ত দেখা যায়। সমুদ্র, ঝাউবন, শান্ত পরিবেশ এবং বিস্তীর্ণ সৈকত এটিকে একটি বিশেষ পর্যটন গন্তব্যে পরিণত করেছে। প্রকৃতির সৌন্দর্য উপভোগ করতে চাইলে কুয়াকাটা অবশ্যই দেখার মতো।"
    },
    {
      id: 6,
      title: "শ্রীমঙ্গল",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      text: "চায়ের রাজধানী, সবুজ প্রকৃতি আর শান্ত পরিবেশে ভরা।",
      fullDescription:
        "শ্রীমঙ্গলকে বাংলাদেশের চায়ের রাজধানী বলা হয়। অসংখ্য চা বাগান, সবুজ প্রাকৃতিক পরিবেশ, লাউয়াছড়া জাতীয় উদ্যান এবং শান্ত আবহাওয়া এই অঞ্চলকে ভ্রমণের জন্য অনন্য করে তুলেছে। যারা নিরিবিলি প্রকৃতি ও সবুজের মাঝে সময় কাটাতে চান, তাদের জন্য শ্রীমঙ্গল একদম perfect।"
    },
  ];

  return (
    <div className="travel-guide-page">
      <style>{`
        .travel-guide-page {
          background: #f6fbf4;
        }

        .guide-hero {
          background:
            linear-gradient(rgb(254, 255, 254), rgba(63, 147, 64, 0.59)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          min-height: 70vh;
          display: flex;
          align-items: center;
        }

        .guide-hero-box {
          max-width: 980px;
          margin: 0 auto;
          text-align: center;
          color: #1D3815;
        }

        .guide-hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .guide-hero-subtitle {
          font-size: 1.05rem;
          font-weight: 800;
          opacity: 0.95;
          margin-bottom: 28px;
        }

        .guide-search-wrap {
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 14px 40px rgba(0,0,0,0.18);
        }

        .guide-search-bar {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .guide-search-input {
          flex: 1;
          border: none;
          outline: none;
          border-radius: 999px;
          padding: 15px 20px;
          font-size: 1rem;
          background: rgba(255,255,255,0.96);
        }

        .guide-search-btn {
          border: none;
          background: #277f0d;
          color: white;
          border-radius: 999px;
          padding: 14px 28px;
          font-weight: 700;
          transition: 0.25s ease;
        }

        .guide-search-btn:hover {
          background: #1d5c09;
        }

        .guide-section-title {
          color: #1D3815;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .guide-section-subtitle {
          color: #5a6655;
          margin-bottom: 28px;
        }

        .division-card {
          border: none;
          width: 100%;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          text-align: center;
          padding: 18px 12px;
          font-weight: 700;
          color: #1D3815;
          cursor: pointer;
          transition: 0.25s ease;
          height: 100%;
        }

        .division-card:hover {
          transform: translateY(-4px);
        }

        .active-division {
          background: #277f0d !important;
          color: white !important;
        }

        .district-panel {
          margin-top: 28px;
          background: white;
          border-radius: 22px;
          box-shadow: 0 14px 35px rgba(0,0,0,0.06);
          padding: 28px;
        }

        .district-panel-title {
          font-size: 1.4rem;
          color: #1D3815;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .district-card {
          border: 1px solid #e7efe2;
          border-radius: 14px;
          padding: 14px 16px;
          background: #fafdf8;
          color: #1D3815;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .district-card:hover {
          background: #eef8ea;
          transform: translateY(-3px);
        }

        .guide-district-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .guide-district-link {
          display: block;
          text-decoration: none;
          color: #1D3815;
          background: #f9fcf8;
          border: 1px solid #e7efe2;
          border-radius: 14px;
          padding: 14px 16px;
          font-weight: 600;
          transition: 0.22s ease;
          word-break: break-word;
        }

        .guide-district-link:hover {
          background: #eef8ea;
          color: #277f0d;
          transform: translateY(-2px);
        }

        .search-result-card,
        .static-guide-card {
          border: none;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.07);
          background: #fff;
          height: 100%;
          transition: 0.25s ease;
        }

        .search-result-card:hover,
        .static-guide-card:hover {
          transform: translateY(-8px);
        }

        .search-result-card img,
        .static-guide-card img {
          height: 260px;
          width: 100%;
          object-fit: cover;
        }

        .search-result-body,
        .static-guide-body {
          padding: 20px;
        }

        .search-result-title,
        .static-guide-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1D3815;
          margin-bottom: 10px;
        }

        .search-result-text,
        .static-guide-text {
          color: #5d6659;
          line-height: 1.7;
        }

        .guide-link-btn {
          display: inline-block;
          margin-top: 12px;
          padding: 10px 20px;
          border-radius: 999px;
          background: #277f0d;
          color: white;
          text-decoration: none;
          font-weight: 600;
          border: none;
          transition: 0.25s ease;
        }

        .guide-link-btn:hover {
          background: #1d5c09;
          color: white;
        }

        .static-guide-btn-wrap {
          margin-top: 14px;
        }

        .premium-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 17, 8, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeInModal 0.28s ease;
        }

        .premium-modal-box {
          width: 100%;
          max-width: 980px;
          max-height: 92vh;
          overflow-y: auto;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 28px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.22);
          animation: modalSlideUp 0.35s ease;
        }

        .premium-modal-top {
          position: relative;
        }

        .premium-modal-img {
          width: 100%;
          height: 430px;
          object-fit: cover;
          display: block;
        }

        .premium-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 46px;
          height: 46px;
          border: none;
          border-radius: 50%;
          background: rgba(0,0,0,0.55);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .premium-modal-close:hover {
          background: #dc3545;
          transform: rotate(90deg);
        }

        .premium-modal-content {
          padding: 28px;
        }

        .premium-modal-title {
          color: #1D3815;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .premium-modal-subtitle {
          display: inline-block;
          background: #eef8ea;
          color: #277f0d;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .premium-modal-text {
          color: #4f5a4a;
          font-size: 1rem;
          line-height: 1.9;
        }

        @keyframes fadeInModal {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .guide-hero-title {
            font-size: 2rem;
          }

          .guide-search-bar {
            flex-direction: column;
          }

          .guide-search-btn {
            width: 100%;
          }

          .premium-modal-img {
            height: 250px;
          }

          .premium-modal-content {
            padding: 20px;
          }

          .premium-modal-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <section className="guide-hero">
        <div className="container">
          <div className="guide-hero-box">
            <h1 className="guide-hero-title">Travel Guide & Info</h1>
            <p className="guide-hero-subtitle">
              বিভাগ, জেলা ও দর্শনীয় স্থান খুঁজে বের করুন সহজে
            </p>

            <div className="guide-search-wrap">
              <div className="guide-search-bar">
                <input
                  type="text"
                  className="guide-search-input"
                  placeholder="জায়গার নাম লিখে খুঁজুন..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="guide-search-btn" onClick={handleSearch}>
                  খুঁজুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        {searchDone && (
          <>
            <div className="text-center mb-4">
              <h2 className="guide-section-title">Search Results</h2>
              <p className="guide-section-subtitle">
                আপনার search অনুযায়ী পাওয়া ফলাফল
              </p>
            </div>

            <div className="row">
              {searchResults.length > 0 ? (
                searchResults.map((place) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={place._id}>
                    <div className="search-result-card">
                      <img src={place.image} alt={place.nameBn} />
                      <div className="search-result-body">
                        <h5 className="search-result-title">{place.nameBn}</h5>
                        <p className="search-result-text">
                          {place.shortDescription}
                        </p>

                        <Link
                          to={`/travel-guide/district/${place.districtId.slug}`}
                          className="guide-link-btn"
                        >
                          বিস্তারিত দেখুন
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">কোনো ফলাফল পাওয়া যায়নি।</p>
              )}
            </div>
          </>
        )}
      </section>

      <section className="container pb-5">
        <div className="text-center mb-4">
          <h2 className="guide-section-title">বাংলাদেশ</h2>
        </div>

        <div className="row">
          {divisions.map((div) => (
            <div
              key={div._id}
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
            >
              <button
                type="button"
                className={`division-card w-100 ${activeDivisionName === div.nameBn ? "active-division" : ""}`}
                onClick={() => fetchDistricts(div._id, div.nameBn)}
              >
                <i className="fa fa-map-marker-alt me-2"></i> {div.nameBn}
              </button>
            </div>
          ))}
        </div>

        {districts.length > 0 && (
          <div className="district-panel">
            <h3 className="district-panel-title">
              {activeDivisionName} বিভাগের জেলা সমূহ
            </h3>

            <div className="guide-district-grid">
              {districts.map((district) => (
                <Link
                  key={district._id}
                  to={`/travel-guide/district/${district.slug}`}
                  className="guide-district-link"
                >
                  <i className="fa fa-map-marker-alt me-2"></i> {district.nameBn}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="guide-section-title">বাংলাদেশের জনপ্রিয় ভ্রমণ স্থান</h2>
        </div>

        <div className="row">
          {staticCards.map((card) => (
            <div className="col-lg-4 col-md-6 mb-4" key={card.id}>
              <div className="static-guide-card">
                <img src={card.image} alt={card.title} />
                <div className="static-guide-body">
                  <h5 className="static-guide-title"><i className="fa fa-map-marker-alt me-2"></i> {card.title}</h5>
                  <p className="static-guide-text">{card.text}</p>

                  <div className="static-guide-btn-wrap">
                    <button
                      className="guide-link-btn"
                      onClick={() => setActivePlace(card)}
                    >
                      বিস্তারিত
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activePlace && (
        <div className="premium-modal-overlay" onClick={() => setActivePlace(null)}>
          <div
            className="premium-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="premium-modal-top">
              <img
                src={activePlace.image}
                alt={activePlace.title}
                className="premium-modal-img"
              />

              <button
                className="premium-modal-close"
                onClick={() => setActivePlace(null)}
              >
                ✕
              </button>
            </div>

            <div className="premium-modal-content">
              <div className="premium-modal-subtitle">বাংলাদেশের জনপ্রিয় ভ্রমণ স্থান</div>
              <h2 className="premium-modal-title"><i className="fa fa-map-marker-alt me-2"></i> {activePlace.title}</h2>
              <p className="premium-modal-text">{activePlace.fullDescription}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelGuide;