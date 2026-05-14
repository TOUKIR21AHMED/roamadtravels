import React from "react";
import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      title: "Flight",
      link: "/Flight",
      icon: "fa-plane-departure",
      desc: "Book domestic and international flights with smooth guidance, smart support and trusted travel planning.",
      tag: "Air Travel",
    },
    {
      title: "Visa",
      link: "/Visa",
      icon: "fa-passport",
      desc: "Get professional visa assistance, document guidance and step-by-step support for your destination.",
      tag: "Documentation",
    },
    {
      title: "Events & Packages",
      link: "/Packages",
      icon: "fa-suitcase-rolling",
      desc: "Explore premium tours, activities, events and ready-made travel packages designed for memorable journeys.",
      tag: "Packages",
    },
    {
      title: "Creating Personal Event",
      link: "/event-package-request",
      icon: "fa-calendar-plus",
      desc: "Create your own custom event, private tour, group trip or personalized travel experience exactly your way.",
      tag: "Custom Event",
    },
    {
      title: "Travel Guide & Information",
      link: "/travel-guide",
      icon: "fa-map-marked-alt",
      desc: "Discover destinations, tourist spots, travel tips and local information before planning your next trip.",
      tag: "Guide",
    },
    {
      title: "Our E-commerce Shop",
      link: "/Shop",
      icon: "fa-shopping-cart",
      desc: "Shop travel essentials, lifestyle products and useful items from our curated online store.",
      tag: "Shop",
    },
  ];

  return (
    <div>
      <style>{`
        .services-premium-page {
          background:
            radial-gradient(circle at top left, rgba(39,127,13,0.14), transparent 34%),
            radial-gradient(circle at bottom right, rgba(29,56,21,0.12), transparent 30%),
            #f5f8f2;
        }

        .service-hero-premium {
          position: relative;
          overflow: hidden;
        }

        .service-hero-premium::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(29,56,21,0.85), rgba(39,127,13,0.58)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          transform: scale(1.05);
        }

        .service-hero-premium::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          right: -120px;
          top: -120px;
          animation: floatOrb 7s ease-in-out infinite;
        }

        .service-hero-content {
          position: relative;
          z-index: 2;
        }

        .service-hero-content h1 {
          font-weight: 950;
          letter-spacing: -1px;
        }

        .services-grid-section {
          padding: 95px 0;
        }

        .service-pro-card {
          position: relative;
          height: 100%;
          padding: 30px;
          border-radius: 30px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(39,127,13,0.12);
          box-shadow: 0 22px 55px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: 0.45s ease;
          text-decoration: none;
          display: block;
          color: inherit;
          isolation: isolate;
        }

        .service-pro-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(39,127,13,0.12), rgba(29,56,21,0.02));
          opacity: 0;
          transition: 0.45s ease;
          z-index: -1;
        }

        .service-pro-card::after {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(39,127,13,0.08);
          right: -60px;
          bottom: -60px;
          transition: 0.45s ease;
          z-index: -1;
        }

        .service-pro-card:hover {
          transform: translateY(-14px) rotateX(4deg);
          box-shadow: 0 32px 85px rgba(29,56,21,0.18);
          color: inherit;
        }

        .service-pro-card:hover::before {
          opacity: 1;
        }

        .service-pro-card:hover::after {
          width: 230px;
          height: 230px;
        }

        .service-icon-shell {
          width: 82px;
          height: 82px;
          border-radius: 26px;
          background: linear-gradient(135deg, #1D3815, #277f0d);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin-bottom: 24px;
          box-shadow: 0 18px 35px rgba(39,127,13,0.28);
          transition: 0.45s ease;
          position: relative;
        }

        .service-icon-shell::after {
          content: "";
          position: absolute;
          inset: -8px;
          border: 1px solid rgba(39,127,13,0.25);
          border-radius: 32px;
          animation: pulseRing 2.2s infinite;
        }

        .service-pro-card:hover .service-icon-shell {
          transform: rotate(-8deg) scale(1.08);
        }

        .service-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #eef8ea;
          color: #277f0d;
          padding: 7px 13px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .service-pro-card h3 {
          color: #1D3815;
          font-weight: 950;
          font-size: 1.35rem;
          margin-bottom: 14px;
        }

        .service-pro-card p {
          color: #5a6655;
          line-height: 1.75;
          margin-bottom: 22px;
        }

        .service-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #277f0d;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.35s ease;
        }

        .service-pro-card:hover .service-arrow {
          transform: translateX(8px);
          background: #1D3815;
        }

        .service-cta-box {
          margin-top: 70px;
          padding: 34px;
          border-radius: 32px;
          background: linear-gradient(135deg, #1D3815, #66b80f);
          color: white;
          box-shadow: 0 26px 70px rgba(29,56,21,0.22);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .service-cta-box h3 {
          font-weight: 950;
          margin-bottom: 6px;
        }

        .service-cta-box a {
          background: white;
          color: #1D3815;
          padding: 13px 24px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 950;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(28px); }
        }

        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0.85; }
          100% { transform: scale(1.18); opacity: 0; }
        }

        @media (max-width: 768px) {
          .services-grid-section {
            padding: 60px 0;
          }

          .service-pro-card {
            padding: 24px;
          }

          .service-hero-content h1 {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <div className="services-premium-page">
        <div className="container-fluid bg-primary py-5 mb-0 hero-header service-hero-premium">
          <div className="container py-5 service-hero-content">
            <div className="row justify-content-center py-5">
              <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  Services
                </h1>
                <p className="text-white fs-5 mb-4 animated slideInDown">
                  Smart travel, premium events, visa support, shopping and personal experiences — everything in one place.
                </p>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li
                      className="breadcrumb-item text-white active"
                      aria-current="page"
                    >
                      Services
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="container-xxl services-grid-section">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3">
                What We Offer
              </h6>
              <h1 className="mb-3">Our Premium Services</h1>
              <p className="text-muted mb-5">
                Choose the service you need and start your journey with confidence.
              </p>
            </div>

            <div className="row g-4">
              {services.map((service, index) => (
                <div
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay={`${0.1 + index * 0.12}s`}
                  key={service.title}
                >
                  <Link to={service.link} className="service-pro-card">
                    <div className="service-icon-shell">
                      <i className={`fa ${service.icon}`}></i>
                    </div>

                    <div className="service-tag">
                      <i className="fa fa-sparkles"></i>
                      {service.tag}
                    </div>

                    <h3>{service.title}</h3>

                    <p>{service.desc}</p>

                    <span className="service-arrow">
                      <i className="fa fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="service-cta-box">
              <div>
                <h3>Need a custom travel or event plan?</h3>
                <p className="mb-0">
                  Tell us your idea, budget and date. We will help you create a personalized experience.
                </p>
              </div>

              <Link to="/event-package-request">Create Request</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;