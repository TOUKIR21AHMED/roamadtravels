import axios from "axios";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

export default function Footer() {
  const [footerGallery, setFooterGallery] = useState([]);

  useEffect(() => {
    const fetchFooterGallery = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/package-gallery/random?limit=6`
        );
        setFooterGallery((res.data || []).slice(0, 6));
      } catch (error) {
        console.log("Footer gallery fetch error:", error);
      }
    };
    fetchFooterGallery();
  }, []);

  const getImageUrl = (img) => resolveImageUrl(img);

  return (
    <div>
      {/* Footer Start */}
      <div
        className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Company</h4>
              <a className="btn btn-link" href="/">Home</a>
              <a className="btn btn-link" href="/travel-guide">Travel Guide &amp; Info</a>
              <a className="btn btn-link" href="/Flight">Flight</a>
              <a className="btn btn-link" href="/Visa">Visa</a>
              <a className="btn btn-link" href="/Shop">Shop</a>
              <a className="btn btn-link" href="/Services">Services</a>
              <a className="btn btn-link" href="/Packages">Events &amp; Packages</a>
              <a className="btn btn-link" href="/About">About</a>
              <a className="btn btn-link" href="/Contact">Contact</a>
            </div>

            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Contact</h4>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                Dawodkandi, Comilla, Bangladesh
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                +88017-12345678
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                roamad@gmail.com
              </p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href="/">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-outline-light btn-social" href="/">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-outline-light btn-social" href="https://www.youtube.com/">
                  <i className="fab fa-youtube" />
                </a>
                <a className="btn btn-outline-light btn-social" href="https://www.linkedin.com/">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>

            {/* Gallery */}
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Gallery</h4>
              <div className="row g-2 pt-2">
                {footerGallery.length > 0
                  ? footerGallery.map((img, i) => {
                      const src = getImageUrl(
                        img.image || img.url || img.src || img
                      );
                      const alt = img.title || img.caption || `Gallery ${i + 1}`;
                      return (
                        <div className="col-4" key={i}>
                          <img
                            className="img-fluid bg-light p-1"
                            src={src}
                            alt={alt}
                            style={{
                              width: "100%",
                              height: "70px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      );
                    })
                  : // Fallback placeholders while loading
                    Array.from({ length: 6 }).map((_, i) => (
                      <div className="col-4" key={i}>
                        <div
                          style={{
                            width: "100%",
                            height: "70px",
                            background: "#2a2a2a",
                            borderRadius: "2px",
                            animation: "footerSkel 1.3s infinite ease-in-out alternate",
                          }}
                        />
                      </div>
                    ))}
              </div>

              <style>{`
                @keyframes footerSkel {
                  from { opacity: 0.4; }
                  to   { opacity: 0.75; }
                }
              `}</style>
            </div>

            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Newsletter</h4>
              <p>For Query.</p>
              <div className="position-relative mx-auto" style={{ maxWidth: 400 }}>
                <input
                  className="form-control border-primary w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Your email"
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                ©{" "}
                <a className="border-bottom" href="/">
                  Tourviz
                </a>
                , All Right Reserved. Designed By{" "}
                <a className="border-bottom" href="https://www.linkedin.com/in/toukir-ahmed-w2001/">
                  Toukir Ahmed
                </a>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <a href="/">Home</a>
                  <a href="/">Cookies</a>
                  <a href="/Contact">Help</a>
                  <a href="/Contact">FQAs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
    </div>
  );
}