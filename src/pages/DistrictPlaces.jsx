import axios from "axios";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

const sanitizeConfig = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ["style", "class", "target", "rel"],
};

const weatherCodeLabels = {
  0: "মেঘমুক্ত",
  1: "অধিকাংশ সময় মেঘমুক্ত",
  2: "আংশিক মেঘলা",
  3: "মেঘলা",
  45: "কুয়াশা",
  48: "ঘন কুয়াশা",
  51: "হালকা গুঁড়ি গুঁড়ি বৃষ্টি",
  53: "মাঝারি গুঁড়ি গুঁড়ি বৃষ্টি",
  55: "তীব্র গুঁড়ি গুঁড়ি বৃষ্টি",
  56: "হালকা জমাট বৃষ্টি",
  57: "তীব্র জমাট বৃষ্টি",
  61: "হালকা বৃষ্টি",
  63: "মাঝারি বৃষ্টি",
  65: "ভারি বৃষ্টি",
  66: "হালকা জমাট বৃষ্টি",
  67: "তীব্র জমাট বৃষ্টি",
  71: "হালকা তুষারপাত",
  73: "মাঝারি তুষারপাত",
  75: "ভারি তুষারপাত",
  77: "তুষার দানা",
  80: "হালকা বৃষ্টি ঝরনা",
  81: "মাঝারি বৃষ্টি ঝরনা",
  82: "তীব্র বৃষ্টি ঝরনা",
  95: "বজ্রঝড়",
  96: "শিলাসহ বজ্রঝড়",
  99: "তীব্র শিলাসহ বজ্রঝড়",
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeDescriptionHtml(description) {
  const value = String(description || "").trim();

  if (!value) {
    return "";
  }

  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(value);

  if (hasHtml) {
    return DOMPurify.sanitize(value, sanitizeConfig);
  }

  const paragraphHtml = value
    .split(/\n{2,}/)
    .map((paragraph) => {
      const content = escapeHtml(paragraph).replace(/\n/g, "<br />");

      return `<p>${content}</p>`;
    })
    .join("");

  return DOMPurify.sanitize(paragraphHtml, sanitizeConfig);
}

function getWeatherLabel(code) {
  return weatherCodeLabels[code] || "আবহাওয়ার তথ্য";
}

function formatForecastDay(dateValue) {
  return new Date(dateValue).toLocaleDateString("bn-BD", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getCurrentHumidity(weatherPayload) {
  const currentTime = weatherPayload?.current_weather?.time;
  const hourlyTimes = weatherPayload?.hourly?.time || [];
  const humidityValues = weatherPayload?.hourly?.relative_humidity_2m || [];

  const index = hourlyTimes.indexOf(currentTime);

  if (index >= 0 && humidityValues[index] !== undefined) {
    return humidityValues[index];
  }

  return humidityValues[0] ?? null;
}

function resolveWeatherSearchQuery(place) {
  const weatherLocationEn = String(place?.weatherLocationEn || "").trim();
  const nameEn = String(place?.nameEn || "").trim();
  const nameBn = String(place?.nameBn || "").trim();

  if (weatherLocationEn) {
    return `${weatherLocationEn}, Bangladesh`;
  }

  if (nameEn) {
    return `${nameEn}, Bangladesh`;
  }

  if (nameBn) {
    return `${nameBn} Bangladesh`;
  }

  return "Bangladesh";
}

function DistrictPlaces() {
  const { slug } = useParams();

  const [district, setDistrict] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const getImageUrl = (img) => {
    return resolveImageUrl(img);
  };

  useEffect(() => {
    const fetchDistrictAndPlaces = async () => {
      try {
        const districtRes = await axios.get(
          `${API_BASE_URL}/api/districts/slug/${slug}`
        );

        setDistrict(districtRes.data);

        const placesRes = await axios.get(
          `${API_BASE_URL}/api/places/by-district/${districtRes.data._id}`
        );

        setPlaces(placesRes.data);
      } catch (error) {
        console.log("Error fetching district places:", error);
      }
    };

    fetchDistrictAndPlaces();
  }, [slug]);

  useEffect(() => {
    if (!selectedPlace) {
      setShowWeatherModal(false);
      setWeatherData(null);
      setWeatherError("");
      setWeatherLoading(false);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (!showWeatherModal || !selectedPlace) {
      return;
    }

    let cancelled = false;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError("");
      setWeatherData(null);

      try {
        const weatherQuery = resolveWeatherSearchQuery(selectedPlace);
        const geocodeResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            weatherQuery
          )}&count=8&language=en`
        );

        if (!geocodeResponse.ok) {
          throw new Error("GEOCODE_FETCH_FAILED");
        }

        const geocodeData = await geocodeResponse.json();
        const results = geocodeData?.results || [];

        let locationResult = null;

        if (results.length > 1) {
          locationResult =
            results.find((result) => result.country_code === "BD") || results[0];
        } else {
          locationResult = results[0] || null;
        }

        if (!locationResult) {
          throw new Error("LOCATION_NOT_FOUND");
        }

        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locationResult.latitude}&longitude=${locationResult.longitude}&current_weather=true&hourly=relative_humidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`
        );

        if (!forecastResponse.ok) {
          throw new Error("WEATHER_FETCH_FAILED");
        }

        const forecastData = await forecastResponse.json();
        const humidity = getCurrentHumidity(forecastData);

        if (!cancelled) {
          setWeatherData({
            location: locationResult,
            current: forecastData.current_weather,
            daily: forecastData.daily,
            humidity,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setWeatherError("এই স্থানের আবহাওয়া তথ্য পাওয়া যায়নি।");
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [showWeatherModal, selectedPlace]);

  const closePlaceModal = () => {
    setSelectedPlace(null);
    setShowWeatherModal(false);
  };

  const forecastCards =
    weatherData?.daily?.time?.map((dateValue, index) => ({
      date: dateValue,
      max: weatherData.daily.temperature_2m_max?.[index],
      min: weatherData.daily.temperature_2m_min?.[index],
      code: weatherData.daily.weathercode?.[index],
    })) || [];

  return (
    <div className="district-page-wrap">
      <style>{`
        .district-page-wrap {
          background:
            radial-gradient(circle at top, rgba(39, 127, 13, 0.08), transparent 36%),
            linear-gradient(180deg, #f8fcf6 0%, #eef6ea 100%);
          min-height: 100vh;
        }

        .district-hero {
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 252, 246, 0.8)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          min-height: 52vh;
          display: flex;
          align-items: center;
        }

        .district-hero-content {
          color: #13210f;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .district-title {
          font-size: clamp(2rem, 4vw, 3.35rem);
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: -0.03em;
        }

        .district-desc {
          font-size: 1.05rem;
          line-height: 1.9;
          opacity: 0.95;
          max-width: 760px;
          margin: 0 auto;
        }

        .place-card {
          border: none;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(15, 36, 12, 0.08);
          height: 100%;
          transition: 0.25s ease;
          background: #fff;
        }

        .place-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 36, 12, 0.12);
        }

        .place-card-img {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }

        .place-card-body {
          padding: 22px;
        }

        .place-card-title {
          color: #13210f;
          font-weight: 700;
          font-size: 1.22rem;
          margin-bottom: 12px;
        }

        .place-card-text {
          color: #5d6659;
          line-height: 1.7;
          min-height: 75px;
        }

        .place-btn {
          background: linear-gradient(135deg, #277f0d, #1c5f0a);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 999px;
          font-weight: 600;
          transition: 0.25s ease;
          box-shadow: 0 10px 24px rgba(39, 127, 13, 0.22);
        }

        .place-btn:hover {
          background: linear-gradient(135deg, #1d5c09, #164708);
          transform: translateY(-1px);
        }

        .place-modal-overlay,
        .weather-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 16, 7, 0.78);
          z-index: 10000;
          overflow-y: auto;
          padding: 28px 14px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .place-modal-box {
          width: 100%;
          max-width: 1080px;
          background: #ffffff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(0,0,0,0.28);
        }

        .place-modal-image {
          width: 100%;
          height: clamp(280px, 48vw, 520px);
          object-fit: cover;
        }

        .place-modal-body {
          padding: clamp(20px, 3vw, 34px);
          background: #fff;
        }

        .place-modal-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 14px;
        }

        .place-modal-title {
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          color: #12200f;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .place-modal-close {
          border: none;
          background: #f1f5f0;
          color: #152610;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          font-size: 22px;
          line-height: 1;
          flex: 0 0 auto;
        }

        .place-location-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .place-location-text {
          margin: 0;
          font-weight: 700;
          color: #28740e;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .weather-btn {
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #0f4aa3, #1f75cf);
          color: #fff;
          font-weight: 700;
          padding: 10px 18px;
          box-shadow: 0 12px 24px rgba(15, 74, 163, 0.18);
        }

        .place-article-card {
          border: 1px solid #edf1ea;
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 12px 34px rgba(10, 25, 10, 0.06);
          padding: clamp(18px, 2.8vw, 30px);
        }

        .place-article-content {
          color: #36443a;
        }

        .place-article-content h2 {
          color: #163d82;
          font-size: clamp(1.45rem, 2.4vw, 2rem);
          font-weight: 800;
          margin-top: 40px;
          margin-bottom: 18px;
          position: relative;
          padding-bottom: 14px;
        }

        .place-article-content h2::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 64px;
          height: 3px;
          background: #d52b1e;
          border-radius: 999px;
        }

        .place-article-content h3 {
          color: #163d82;
          font-size: clamp(1.15rem, 2vw, 1.45rem);
          font-weight: 800;
          margin-top: 28px;
          margin-bottom: 14px;
        }

        .place-article-content p {
          font-size: 18px;
          line-height: 1.9;
          margin-bottom: 18px;
          color: #36443a;
        }

        .place-article-content strong,
        .place-article-content b {
          color: #12200f;
          font-weight: 800;
        }

        .place-article-content a {
          color: #0f4aa3;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .place-article-content a:hover {
          color: #d52b1e;
        }

        .place-article-content ul,
        .place-article-content ol {
          margin-bottom: 18px;
          padding-left: 1.4rem;
        }

        .place-article-content li {
          margin-bottom: 10px;
          line-height: 1.85;
          font-size: 17px;
        }

        .weather-modal-box {
          width: 100%;
          max-width: 760px;
          background: #ffffff;
          border-radius: 26px;
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .weather-modal-header {
          padding: 22px 24px;
          background: linear-gradient(135deg, #0f4aa3, #1f75cf);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .weather-modal-header h3 {
          margin: 0;
          font-size: 1.35rem;
          font-weight: 800;
        }

        .weather-close-btn {
          border: none;
          background: rgba(255,255,255,0.16);
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 22px;
          line-height: 1;
        }

        .weather-modal-body {
          padding: 24px;
        }

        .weather-summary-card {
          background: linear-gradient(180deg, #f8fbff, #eef5ff);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #dde9fb;
          margin-bottom: 22px;
        }

        .weather-summary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 16px;
        }

        .weather-data-item {
          background: #fff;
          border-radius: 16px;
          padding: 14px 16px;
          border: 1px solid #e4ebf7;
        }

        .weather-data-label {
          display: block;
          font-size: 0.88rem;
          color: #5f6f86;
          margin-bottom: 6px;
        }

        .weather-data-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 800;
          color: #132b52;
        }

        .weather-forecast-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .weather-forecast-card {
          border: 1px solid #e5ebf5;
          border-radius: 18px;
          padding: 16px;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(15, 25, 40, 0.04);
        }

        .weather-forecast-card h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #14274b;
          margin-bottom: 8px;
        }

        .weather-forecast-card p {
          margin-bottom: 6px;
          color: #42526b;
          font-size: 0.95rem;
        }

        .weather-loading,
        .weather-error {
          padding: 18px;
          border-radius: 16px;
          text-align: center;
          font-weight: 600;
        }

        .weather-loading {
          background: #f4f8ff;
          color: #17408b;
        }

        .weather-error {
          background: #fff3f1;
          color: #b33a2d;
        }

        @media (max-width: 768px) {
          .district-title {
            font-size: 2rem;
          }

          .place-modal-body,
          .weather-modal-body {
            padding: 18px;
          }

          .place-location-row {
            align-items: flex-start;
          }

          .place-article-content p {
            font-size: 16.5px;
          }

          .weather-summary-grid,
          .weather-forecast-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="district-hero">
        <div className="container">
          {district && (
            <div className="district-hero-content">
              <h1 className="district-title">
                <i className="fa fa-globe-asia me-2"></i> {district.nameBn}
              </h1>
              <p className="district-desc">{district.shortDescription}</p>
            </div>
          )}
        </div>
      </section>

      <section className="container py-5">
        <div className="row">
          {places.map((place) => (
            <div className="col-lg-4 col-md-6 mb-4" key={place._id}>
              <div className="place-card">
                <img
                  src={getImageUrl(place.image)}
                  className="place-card-img"
                  alt={place.nameBn}
                />
                <div className="place-card-body">
                  <h5 className="place-card-title">
                    <i className="fa fa-map-marker-alt me-2"></i> {place.nameBn}
                  </h5>
                  <p className="place-card-text">{place.shortDescription}</p>
                  <button
                    className="place-btn"
                    onClick={() => setSelectedPlace(place)}
                  >
                    বিস্তারিত
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPlace && (
        <div className="place-modal-overlay" onClick={closePlaceModal}>
          <div className="place-modal-box" onClick={(event) => event.stopPropagation()}>
            <img
              src={getImageUrl(selectedPlace.image)}
              alt={selectedPlace.nameBn}
              className="place-modal-image"
            />

            <div className="place-modal-body">
              <div className="place-modal-topbar">
                <h2 className="place-modal-title">{selectedPlace.nameBn}</h2>
                <button className="place-modal-close" onClick={closePlaceModal}>
                  ×
                </button>
              </div>

              <div className="place-location-row">
                <p className="place-location-text">
                  <i className="fa fa-map-marker-alt"></i>
                  অবস্থান: {selectedPlace.locationBn}
                </p>

                <button
                  className="weather-btn"
                  onClick={() => setShowWeatherModal(true)}
                >
                  আবহাওয়া
                </button>
              </div>

              <div className="place-article-card">
                <div
                  className="place-article-content"
                  dangerouslySetInnerHTML={{
                    __html: normalizeDescriptionHtml(selectedPlace.fullDescription),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPlace && showWeatherModal && (
        <div className="weather-modal-overlay" onClick={() => setShowWeatherModal(false)}>
          <div className="weather-modal-box" onClick={(event) => event.stopPropagation()}>
            <div className="weather-modal-header">
              <h3>আবহাওয়ার পূর্বাভাস</h3>
              <button
                className="weather-close-btn"
                onClick={() => setShowWeatherModal(false)}
              >
                ×
              </button>
            </div>

            <div className="weather-modal-body">
              {weatherLoading && <div className="weather-loading">আবহাওয়ার তথ্য লোড হচ্ছে...</div>}

              {!weatherLoading && weatherError && <div className="weather-error">{weatherError}</div>}

              {!weatherLoading && !weatherError && weatherData && (
                <>
                  <div className="weather-summary-card">
                    <h4 className="mb-2 fw-bold text-dark">{selectedPlace.nameBn}</h4>
                    <p className="mb-0 text-secondary">
                      {weatherData.location?.name || selectedPlace.locationBn}
                    </p>

                    <div className="weather-summary-grid">
                      <div className="weather-data-item">
                        <span className="weather-data-label">বর্তমান তাপমাত্রা</span>
                        <span className="weather-data-value">
                          {weatherData.current?.temperature ?? "N/A"}°C
                        </span>
                      </div>

                      <div className="weather-data-item">
                        <span className="weather-data-label">আবহাওয়ার অবস্থা</span>
                        <span className="weather-data-value">
                          {getWeatherLabel(weatherData.current?.weathercode)}
                        </span>
                      </div>

                      <div className="weather-data-item">
                        <span className="weather-data-label">বাতাসের গতি</span>
                        <span className="weather-data-value">
                          {weatherData.current?.windspeed ?? "N/A"} km/h
                        </span>
                      </div>

                      <div className="weather-data-item">
                        <span className="weather-data-label">আর্দ্রতা</span>
                        <span className="weather-data-value">
                          {weatherData.humidity !== null && weatherData.humidity !== undefined
                            ? `${weatherData.humidity}%`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="mb-3 fw-bold text-dark">আগামী ৩ দিনের পূর্বাভাস</h4>
                  <div className="weather-forecast-grid">
                    {forecastCards.map((card) => (
                      <div className="weather-forecast-card" key={card.date}>
                        <h4>{formatForecastDay(card.date)}</h4>
                        <p>{getWeatherLabel(card.code)}</p>
                        <p>সর্বোচ্চ: {card.max ?? "N/A"}°C</p>
                        <p>সর্বনিম্ন: {card.min ?? "N/A"}°C</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!weatherLoading && !weatherError && !weatherData && (
                <div className="weather-loading">আবহাওয়ার তথ্য প্রস্তুত করা হচ্ছে...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DistrictPlaces;