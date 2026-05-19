import React from "react";
import { Link } from "react-router-dom";

function About() {
  const services = [
    {
      icon: "fa-plane",
      title: "Flight Booking",
      link: "/Flight",
      desc: "Domestic and international flight booking with fast support.",
    },
    {
      icon: "fa-passport",
      title: "Visa Assistance",
      link: "/Visa",
      desc: "Professional visa guidance and documentation support.",
    },
    {
      icon: "fa-map-marked-alt",
      title: "Travel Guide",
      link: "/travel-guide",
      desc: "Explore destinations, tourist spots and local travel information.",
    },
    {
      icon: "fa-calendar-check",
      title: "Events & Packages",
      link: "/packages",
      desc: "Premium travel events, tours and luxury packages.",
    },
    {
      icon: "fa-users",
      title: "Custom Event Planning",
      link: "/event-package-request",
      desc: "Personalized tourism and event management solutions.",
    },
    {
      icon: "fa-shopping-cart",
      title: "Travel Shop",
      link: "/Shop",
      desc: "Purchase travel essentials and tourism products online.",
    },
  ];

  return (
    <div className="about-page">
      <style>{`
        .about-page {
          background: linear-gradient(135deg, #f4f8f2 0%, #ffffff 50%, #eef7ea 100%);
          overflow: hidden;
        }

        .about-hero {
          min-height: 82vh;
          display: flex;
          align-items: center;
          background:
            linear-gradient(135deg, rgba(29,56,21,0.94), rgba(39,127,13,0.72)),
            url('/assets/img/bg-hero.jpg');
          background-size: cover;
          background-position: center;
          color: white;
          position: relative;
        }

        .about-hero::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          right: -120px;
          top: -120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.09);
        }

        .about-hero-content {
          position: relative;
          z-index: 2;
        }

        .about-kicker {
          font-weight: 900;
          letter-spacing: 3px;
          color: #9cff73;
          margin-bottom: 18px;
        }

        .about-title {
          font-size: clamp(2.7rem, 6vw, 5.8rem);
          font-weight: 950;
          line-height: 1.08;
          margin-bottom: 24px;
        }

        .about-title span {
          color: #9cff73;
        }

        .about-text {
          color: #5d6957;
          line-height: 1.9;
          font-size: 17px;
        }

        .soft-card {
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
          border: 1px solid rgba(39,127,13,0.08);
        }

        .feature-pill {
          background: #fff;
          padding: 15px 18px;
          border-radius: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          height: 100%;
        }

        .service-link-card {
          background: #fff;
          padding: 35px;
          border-radius: 30px;
          height: 100%;
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
          transition: 0.35s ease;
          display: block;
          text-decoration: none;
          color: inherit;
          border: 1px solid rgba(39,127,13,0.08);
        }

        .service-link-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 28px 70px rgba(29,56,21,0.16);
          color: inherit;
        }

        .service-icon {
          width: 78px;
          height: 78px;
          border-radius: 24px;
          background: linear-gradient(135deg, #1D3815, #66b80f);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 25px;
          box-shadow: 0 15px 35px rgba(39,127,13,0.28);
          transition: 0.35s ease;
        }

        .service-link-card:hover .service-icon {
          transform: rotate(-8deg) scale(1.08);
        }

        .stat-card {
          background: #fff;
          padding: 38px 24px;
          border-radius: 28px;
          text-align: center;
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
          height: 100%;
        }

        .cta-box {
          background: linear-gradient(135deg, #1D3815, #277f0d);
          border-radius: 40px;
          padding: 70px 40px;
          text-align: center;
          color: #fff;
          box-shadow: 0 30px 70px rgba(29,56,21,0.25);
        }
      `}</style>

      <section className="about-hero">
        <div className="container about-hero-content">
          <div className="row">
            <div className="col-lg-9">
              <h6 className="about-kicker">ABOUT ROAMAD TRAVELS BD</h6>

              <h1 className="about-title">
                Travel Beyond <span>Boundaries</span>
              </h1>

              <p style={{ fontSize: 19, lineHeight: 1.9, maxWidth: 780 }}>
                ROAMAD TRAVELS BD is a modern travel and tourism platform
                designed to simplify flights, visa support, travel guides,
                event packages, custom trips and travel shopping in one place.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/packages" className="btn btn-success rounded-pill px-5 py-3 fw-bold">
                  Explore Packages
                </Link>

                <Link to="/contact" className="btn btn-light rounded-pill px-5 py-3 fw-bold">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-12">
            <h6 className="section-title bg-white text-start text-primary pe-3">
              WHO WE ARE
            </h6>

            <h1 className="mb-4" style={{ fontWeight: 900, color: "#1D3815" }}>
              Complete Tourism & <span className="text-primary">Travel Solution</span>
            </h1>

            <p className="about-text">
              ROAMAD TRAVELS BD combines travel technology, premium service and
              modern tourism management into one complete ecosystem. Our goal is
              to make travel planning easier, faster and more reliable for every
              traveler.
            </p>

            <p className="about-text">
              From flight booking and visa processing to custom event planning,
              travel packages, destination information and e-commerce support —
              our platform is built to deliver a smooth and professional travel
              experience.
            </p>

            <div className="row gy-3 gx-4 mt-4">
              {[
                "Flight Booking",
                "Visa Processing",
                "Events & Packages",
                "Travel Guide",
                "Custom Event Management",
                "Travel E-commerce",
                "Smart Request System",
                "24/7 Customer Support",
              ].map((item, index) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                  <div className="feature-pill">
                    <i className="fa fa-check text-primary me-2"></i>
                    <strong style={{ color: "#1D3815" }}>{item}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h6 className="section-title bg-white text-center text-primary px-3">
            OUR SERVICES
          </h6>

          <h1 style={{ fontWeight: 900, color: "#1D3815" }}>
            Everything You Need For Travel
          </h1>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <Link to={service.link} className="service-link-card">
                <div className="service-icon">
                  <i className={`fa ${service.icon}`}></i>
                </div>

                <h4 style={{ fontWeight: 800, color: "#1D3815", marginBottom: 15 }}>
                  {service.title}
                </h4>

                <p style={{ color: "#667063", lineHeight: 1.8, marginBottom: 18 }}>
                  {service.desc}
                </p>

                <span style={{ color: "#277f0d", fontWeight: 900 }}>
                  Explore <i className="fa fa-arrow-right ms-1"></i>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-fluid py-5">
        <div className="container">
          <div className="row g-4">
            {[
              ["24/7", "Customer Support"],
              ["100+", "Travel Experiences"],
              ["Premium", "Tourism Solutions"],
              ["Trusted", "Travel Platform"],
            ].map(([number, title], index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="stat-card">
                  <h1 style={{ fontSize: 48, fontWeight: 900, color: "#277f0d" }}>
                    {number}
                  </h1>
                  <h5 style={{ color: "#1D3815", fontWeight: 800 }}>{title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="soft-card p-5">
          <h6 className="section-title bg-white text-start text-primary pe-3">
            WHY CHOOSE US
          </h6>

          <h1 className="mb-4" style={{ fontWeight: 900, color: "#1D3815" }}>
            Modern Technology Meets Premium Travel
          </h1>

          <p className="about-text">
            We focus on modern tourism experiences powered by premium design,
            smart systems and customer-focused services. Our platform simplifies
            tourism management while creating memorable travel experiences.
          </p>

          <div className="row g-3 mt-3">
            {[
              "Fast and responsive customer service",
              "Premium travel package experience",
              "Reliable tourism and visa support",
              "Modern and secure booking workflow",
              "Customizable event and travel solutions",
              "Easy admin-managed travel system",
            ].map((point, index) => (
              <div className="col-md-6" key={index}>
                <div className="d-flex align-items-start">
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "#277f0d",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 15,
                      flexShrink: 0,
                    }}
                  >
                    <i className="fa fa-check"></i>
                  </div>

                  <p style={{ marginBottom: 0, color: "#5d6957", lineHeight: 1.8 }}>
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="cta-box">
          <h1 style={{ fontWeight: 900, marginBottom: 20 }}>
            Start Your Journey With ROAMAD
          </h1>

          <p style={{ maxWidth: 780, margin: "0 auto 30px", lineHeight: 1.9, fontSize: 18 }}>
            Explore premium destinations, customized events, smart travel
            planning and unforgettable experiences with our modern tourism platform.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/packages" className="btn btn-light rounded-pill px-5 py-3 fw-bold">
              Explore Packages
            </Link>

            <Link to="/contact" className="btn btn-success rounded-pill px-5 py-3 fw-bold">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;