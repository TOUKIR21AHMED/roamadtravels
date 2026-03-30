import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
function DistrictPlaces() {
  const { slug } = useParams();

  const [district, setDistrict] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    fetchDistrictAndPlaces();
  }, [slug]);

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

  return (
    <div className="district-page-wrap">
      <style>{`
        .district-page-wrap {
          background: #f6fbf4;
          min-height: 100vh;
        }

        .district-hero {
          background:
            linear-gradient(rgb(254, 255, 254), rgba(255, 255, 255, 0.68)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          min-height: 52vh;
          display: flex;
          align-items: center;
        }

        .district-hero-content {
          color: Black;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          
        }

        .district-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .district-desc {
          font-size: 1.05rem;
          font-weight: 800;
          line-height: 1.8;
          opacity: 0.96;
        }

        .place-card {
          border: none;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0,0,0,0.07);
          height: 100%;
          transition: 0.25s ease;
          background: #fff;
        }

        .place-card:hover {
          transform: translateY(-8px);
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
          color: #1D3815;
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 12px;
        }

        .place-card-text {
          color: #5d6659;
          line-height: 1.7;
          min-height: 75px;
        }

        .place-btn {
          background: #277f0d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 999px;
          font-weight: 600;
          transition: 0.25s ease;
        }

        .place-btn:hover {
          background: #1d5c09;
        }

        .place-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.78);
          z-index: 9999;
          overflow-y: auto;
          padding: 40px 15px;
        }

        .place-modal-box {
          max-width: 960px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .place-modal-image {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
        }

        .place-modal-body {
          padding: 28px;
        }

        .place-modal-title {
          font-size: 2rem;
          color: #1D3815;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .place-modal-location {
          font-weight: 700;
          color: #277f0d;
          margin-bottom: 18px;
        }

        .place-modal-text {
          color: #4f5a4a;
          line-height: 1.9;
          font-size: 1rem;
        }

        .place-close-btn {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 10px 20px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .district-title {
            font-size: 2rem;
          }

          .place-modal-body {
            padding: 20px;
          }

          .place-modal-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <section className="district-hero">
        <div className="container">
          {district && (
            <div className="district-hero-content">
              <h1 className="district-title"><i className="fa fa-globe-asia me-2"></i> {district.nameBn}</h1>
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
                  src={place.image}
                  className="place-card-img"
                  alt={place.nameBn}
                />
                <div className="place-card-body">
                  <h5 className="place-card-title"><i className="fa fa-map-marker-alt me-2"></i> {place.nameBn}</h5>
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
        <div className="place-modal-overlay">
          <div className="place-modal-box">
            <img
              src={selectedPlace.image}
              alt={selectedPlace.nameBn}
              className="place-modal-image"
            />

            <div className="place-modal-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <h2 className="place-modal-title mb-0">
                  {selectedPlace.nameBn}
                </h2>
                <button
                  className="place-close-btn"
                  onClick={() => setSelectedPlace(null)}
                >
                  Close
                </button>
              </div>

              <p className="place-modal-location">
               <i className="fa fa-map-marker-alt me-2"></i> অবস্থান: {selectedPlace.locationBn}
              </p>

              <p className="place-modal-text">
                {selectedPlace.fullDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DistrictPlaces;