import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";


export default function Home() {
const [homePackages, setHomePackages] = useState([]);
  const [randomPlaces, setRandomPlaces] = useState([]);
const [activePlace, setActivePlace] = useState(null);
const [homeAbout, setHomeAbout] = useState(null);
const [testimonials, setTestimonials] = useState([]);
const getImageUrl = (img) => resolveImageUrl(img);
useEffect(() => {
  const fetchHomeAbout = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/home-about`);
      setHomeAbout(res.data);
    } catch (error) {
      console.log("Home about fetch error:", error);
    }
  };

  fetchHomeAbout();
}, []);

useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/testimonials/active`);
      setTestimonials(res.data || []);
    } catch (error) {
      console.log("Testimonials fetch error:", error);
    }
  };

  fetchTestimonials();
}, []);

useEffect(() => {
  const fetchRandomPlaces = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/places`);
      const places = res.data || [];

      const shuffled = [...places].sort(() => 0.5 - Math.random());
      setRandomPlaces(shuffled.slice(0, 9));
    } catch (error) {
      console.log("Random places fetch error:", error);
    }
  };

  fetchRandomPlaces();
}, []);
useEffect(() => {
  const fetchHomePackages = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/event-packages?published=true&limit=50`
      );

      const packages = res.data.items || [];
      const shuffled = [...packages].sort(() => 0.5 - Math.random());

      setHomePackages(shuffled.slice(0, 3));
    } catch (error) {
      console.log("Home packages fetch error:", error);
    }
  };

  fetchHomePackages();
}, []);
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white mb-3 animated slideInDown">
                Enjoy Your Vacation With Us
              </h1>
              <p className="fs-4 text-white mb-4 animated slideInDown">
                Tempor erat elitr rebum at clita diam amet diam et eos erat
                ipsum lorem sit
              </p>
              <div className="position-relative w-75 mx-auto animated slideInDown">
                <input
                  className="form-control border-0 rounded-pill w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Eg: Thailand"
                />
                <button
                  type="button"
                  className="btn btn-primary rounded-pill py-2 px-4 position-absolute top-0 end-0 me-2"
                  style={{ marginTop: 7 }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Start */}
{homeAbout && (
  <div className="container-xxl py-5">
    <div className="container">
      <div className="row g-5">
        <div
          className="col-lg-6 wow fadeInUp"
          data-wow-delay="0.1s"
          style={{ minHeight: 400 }}
        >
          <div className="position-relative h-100">
            <img
              className="img-fluid position-absolute w-100 h-100"
              src={getImageUrl(homeAbout.image) || "assets/img/about.jpg"}
              alt="About"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
          <h6 className="section-title bg-white text-start text-primary pe-3">
            {homeAbout.sectionLabel}
          </h6>

          <h1 className="mb-4">
            {homeAbout.titleBeforeHighlight}{" "}
            <span className="text-primary">
              {homeAbout.highlightedTitle}
            </span>
          </h1>

          <p className="mb-4">{homeAbout.paragraphOne}</p>
          <p className="mb-4">{homeAbout.paragraphTwo}</p>

          <div className="row gy-2 gx-4 mb-4">
            {(homeAbout.features || []).map((feature, index) => (
              <div className="col-sm-6" key={index}>
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <Link
            className="btn btn-primary py-3 px-5 mt-2"
            to={homeAbout.buttonLink || "/about"}
          >
            {homeAbout.buttonText || "Read More"}
          </Link>
        </div>
      </div>
    </div>
  </div>
)}
{/* About End */}

    {/* Random Tourist Places Start */}
<style>{`
  .home-place-card {
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    height: 100%;
    transition: 0.25s ease;
  }

  .home-place-card:hover {
    transform: translateY(-6px);
  }

  .home-place-img-wrap {
    position: relative;
    height: 240px;
    overflow: hidden;
  }

  .home-place-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .home-place-location {
    position: absolute;
    left: 16px;
    bottom: 14px;
    color: #ffffff;
    font-weight: 700;
    font-size: 0.95rem;
    text-shadow: 0 2px 8px rgba(0,0,0,0.55);
  }

  .home-place-body {
    padding: 20px;
  }

  .home-place-title {
    color: #1D3815;
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 10px;
  }

  .home-place-text {
    color: #4f5a4a;
    line-height: 1.7;
    margin-bottom: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .home-place-btn {
    border: none;
    background: #277f0d;
    color: white;
    border-radius: 999px;
    padding: 9px 20px;
    font-weight: 700;
  }

  .home-place-btn:hover {
    background: #1d5c09;
  }

  .home-place-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(7, 17, 8, 0.75);
    backdrop-filter: blur(8px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .home-place-modal {
    width: 100%;
    max-width: 850px;
    max-height: 92vh;
    overflow-y: auto;
    background: white;
    border-radius: 26px;
    overflow: hidden;
  }

  .home-place-modal-img {
    width: 100%;
    height: 380px;
    object-fit: cover;
  }

  .home-place-modal-content {
    padding: 26px;
  }

  .home-place-modal-close {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 1.2rem;
  }

  @media (max-width: 576px) {
    .home-place-img-wrap {
      height: 150px;
    }

    .home-place-body {
      padding: 14px;
    }

    .home-place-title {
      font-size: 1rem;
    }

    .home-place-text {
      font-size: 0.88rem;
      -webkit-line-clamp: 3;
    }

    .home-place-modal-img {
      height: 230px;
    }
  }
`}</style>

<div className="container-xxl py-5">
  <div className="container">
    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
      <h6 className="section-title bg-white text-center text-primary px-3">
        Travel Guide
      </h6>
      <h1 className="mb-5">বাংলাদেশের দর্শনীয় স্থান</h1>
    </div>

    <div className="row g-4">
      {randomPlaces.map((place) => (
        <div className="col-lg-4 col-6" key={place._id}>
          <div className="home-place-card">
            <div className="home-place-img-wrap">
              <img
                src={place.image}
                alt={place.nameBn}
                className="home-place-img"
              />
              <div className="home-place-location">
                <i className="fa fa-map-marker-alt me-2"></i>
                {place.districtId?.nameBn || place.districtName || "বাংলাদেশ"}
              </div>
            </div>

            <div className="home-place-body">
              <h5 className="home-place-title">{place.nameBn}</h5>
              <p className="home-place-text">
                {place.shortDescription || place.description}
              </p>

              <button
                type="button"
                className="home-place-btn"
                onClick={() => setActivePlace(place)}
              >
                বিস্তারিত
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{activePlace && (
  <div
    className="home-place-modal-overlay"
    onClick={() => setActivePlace(null)}
  >
    <div
      className="home-place-modal position-relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="home-place-modal-close"
        onClick={() => setActivePlace(null)}
      >
        ✕
      </button>

      <img
        src={activePlace.image}
        alt={activePlace.nameBn}
        className="home-place-modal-img"
      />

      <div className="home-place-modal-content">
        <h2 className="home-place-title">
          <i className="fa fa-map-marker-alt me-2"></i>
          {activePlace.nameBn}
        </h2>

        <p className="home-place-text" style={{ display: "block" }}>
          {activePlace.fullDescription ||
            activePlace.description ||
            activePlace.shortDescription}
        </p>
      </div>
    </div>
  </div>
)}
{/* Random Tourist Places End */}
{/* Service Start */}
<style>{`
  .home-service-card {
    position: relative;
    height: 100%;
    padding: 28px;
    border-radius: 26px;
    background: #ffffff;
    box-shadow: 0 18px 45px rgba(0,0,0,0.08);
    border: 1px solid rgba(39,127,13,0.12);
    overflow: hidden;
    transition: 0.35s ease;
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .home-service-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 28px 70px rgba(29,56,21,0.16);
    color: inherit;
  }

  .home-service-icon {
    width: 72px;
    height: 72px;
    border-radius: 24px;
    background: linear-gradient(135deg, #1D3815, #277f0d);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: 22px;
    box-shadow: 0 16px 34px rgba(39,127,13,0.28);
    transition: 0.35s ease;
  }

  .home-service-card:hover .home-service-icon {
    transform: rotate(-8deg) scale(1.08);
  }

  .home-service-tag {
    display: inline-block;
    background: #eef8ea;
    color: #277f0d;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 0.76rem;
    font-weight: 900;
    margin-bottom: 14px;
  }

  .home-service-title {
    color: #1D3815;
    font-weight: 900;
    font-size: 1.15rem;
    margin-bottom: 12px;
  }

  .home-service-text {
    color: #5a6655;
    line-height: 1.7;
    margin-bottom: 18px;
  }

  .home-service-arrow {
    color: #277f0d;
    font-weight: 900;
  }
`}</style>

<div className="container-xxl py-5">
  <div className="container">
    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
      <h6 className="section-title bg-white text-center text-primary px-3">
        Services
      </h6>
      <h1 className="mb-5">Our Services</h1>
    </div>

    <div className="row g-4">
      {[
        {
          title: "Flight",
          link: "/Flight",
          icon: "fa-plane",
          tag: "Air Travel",
          desc: "Book domestic and international flights with trusted travel support.",
        },
        {
          title: "Visa",
          link: "/Visa",
          icon: "fa-passport",
          tag: "Documentation",
          desc: "Get visa assistance, document guidance and professional support.",
        },
        {
          title: "Events & Packages",
          link: "/Packages",
          icon: "fa-suitcase",
          tag: "Packages",
          desc: "Explore premium events, tours, activities and travel packages.",
        },
        {
          title: "Creating Personal Event",
          link: "/event-package-request",
          icon: "fa-calendar-plus",
          tag: "Custom Event",
          desc: "Create your own private tour, group trip or custom event plan.",
        },
        {
          title: "Travel Guide & Information",
          link: "/travel-guide",
          icon: "fa-map-marked-alt",
          tag: "Guide",
          desc: "Discover tourist spots, local information and travel tips.",
        },
        {
          title: "Our E-commerce Shop",
          link: "/Shop",
          icon: "fa-shopping-cart",
          tag: "Shop",
          desc: "Buy travel essentials and useful products from our online shop.",
        },
      ].map((service, index) => (
        <div
          className="col-lg-4 col-md-6 wow fadeInUp"
          data-wow-delay={`${0.1 + index * 0.12}s`}
          key={service.title}
        >
          <a href={service.link} className="home-service-card">
            <div className="home-service-icon">
              <i className={`fa ${service.icon}`}></i>
            </div>

            <span className="home-service-tag">{service.tag}</span>

            <h5 className="home-service-title">{service.title}</h5>

            <p className="home-service-text">{service.desc}</p>

            <span className="home-service-arrow">
              Explore <i className="fa fa-arrow-right ms-1"></i>
            </span>
          </a>
        </div>
      ))}
    </div>
  </div>
</div>
{/* Service End */}
   
    {/* Package Start */}
<style>{`
  .home-package-section {
    background: linear-gradient(180deg, #ffffff 0%, #f4f8f2 100%);
  }

  .home-package-card {
    background: white;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 18px 45px rgba(0,0,0,0.09);
    height: 100%;
    transition: 0.35s ease;
    position: relative;
  }

  .home-package-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 65px rgba(0,0,0,0.15);
  }

  .home-package-img-wrap {
    height: 255px;
    overflow: hidden;
    position: relative;
  }

  .home-package-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.45s ease;
  }

  .home-package-card:hover .home-package-img {
    transform: scale(1.1);
  }

  .home-package-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(255,255,255,0.94);
    color: #277f0d;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 900;
  }

  .home-package-price {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: #277f0d;
    color: white;
    padding: 9px 15px;
    border-radius: 999px;
    font-weight: 900;
    box-shadow: 0 8px 22px rgba(0,0,0,0.25);
  }

  .home-package-body {
    padding: 24px;
  }

  .home-package-title {
    color: #1D3815;
    font-weight: 950;
    font-size: 1.18rem;
    min-height: 58px;
    margin-bottom: 12px;
  }

  .home-package-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .home-package-meta span {
    background: #eef8ea;
    color: #1D3815;
    padding: 7px 11px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .home-package-desc {
    color: #5b6557;
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 78px;
  }

  .home-package-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
  }

  .home-package-btn {
    flex: 1;
    text-align: center;
    text-decoration: none;
    border-radius: 999px;
    padding: 10px 16px;
    font-weight: 900;
  }

  .home-package-btn.primary {
    background: #277f0d;
    color: white;
  }

  .home-package-btn.light {
    background: #eef8ea;
    color: #277f0d;
  }

  .home-package-btn:hover {
    opacity: 0.9;
  }
`}</style>

<div className="container-xxl py-5 home-package-section">
  <div className="container">
    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
      <h6 className="section-title bg-white text-center text-primary px-3">
        Events & Packages
      </h6>
      <h1 className="mb-3">Awesome Packages</h1>
      <p className="mb-5 text-muted">
        Explore our selected events, tours and travel packages.
      </p>
    </div>

    <div className="row g-4 justify-content-center">
      {homePackages.map((item, index) => (
        <div
          className="col-lg-4 col-md-6 wow fadeInUp"
          data-wow-delay={`${0.1 + index * 0.2}s`}
          key={item._id}
        >
          <div className="home-package-card">
            <div className="home-package-img-wrap">
              <img
                src={getImageUrl(item.mainImage)}
                alt={item.title}
                className="home-package-img"
              />

              <div className="home-package-badge">
                {item.category}
              </div>

              <div className="home-package-price">
                ৳{Number(item.priceBdt || 0).toLocaleString()}
              </div>
            </div>

            <div className="home-package-body">
              <h3 className="home-package-title">{item.title}</h3>

              <div className="home-package-meta">
                <span>
                  <i className="fa fa-map-marker-alt me-1"></i>
                  {item.location}
                </span>

                <span>
                  <i className="fa fa-clock me-1"></i>
                  {item.duration || item.durationFilter}
                </span>

                <span>
                  <i className="fa fa-users me-1"></i>
                  {item.minimumPeople || "Flexible"}
                </span>
              </div>

              <p className="home-package-desc">
                {item.shortDescription || item.overview}
              </p>

              <div className="home-package-actions">
                <Link
                  to={`/events-packages/${item.slug}`}
                  className="home-package-btn light"
                >
                  Details
                </Link>

                <Link
                  to="/event-package-request"
                  className="home-package-btn primary"
                >
                  Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-5">
      <Link
        to="/packages"
        className="btn btn-primary rounded-pill py-3 px-5"
      >
        View All Packages
      </Link>
    </div>
  </div>
</div>
{/* Package End */}
    
{/* Process Start */}
<div className="container-xxl py-5">
  <div className="container">
    <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
      <h6 className="section-title bg-white text-center text-primary px-3">
        How It Works
      </h6>

      <h1 className="mb-4" style={{ fontWeight: "900", color: "#1D3815" }}>
        Your Journey In 3 Simple Steps
      </h1>

      <p
        style={{
          maxWidth: "750px",
          margin: "0 auto",
          color: "#667063",
          lineHeight: "1.9",
        }}
      >
        ROAMAD TRAVELS BD makes your travel experience simple, fast and
        premium — from planning to destination.
      </p>
    </div>

    <div className="row gy-5 gx-4 justify-content-center">
      {/* Step 1 */}
      <div
        className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
        data-wow-delay="0.1s"
      >
        <div
          className="position-relative pt-5 pb-4 px-4"
          style={{
            background: "#fff",
            borderRadius: "30px",
            border: "1px solid rgba(39,127,13,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            transition: "0.35s ease",
            height: "100%",
          }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle position-absolute top-0 start-50 translate-middle shadow"
            style={{
              width: 100,
              height: 100,
              background: "linear-gradient(135deg, #1D3815, #66b80f)",
            }}
          >
            <i className="fa fa-map-marked-alt fa-3x text-white" />
          </div>

          <h5
            className="mt-4"
            style={{
              fontWeight: "800",
              color: "#1D3815",
            }}
          >
            Choose Your Destination
          </h5>

          <hr className="w-25 mx-auto bg-primary mb-1" />
          <hr className="w-50 mx-auto bg-primary mt-0" />

          <p
            className="mb-0"
            style={{
              color: "#667063",
              lineHeight: "1.9",
            }}
          >
            Explore premium tour packages, travel destinations, visa support,
            flights and personalized event experiences from our smart tourism
            platform.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div
        className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
        data-wow-delay="0.3s"
      >
        <div
          className="position-relative pt-5 pb-4 px-4"
          style={{
            background: "#fff",
            borderRadius: "30px",
            border: "1px solid rgba(39,127,13,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            transition: "0.35s ease",
            height: "100%",
          }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle position-absolute top-0 start-50 translate-middle shadow"
            style={{
              width: 100,
              height: 100,
              background: "linear-gradient(135deg, #1D3815, #66b80f)",
            }}
          >
            <i className="fa fa-file-signature fa-3x text-white" />
          </div>

          <h5
            className="mt-4"
            style={{
              fontWeight: "800",
              color: "#1D3815",
            }}
          >
            Submit Your Request
          </h5>

          <hr className="w-25 mx-auto bg-primary mb-1" />
          <hr className="w-50 mx-auto bg-primary mt-0" />

          <p
            className="mb-0"
            style={{
              color: "#667063",
              lineHeight: "1.9",
            }}
          >
            Fill up your flight, visa or custom event request form and upload
            required documents securely through our modern digital system.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div
        className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
        data-wow-delay="0.5s"
      >
        <div
          className="position-relative pt-5 pb-4 px-4"
          style={{
            background: "#fff",
            borderRadius: "30px",
            border: "1px solid rgba(39,127,13,0.1)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            transition: "0.35s ease",
            height: "100%",
          }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle position-absolute top-0 start-50 translate-middle shadow"
            style={{
              width: 100,
              height: 100,
              background: "linear-gradient(135deg, #1D3815, #66b80f)",
            }}
          >
            <i className="fa fa-plane-departure fa-3x text-white" />
          </div>

          <h5
            className="mt-4"
            style={{
              fontWeight: "800",
              color: "#1D3815",
            }}
          >
            Enjoy Your Journey
          </h5>

          <hr className="w-25 mx-auto bg-primary mb-1" />
          <hr className="w-50 mx-auto bg-primary mt-0" />

          <p
            className="mb-0"
            style={{
              color: "#667063",
              lineHeight: "1.9",
            }}
          >
            Our team handles the processing while you prepare for an amazing
            travel experience with premium support and trusted service.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
{/* Process End */}
    
{/* Testimonial Start */}
{testimonials.length > 0 && (
  <>
    <style>{`
      .premium-testimonial-section {
        background:
          radial-gradient(circle at top left, rgba(39,127,13,0.13), transparent 35%),
          linear-gradient(180deg, #ffffff 0%, #f4f8f2 100%);
        overflow: hidden;
      }

      .testimonial-marquee-wrap {
        width: 100%;
        overflow: hidden;
        position: relative;
      }

      .testimonial-marquee-track {
        display: flex;
        gap: 24px;
        width: max-content;
        animation: testimonialMarquee 38s linear infinite;
      }

      .testimonial-marquee-wrap:hover .testimonial-marquee-track {
        animation-play-state: paused;
      }

      @keyframes testimonialMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      .premium-testimonial-card {
        width: 380px;
        min-height: 300px;
        background: rgba(255,255,255,0.92);
        border: 1px solid rgba(39,127,13,0.12);
        border-radius: 32px;
        padding: 28px;
        box-shadow: 0 22px 60px rgba(0,0,0,0.09);
        position: relative;
        overflow: hidden;
      }

      .premium-testimonial-card::before {
        content: "“";
        position: absolute;
        top: -35px;
        right: 24px;
        font-size: 140px;
        line-height: 1;
        color: rgba(39,127,13,0.08);
        font-family: serif;
      }

      .testimonial-client-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 18px;
      }

      .testimonial-client-img {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #eef8ea;
        box-shadow: 0 10px 25px rgba(39,127,13,0.18);
      }

      .testimonial-stars {
        color: #ffc107;
        font-size: 0.95rem;
        margin-bottom: 12px;
      }

      .testimonial-message {
        color: #5b6557;
        line-height: 1.8;
        font-size: 0.98rem;
      }

      @media (max-width: 576px) {
        .premium-testimonial-card {
          width: 310px;
          padding: 22px;
        }

        .testimonial-marquee-track {
          gap: 16px;
          animation-duration: 28s;
        }
      }
    `}</style>

    <div className="container-xxl py-5 premium-testimonial-section">
      <div className="container text-center mb-5">
        <h6 className="section-title bg-white text-center text-primary px-3">
          Testimonial
        </h6>

        <h1 className="mb-3" style={{ fontWeight: 900, color: "#1D3815" }}>
          Our Clients Say
        </h1>

        <p className="text-muted">
          Real experiences from our happy travelers and clients.
        </p>
      </div>

      <div className="testimonial-marquee-wrap">
        <div className="testimonial-marquee-track">
          {[...testimonials, ...testimonials].map((item, index) => (
            <div className="premium-testimonial-card" key={`${item._id}-${index}`}>
              <div className="testimonial-client-row">
                <img
                  src={getImageUrl(item.image) || "/assets/img/user.png"}
                  alt={item.name}
                  className="testimonial-client-img"
                />

                <div>
                  <h5 className="mb-1" style={{ color: "#1D3815", fontWeight: 900 }}>
                    {item.name}
                  </h5>
                  <p className="mb-0 text-muted">{item.location}</p>
                </div>
              </div>

              <div className="testimonial-stars">
                {Array.from({ length: Number(item.rating || 5) }).map((_, i) => (
                  <i className="fa fa-star me-1" key={i}></i>
                ))}
              </div>

              <p className="testimonial-message">“{item.message}”</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)}
{/* Testimonial End */} 
    </div>
  )
}
