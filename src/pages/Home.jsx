import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";


export default function Home() {
const [homePackages, setHomePackages] = useState([]);
  const [randomPlaces, setRandomPlaces] = useState([]);
const [activePlace, setActivePlace] = useState(null);
const getImageUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http") ? img : `${API_BASE_URL}${img}`;
};

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
                src="assets/img/about.jpg"
                alt=""
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
            <h6 className="section-title bg-white text-start text-primary pe-3">
              About Us
            </h6>
            <h1 className="mb-4">
              Welcome to <span className="text-primary">Tourist</span>
            </h1>
            <p className="mb-4">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
              diam amet diam et eos. Clita erat ipsum et lorem et sit.
            </p>
            <p className="mb-4">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
              diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet
              lorem sit clita duo justo magna dolore erat amet
            </p>
            <div className="row gy-2 gx-4 mb-4">
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />
                  First Class Flights
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />
                  Handpicked Hotels
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />5 Star
                  Accommodations
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />
                  Latest Model Vehicles
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />
                  150 Premium City Tours
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-0">
                  <i className="fa fa-arrow-right text-primary me-2" />
                  24/7 Service
                </p>
              </div>
            </div>
            <a className="btn btn-primary py-3 px-5 mt-2" href="">
              Read More
            </a>
          </div>
        </div>
      </div>
    </div>
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
            Process
          </h6>
          <h1 className="mb-5">3 Easy Steps</h1>
        </div>
        <div className="row gy-5 gx-4 justify-content-center">
          <div
            className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <div className="position-relative border border-primary pt-5 pb-4 px-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                style={{ width: 100, height: 100 }}
              >
                <i className="fa fa-globe fa-3x text-white" />
              </div>
              <h5 className="mt-4">Choose A Destination</h5>
              <hr className="w-25 mx-auto bg-primary mb-1" />
              <hr className="w-50 mx-auto bg-primary mt-0" />
              <p className="mb-0">
                Tempor erat elitr rebum clita dolor diam ipsum sit diam amet
                diam eos erat ipsum et lorem et sit sed stet lorem sit
              </p>
            </div>
          </div>
          <div
            className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
            data-wow-delay="0.3s"
          >
            <div className="position-relative border border-primary pt-5 pb-4 px-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                style={{ width: 100, height: 100 }}
              >
                <i className="fa fa-dollar-sign fa-3x text-white" />
              </div>
              <h5 className="mt-4">Pay Online</h5>
              <hr className="w-25 mx-auto bg-primary mb-1" />
              <hr className="w-50 mx-auto bg-primary mt-0" />
              <p className="mb-0">
                Tempor erat elitr rebum clita dolor diam ipsum sit diam amet
                diam eos erat ipsum et lorem et sit sed stet lorem sit
              </p>
            </div>
          </div>
          <div
            className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
            data-wow-delay="0.5s"
          >
            <div className="position-relative border border-primary pt-5 pb-4 px-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                style={{ width: 100, height: 100 }}
              >
                <i className="fa fa-plane fa-3x text-white" />
              </div>
              <h5 className="mt-4">Fly Today</h5>
              <hr className="w-25 mx-auto bg-primary mb-1" />
              <hr className="w-50 mx-auto bg-primary mt-0" />
              <p className="mb-0">
                Tempor erat elitr rebum clita dolor diam ipsum sit diam amet
                diam eos erat ipsum et lorem et sit sed stet lorem sit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Process Start */}
    {/* Team Start */}
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Travel Guide
          </h6>
          <h1 className="mb-5">Meet Our Guide</h1>
        </div>
        <div className="row g-4">
          <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="team-item">
              <div className="overflow-hidden">
                <img className="img-fluid" src="assets/img/team-1.jpg" alt="" />
              </div>
              <div
                className="position-relative d-flex justify-content-center"
                style={{ marginTop: "-19px" }}
              >
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
              <div className="text-center p-4">
                <h5 className="mb-0">Full Name</h5>
                <small>Designation</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <div className="team-item">
              <div className="overflow-hidden">
                <img className="img-fluid" src="assets/img/team-2.jpg" alt="" />
              </div>
              <div
                className="position-relative d-flex justify-content-center"
                style={{ marginTop: "-19px" }}
              >
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
              <div className="text-center p-4">
                <h5 className="mb-0">Full Name</h5>
                <small>Designation</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
            <div className="team-item">
              <div className="overflow-hidden">
                <img className="img-fluid" src="assets/img/team-3.jpg" alt="" />
              </div>
              <div
                className="position-relative d-flex justify-content-center"
                style={{ marginTop: "-19px" }}
              >
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
              <div className="text-center p-4">
                <h5 className="mb-0">Full Name</h5>
                <small>Designation</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
            <div className="team-item">
              <div className="overflow-hidden">
                <img className="img-fluid" src="assets/img/team-4.jpg" alt="" />
              </div>
              <div
                className="position-relative d-flex justify-content-center"
                style={{ marginTop: "-19px" }}
              >
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square mx-1" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
              <div className="text-center p-4">
                <h5 className="mb-0">Full Name</h5>
                <small>Designation</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Team End */}
    {/* Testimonial Start */}
    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
      <div className="container">
        <div className="text-center">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Testimonial
          </h6>
          <h1 className="mb-5">Our Clients Say!!!</h1>
        </div>
        <div className="owl-carousel testimonial-carousel position-relative">
          <div className="testimonial-item bg-white text-center border p-4">
            <img
              className="bg-white rounded-circle shadow p-1 mx-auto mb-3"
              src="assets/img/testimonial-1.jpg"
              style={{ width: 80, height: 80 }}
            />
            <h5 className="mb-0">John Doe</h5>
            <p>New York, USA</p>
            <p className="mb-0">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
              amet diam et eos. Clita erat ipsum et lorem et sit.
            </p>
          </div>
          <div className="testimonial-item bg-white text-center border p-4">
            <img
              className="bg-white rounded-circle shadow p-1 mx-auto mb-3"
              src="assets/img/testimonial-2.jpg"
              style={{ width: 80, height: 80 }}
            />
            <h5 className="mb-0">John Doe</h5>
            <p>New York, USA</p>
            <p className="mt-2 mb-0">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
              amet diam et eos. Clita erat ipsum et lorem et sit.
            </p>
          </div>
          <div className="testimonial-item bg-white text-center border p-4">
            <img
              className="bg-white rounded-circle shadow p-1 mx-auto mb-3"
              src="assets/img/testimonial-3.jpg"
              style={{ width: 80, height: 80 }}
            />
            <h5 className="mb-0">John Doe</h5>
            <p>New York, USA</p>
            <p className="mt-2 mb-0">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
              amet diam et eos. Clita erat ipsum et lorem et sit.
            </p>
          </div>
          <div className="testimonial-item bg-white text-center border p-4">
            <img
              className="bg-white rounded-circle shadow p-1 mx-auto mb-3"
              src="assets/img/testimonial-4.jpg"
              style={{ width: 80, height: 80 }}
            />
            <h5 className="mb-0">John Doe</h5>
            <p>New York, USA</p>
            <p className="mt-2 mb-0">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
              amet diam et eos. Clita erat ipsum et lorem et sit.
            </p>
          </div>
        </div>
      </div>
    </div>
    {/* Testimonial End */}  
    </div>
  )
}
