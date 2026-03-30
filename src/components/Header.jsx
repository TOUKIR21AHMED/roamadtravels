import React, { useEffect, useState } from 'react'
import API_BASE_URL from "../config";
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  FaShoppingBag,
  FaPassport,
  FaPlane,
  FaHome,
  FaInfoCircle,
  FaConciergeBell,
  FaSuitcaseRolling,
  FaCompass,
  FaPhoneAlt,
  FaList
} from "react-icons/fa";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [guideMenuOpen, setGuideMenuOpen] = useState(false)
const [divisions, setDivisions] = useState([])
const [guideDistricts, setGuideDistricts] = useState([])
const [activeDivisionName, setActiveDivisionName] = useState("")

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

const fetchDivisions = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/divisions`);

    const sortedDivisions = res.data.sort((a, b) => {
      return (
        divisionOrder.indexOf(a.nameBn) -
        divisionOrder.indexOf(b.nameBn)
      );
    });

    setDivisions(sortedDivisions);
  } catch (error) {
    console.log(error);
  }
};

const fetchGuideDistricts = async (divisionId, divisionName) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/districts/by-division/${divisionId}`)
    setGuideDistricts(res.data)
    setActiveDivisionName(divisionName)
  } catch (error) {
    console.log("Guide district fetch error:", error)
  }
}

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)
  
  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeMenu()
      setGuideMenuOpen(false)
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  fetchDivisions()

  return () => document.removeEventListener('keydown', handleKeyDown)
}, [])

  return (
    <div>
      <style>{`
  body {
    overflow-x: hidden;
  }



.guide-mega-menu-wrap {
  position: relative;
}
  .guide-mega-menu-wrap::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 20px;
}

.guide-mega-menu-trigger {
  display: flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  color: #1D3815;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.25s ease;
  cursor: pointer;
  white-space: nowrap;
  // padding-bottom: 18px;
}

.guide-mega-menu-trigger:hover {
  color: #277f0d;
}

.guide-mega-menu-box {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-35%);
  width: 760px;
  max-width: 90vw;
  background: #cacacab3;
  border-radius: 24px;
  box-shadow: 0 20px 55px rgba(0,0,0,0.14);
  overflow: hidden;
  z-index: 3000;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.guide-mega-left {
  background: #f6fbf4;
  padding: 20px;
  border-right: 1px solid #e7efe2;
}

.guide-mega-right {
  padding: 20px;
  background: #ffffff;
}

.guide-mega-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1D3815;
  margin-bottom: 14px;
}

.guide-mega-subtitle {
  font-size: 0.92rem;
  color: #64705f;
  margin-bottom: 14px;
}

.guide-division-item {
  width: 100%;
  border: none;
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 10px;
  text-align: left;
  font-weight: 600;
  color: #1D3815;
  transition: 0.22s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
}

.guide-division-item:hover,
.guide-division-item.active {
  background: #277f0d;
  color: white;
}

.guide-district-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.guide-district-link {
  display: block;
  text-decoration: none;
  color: #1D3815;
  background: #f9fcf8;
  border: 1px solid #e7efe2;
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 600;
  transition: 0.22s ease;
}

.guide-district-link:hover {
  background: #eef8ea;
  color: #277f0d;
  transform: translateY(-2px);
}

.guide-bangladesh-badge {
  display: inline-block;
  margin-bottom: 12px;
  background: #eef8ea;
  color: #277f0d;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 7px 12px;
  border-radius: 999px;
}

@media (max-width: 991px) {
  .guide-mega-menu-wrap {
    display: none;
  }
}

@media (max-width: 1200px) {
  .guide-mega-menu-box {
    width: 680px;
  }
}



  /* ─────────────────────────────
     Animated Fixed Glass Arrow Button
  ───────────────────────────── */
  .floating-arrow-btn {
    position: fixed !important;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99999;

    width: 28px;
    height: 82px;
    
    border-radius: 0 18px 18px 0;

    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    border: 2px solid rgba(0,0,0,0.10);

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    opacity: 1;
    visibility: visible;
    overflow: hidden;

    box-shadow:
      0 8px 24px rgba(0,0,0,0.18),
      0 2px 8px rgba(0,0,0,0.10);

    transition: all 0.25s ease;
  }

  .floating-arrow-btn::before,
  .floating-arrow-btn::after{
    border-radius: inherit;
  }

  .floating-arrow-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.04)
    );
    opacity: 1;
    pointer-events: none;
  }

  .floating-arrow-btn:hover {
    transform: translateY(-50%) scale(1.05);
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
  }

  .floating-arrow-btn .arrow-icon {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    color: #5cfa00;
    transition: transform 0.35s ease;
    animation: arrowNudge 1.8s ease-in-out infinite;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  }

  .floating-arrow-btn.open .arrow-icon {
    transform: rotate(180deg);
    animation: none;
  }

  @keyframes arrowNudge {
    0% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(3px);
    }
    40% {
      transform: translateX(0);
    }
    60% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  .floating-arrow-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.22);
    animation: softPulse 2.4s infinite;
  }

  .floating-arrow-btn.open::after {
    animation: none;
  }

  @keyframes softPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.18);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  /* ─────────────────────────────
     Overlay
  ───────────────────────────── */
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    z-index: 1040;
    opacity: ${menuOpen ? '1' : '0'};
    pointer-events: ${menuOpen ? 'all' : 'none'};
    transition: opacity 0.3s ease;
  }

  /* ─────────────────────────────
     Drawer
  ───────────────────────────── */
  .sidebar-drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    max-width: 85vw;
    height: 100%;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(10px);
    z-index: 1050;
    transform: ${menuOpen ? 'translateX(0)' : 'translateX(-110%)'};
    transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 8px 0 28px rgba(0,0,0,0.14);
    border-radius: 0 24px 24px 0;
    overflow: hidden;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 20px;
    border-bottom: 1px solid #eef2f5;
    background: linear-gradient(180deg, #ffffff, #eef8fd);
  }

  .sidebar-brand {
    font-size: 1.55rem;
    font-weight: 800;
    color: #277f0d;
    text-decoration: none;
    letter-spacing: 1px;
  }

  .sidebar-close-btn {
    background: #ffffff;
    border: 1px solid #e9eef2;
    font-size: 1rem;
    color: #444;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
  }

  .sidebar-close-btn:hover {
    background: #ffeaea;
    color: #d11a2a;
    transform: rotate(90deg);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 14px 0;
    flex: 1;
    overflow-y: auto;
  }

  .sidebar-nav a {
    padding: 14px 24px;
    color: #1f2937;
    text-decoration: none;
    font-size: 0.98rem;
    font-weight: 600;
    transition: all 0.25s ease;
    border-left: 3px solid transparent;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sidebar-nav a:hover {
    background: #eef8fd;
    color: #277f0d;
    border-left: 3px solid #277f0d;
    padding-left: 28px;
  }

  .sidebar-dropdown-title {
    padding: 14px 24px;
    color: #1f2937;
    font-size: 0.98rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: 3px solid transparent;
    transition: all 0.25s ease;
    gap: 10px;
  }

  .sidebar-dropdown-title:hover {
    background: #eef8fd;
    color: #277f0d;
    border-left: 3px solid #277f0d;
    padding-left: 28px;
  }

  .sidebar-dropdown-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sidebar-sub-nav {
    display: flex;
    flex-direction: column;
    background: #f8fbfd;
    animation: fadeSlideDown 0.25s ease;
  }

  @keyframes fadeSlideDown {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sidebar-sub-nav a {
    padding: 11px 20px 11px 50px;
    color: #5b6572;
    font-size: 0.91rem;
    font-weight: 500;
    border-left: none !important;
  }

  .sidebar-sub-nav a:hover {
    background: #eaf6fb;
    color: #277f0d;
    border-left: none !important;
    padding-left: 56px;
  }

  .sidebar-footer {
    padding: 18px 20px 22px;
    border-top: 1px solid #eef2f5;
    background: #fcfeff;
  }

  .main-navbar {
    background: #FEFEFE;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    padding: 4px 15px 4px 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .navbar-brand-text {
    font-size: 1.6rem;
    font-weight: 800;
    color: #06A3DA;
    text-decoration: none;
    letter-spacing: 1px;
  }

  .main-nav-menu {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
  }

  .main-nav-menu a,
  .main-nav-dropdown-title {
    display: flex;
    align-items: center;
    gap: 7px;
    text-decoration: none;
    color: #1D3815;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.25s ease;
    cursor: pointer;
    white-space: nowrap;
  }

  .main-nav-menu a:hover,
  .main-nav-dropdown-title:hover {
    color: #277f0d;
  }

  .main-nav-dropdown {
    position: relative;
  }

  .main-nav-dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    min-width: 190px;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    padding: 10px 0;
    z-index: 1200;
  }

  .main-nav-dropdown-menu a {
    display: block;
    padding: 10px 16px;
    color: #1f2937;
    font-size: 0.92rem;
    font-weight: 500;
    text-decoration: none;
  }

  .main-nav-dropdown-menu a:hover {
    background: #eef8fd;
    color: #277f0d;
  }

  @media (max-width: 991px) {
    .main-navbar {
      padding-left: 60px;
      justify-content: space-between;
    }

    .navbar-brand-text {
      font-size: 1.3rem;
    }

    .main-nav-menu {
      display: none;
    }

    .floating-arrow-btn {
      left: 0px !important;
      top: 12% !important;
      width: 26px !important;
      height: 76px !important;
      border-radius: 0px 16px 16px 0px !important;
      z-index: 99999 !important;
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .floating-arrow-btn .arrow-icon {
      font-size: 0.9rem !important;
    }
  }

  @media (max-width: 576px) {
    .floating-arrow-btn {
      left: 0px !important;
      top: 13.5% !important;
      width: 26px !important;
      height: 76px !important;
      border-radius: 0px 16px 16px 0px !important;
      z-index: 99999 !important;
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .floating-arrow-btn .arrow-icon {
      font-size: 0.9rem !important;
    }

    .sidebar-drawer {
      width: 270px;
    }

    .main-navbar {
      padding: 12px 14px 12px 54px;
    }
  }

  .navbar-brand-text{
    display:flex;
    align-items:center;
    gap:8px;
    text-decoration:none;
  }

  .nav-logo1{
    height:58px;
    width:auto;
    object-fit:contain;
  }

  .nav-logo2{
    height:42px;
    width:auto;
    object-fit:contain;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.55rem;
    font-weight: 800;
    color: #277f0d;
    text-decoration: none;
    letter-spacing: 1px;
  }

  .brand-logo {
    height: 52px;
    width: auto;
    display: block;
    object-fit: contain;
  }

  .brand-text-logo{
    height: 52px;
    width: auto;
    padding-top: 10px;
    object-fit: contain;
  }

  .nav-icon{
    font-size:18px;
    color:#1D3815;
    min-width:22px;
  }

  .sidebar-nav a:hover .nav-icon,
  .main-nav-menu a:hover .nav-icon,
  .main-nav-dropdown-title:hover .nav-icon {
    color:#277f0d;
  }

  .register-btn{
    background:#277f0d;
    border-color:#277f0d;
    color:#fff;
  }

  .register-btn:hover{
    background:#1d5c09;
    border-color:#1d5c09;
  }
`}</style>

      {/* Topbar */}
      <div className="container-fluid bg-dark px-5 d-none d-lg-block">
        <div className="row gx-0">
          <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
            <div className="d-inline-flex align-items-center" style={{ height: 45 }}>
              <small className="me-3 text-light">
                <i className="fa fa-map-marker-alt me-2" />
                Dawodkandi, Comilla, Bangladesh
              </small>
              <small className="me-3 text-light">
                <i className="fa fa-phone-alt me-2" />
                +88017-12345678
              </small>
              <small className="text-light">
                <i className="fa fa-envelope-open me-2" />
                roamad@gmail.com
              </small>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end">
            <div className="d-inline-flex align-items-center" style={{ height: 45 }}>
              <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href="#"><i className="fab fa-twitter fw-normal" /></a>
              <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href="#"><i className="fab fa-facebook-f fw-normal" /></a>
              <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href="#"><i className="fab fa-linkedin-in fw-normal" /></a>
              <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href="#"><i className="fab fa-instagram fw-normal" /></a>
              <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle" href="#"><i className="fab fa-youtube fw-normal" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-navbar">
        <Link to="/" className="navbar-brand-text">
          <img src="/assets/img/logo.png" alt="logo" className="nav-logo1" />
          <img src="/assets/img/logo2.png" alt="logo text" className="nav-logo2" />
        </Link>

        <div className="main-nav-menu">
          <Link to="/">
            <FaHome className="nav-icon" /> Home
          </Link>

          <div
  className="guide-mega-menu-wrap"
  onMouseEnter={() => setGuideMenuOpen(true)}
  onMouseLeave={() => setGuideMenuOpen(false)}
>
  <div className="guide-mega-menu-trigger">
    <Link to="/travel-guide"><FaCompass className="nav-icon" /> Travel Guide & Info</Link>
    
  </div>

  {guideMenuOpen && (
    <div className="guide-mega-menu-box">
      <div className="guide-mega-left">
        <div className="guide-bangladesh-badge">বাংলাদেশ</div>
        <h4 className="guide-mega-title">বিভাগ সমূহ</h4>
        

        {divisions.map((division) => (
          <button
            key={division._id}
            className={`guide-division-item ${activeDivisionName === division.nameBn ? "active" : ""}`}
            onMouseEnter={() => fetchGuideDistricts(division._id, division.nameBn)}
          >
            <i className="fa fa-map-marker-alt me-2"></i> {division.nameBn}
          </button>
        ))}
      </div>

      <div className="guide-mega-right">
        <h4 className="guide-mega-title">
          {activeDivisionName ? `${activeDivisionName} বিভাগের জেলা` : "জেলা সমূহ"}
        </h4>

        <div className="guide-district-grid">
          {guideDistricts.map((district) => (
            <Link
              key={district._id}
              to={`/travel-guide/district/${district.slug}`}
              className="guide-district-link"
              onClick={() => setGuideMenuOpen(false)}
            >
              <i className="fa fa-map-marker-alt me-2"></i> {district.nameBn}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )}
</div>

          <Link to="/Flight">
            <FaPlane className="nav-icon" /> Flight
          </Link>

          <Link to="/Visa">
            <FaPassport className="nav-icon" /> Visa
          </Link>

          <Link to="/Shop">
            <FaShoppingBag className="nav-icon" /> Shop
          </Link>

          <Link to="/Services">
            <FaConciergeBell className="nav-icon" /> Services
          </Link>

          <Link to="/Packages">
            <FaSuitcaseRolling className="nav-icon" /> Packages
          </Link>

          <MainPagesDropdown />

          <Link to="/About">
            <FaInfoCircle className="nav-icon" /> About
          </Link>

          <Link to="/Contact">
            <FaPhoneAlt className="nav-icon" /> Contact
          </Link>
        </div>

        <Link to="/" className="btn register-btn rounded-pill py-2 px-4">
          Register
        </Link>
      </div>

      {/* Fixed Left-Middle Animated Arrow Button */}
      {!menuOpen && (
        <button
          className="floating-arrow-btn"
          onClick={toggleMenu}
          aria-label="Toggle sidebar menu"
        >
          <span className="arrow-icon">
            <i className="fa fa-chevron-right" />
          </span>
        </button>
      )}

      {/* Overlay */}
      <div className="sidebar-overlay" onClick={closeMenu}></div>

      {/* Sidebar Drawer */}
      <div className="sidebar-drawer">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={closeMenu}>
            <img src="/assets/img/logo.png" alt="ROAMAD Logo" className="brand-logo" />
            <img src="/assets/img/logo2.png" alt="ROAMAD Travels BD" className="brand-text-logo" />
          </Link>

          <button className="sidebar-close-btn" onClick={closeMenu}>
            <i className="fa fa-times" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" onClick={closeMenu}>
            <FaHome className="nav-icon"/> Home
          </Link>

          <Link to="/travel-guide" onClick={closeMenu}>
            <FaCompass className="nav-icon" /> Travel Guide & Info
          </Link>

          <Link to="/Flight" onClick={closeMenu}>
            <FaPlane className="nav-icon" /> Flight
          </Link>

          <Link to="/Visa" onClick={closeMenu}>
            <FaPassport className="nav-icon" /> Visa
          </Link>

          <Link to="/Shop" onClick={closeMenu}>
            <FaShoppingBag className="nav-icon" /> Shop
          </Link>
          
          <Link to="/Services" onClick={closeMenu}>
            <FaConciergeBell className="nav-icon"/> Services
          </Link>

          <Link to="/Packages" onClick={closeMenu}>
            <FaSuitcaseRolling className="nav-icon"/> Packages
          </Link>

          <PagesDropdown closeMenu={closeMenu} />

          <Link to="/About" onClick={closeMenu}>
            <FaInfoCircle className="nav-icon"/> About
          </Link>

          <Link to="/Contact" onClick={closeMenu}>
            <FaPhoneAlt className="nav-icon"/> Contact
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="btn register-btn rounded-pill py-2 px-4" onClick={closeMenu}>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

function PagesDropdown({ closeMenu }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="sidebar-dropdown-title" onClick={() => setOpen(!open)}>
        <div className="sidebar-dropdown-left">
          <FaList className="nav-icon" />
          Pages
        </div>
        <i
          className={`fa fa-chevron-${open ? 'up' : 'down'}`}
          style={{ fontSize: '0.75rem' }}
        />
      </div>

      {open && (
        <div className="sidebar-sub-nav">
          <Link to="/Destination" onClick={closeMenu}>Destination</Link>
          <Link to="/Booking" onClick={closeMenu}>Booking</Link>
          <Link to="/Testimonial" onClick={closeMenu}>Testimonial</Link>
          <Link to="/Error" onClick={closeMenu}>404 Page</Link>
        </div>
      )}
    </div>
  )
}

function MainPagesDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="main-nav-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="main-nav-dropdown-title">
        <FaList className="nav-icon" />
        Pages
        <i
          className={`fa fa-chevron-${open ? 'up' : 'down'}`}
          style={{ fontSize: '0.7rem' }}
        />
      </div>

      {open && (
        <div className="main-nav-dropdown-menu">
          <Link to="/Destination">Destination</Link>
          <Link to="/Booking">Booking</Link>
          <Link to="/Testimonial">Testimonial</Link>
          <Link to="/Error">404 Page</Link>
        </div>
      )}
    </div>
  )
}

export default Header