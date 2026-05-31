import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import { getImageUrl as resolveImageUrl } from "../utils/imageUrl";

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

  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeGalleryImage, setActiveGalleryImage] = useState(null);

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return suggestions.slice(0, 7);
    return suggestions
      .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 7);
  }, [search, suggestions]);

  const getImageUrl = (img) => resolveImageUrl(img);

  const fetchItems = useCallback(async () => {
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
  }, [page, category, duration, timeSlot, currency, minPrice, maxPrice, search]);

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

  const fetchGalleryImages = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/package-gallery/random?limit=9`
      );
      setGalleryImages((res.data || []).slice(0, 9));
    } catch (error) {
      console.log("Gallery fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (activeGalleryImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeGalleryImage]);

  const activeIndex = galleryImages.findIndex(
    (img) => img === activeGalleryImage
  );

  const navigateGallery = (dir) => {
    const next = (activeIndex + dir + galleryImages.length) % galleryImages.length;
    setActiveGalleryImage(galleryImages[next]);
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

        /* ─── Premium Gallery Section ─── */

        .gallery-section {
          padding: 80px 0 90px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #e8f0e4;
        }

        .gallery-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 40% at 15% 20%, rgba(39,127,13,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 85% 80%, rgba(103,185,15,0.04) 0%, transparent 65%);
          pointer-events: none;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 52px;
          position: relative;
          z-index: 1;
        }

        .gallery-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #277f0d;
          margin-bottom: 14px;
        }

        .gallery-eyebrow::before,
        .gallery-eyebrow::after {
          content: '';
          display: block;
          width: 36px;
          height: 1.5px;
          background: #277f0d;
          opacity: 0.45;
        }

        .gallery-heading {
          font-size: 2.8rem;
          font-weight: 900;
          color: #1D3815;
          line-height: 1.15;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }

        .gallery-heading span {
          background: linear-gradient(90deg, #277f0d, #55b80a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gallery-subtext {
          color: #7a8f74;
          font-size: 1rem;
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── Mosaic grid — square cards, generous gap like reference ── */
        .gallery-mosaic {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px 24px;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* Each cell is a square (aspect-ratio 1/1) */
        .gallery-cell {
          position: relative;
          aspect-ratio: 1 / 1;
          cursor: pointer;
          display: block;
          /* Premium outer frame — layered ring effect */
          border-radius: 6px;
          padding: 6px;
          background: linear-gradient(145deg, #ffffff 0%, #eef6e8 50%, #ffffff 100%);
          box-shadow:
            0 0 0 1px rgba(39,127,13,0.14),
            0 8px 28px rgba(29,56,21,0.11),
            0 2px 6px rgba(29,56,21,0.06);
          transition:
            box-shadow 0.42s cubic-bezier(0.23,1,0.32,1),
            transform   0.42s cubic-bezier(0.23,1,0.32,1);
        }

        .gallery-cell:hover {
          box-shadow:
            0 0 0 2px rgba(39,127,13,0.55),
            0 0 0 5px rgba(39,127,13,0.10),
            0 24px 56px rgba(29,56,21,0.18),
            0 6px 16px rgba(29,56,21,0.10);
          transform: translateY(-8px) scale(1.025);
        }

        /* Inner photo container */
        .gallery-cell-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 3px;
          overflow: hidden;
        }

        /* Corner decorative brackets — premium frame detail */
        .gallery-cell::before,
        .gallery-cell::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          z-index: 3;
          pointer-events: none;
          transition: width 0.38s ease, height 0.38s ease, opacity 0.38s ease;
          opacity: 0.55;
        }
        .gallery-cell::before {
          top: -1px; left: -1px;
          border-top: 2px solid #277f0d;
          border-left: 2px solid #277f0d;
          border-radius: 4px 0 0 0;
        }
        .gallery-cell::after {
          bottom: -1px; right: -1px;
          border-bottom: 2px solid #277f0d;
          border-right: 2px solid #277f0d;
          border-radius: 0 0 4px 0;
        }
        .gallery-cell:hover::before,
        .gallery-cell:hover::after {
          width: 28px;
          height: 28px;
          opacity: 1;
        }

        /* Extra corner brackets via JS-rendered spans */
        .gallery-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          z-index: 3;
          pointer-events: none;
          transition: width 0.38s ease, height 0.38s ease, opacity 0.38s ease;
          opacity: 0.55;
        }
        .gallery-corner.tr {
          top: -1px; right: -1px;
          border-top: 2px solid #277f0d;
          border-right: 2px solid #277f0d;
          border-radius: 0 4px 0 0;
        }
        .gallery-corner.bl {
          bottom: -1px; left: -1px;
          border-bottom: 2px solid #277f0d;
          border-left: 2px solid #277f0d;
          border-radius: 0 0 0 4px;
        }
        .gallery-cell:hover .gallery-corner {
          width: 28px;
          height: 28px;
          opacity: 1;
        }

        /* Image */
        .gallery-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
        }

        .gallery-cell:hover img {
          transform: scale(1.11);
        }

        /* Gradient shine sweep on hover */
        .gallery-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 30%,
            rgba(255,255,255,0.18) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          transition: transform 0s;
          pointer-events: none;
          z-index: 2;
        }
        .gallery-cell:hover .gallery-shine {
          transform: translateX(100%);
          transition: transform 0.65s cubic-bezier(0.23,1,0.32,1);
        }

        /* Overlay */
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(12, 38, 5, 0.78) 0%,
            rgba(12, 38, 5, 0.18) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.40s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px 14px;
          z-index: 2;
        }
        .gallery-cell:hover .gallery-overlay { opacity: 1; }

        /* Zoom icon — pill style */
        .gallery-zoom-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #1D3815;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.30s ease, transform 0.30s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.14);
          z-index: 3;
          pointer-events: none;
        }
        .gallery-cell:hover .gallery-zoom-icon {
          opacity: 1;
          transform: translateY(0);
        }

        /* Image index badge */
        .gallery-index-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: 26px;
          height: 26px;
          background: rgba(39,127,13,0.85);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.68rem;
          font-weight: 900;
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.32s ease 0.05s, transform 0.32s ease 0.05s;
          z-index: 3;
          pointer-events: none;
        }
        .gallery-cell:hover .gallery-index-badge {
          opacity: 1;
          transform: scale(1);
        }

        /* Caption */
        .gallery-caption {
          color: #fff;
          font-size: 0.85rem;
          font-weight: 800;
          line-height: 1.3;
          transform: translateY(10px);
          opacity: 0;
          transition: transform 0.36s ease, opacity 0.36s ease;
        }
        .gallery-cell:hover .gallery-caption { transform: translateY(0); opacity: 1; }

        .gallery-caption-sub {
          color: rgba(255,255,255,0.62);
          font-size: 0.73rem;
          font-weight: 600;
          margin-top: 3px;
          transform: translateY(10px);
          opacity: 0;
          transition: transform 0.38s ease 0.05s, opacity 0.38s ease 0.05s;
        }
        .gallery-cell:hover .gallery-caption-sub { transform: translateY(0); opacity: 1; }

        /* Skeleton */
        .gallery-skeleton {
          aspect-ratio: 1/1;
          border-radius: 6px;
          background: linear-gradient(90deg, #eaf3e6 0%, #f8fbf6 50%, #eaf3e6 100%);
          background-size: 200% 100%;
          animation: gallerySkel 1.3s infinite linear;
        }
        @keyframes gallerySkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ─── Lightbox ─── */
        .gallery-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(5, 14, 3, 0.96);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbFadeIn 0.25s ease;
          backdrop-filter: blur(6px);
        }

        @keyframes lbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .gallery-lightbox-inner {
          position: relative;
          max-width: 88vw;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: lbSlideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes lbSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .gallery-lightbox-img {
          max-width: 88vw;
          max-height: 78vh;
          border-radius: 20px;
          object-fit: contain;
          box-shadow: 0 40px 100px rgba(0,0,0,0.7);
          display: block;
        }

        .gallery-lightbox-caption {
          margin-top: 18px;
          color: rgba(255,255,255,0.8);
          font-size: 0.92rem;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.02em;
          background: rgba(0,0,0,0.35);
          padding: 8px 20px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }

        .lb-close {
          position: fixed;
          top: 22px;
          right: 26px;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          backdrop-filter: blur(8px);
          z-index: 10000;
        }

        .lb-close:hover {
          background: rgba(255,255,255,0.22);
        }

        .lb-nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          backdrop-filter: blur(8px);
          z-index: 10000;
        }

        .lb-nav:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-50%) scale(1.08);
        }

        .lb-nav.prev { left: 22px; }
        .lb-nav.next { right: 22px; }

        .lb-counter {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.45);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          z-index: 10000;
        }

        /* Gallery responsive */
        @media (max-width: 768px) {
          .gallery-mosaic {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 14px;
            padding: 0 14px;
          }

          .gallery-cell:nth-child(9) {
            display: none;
          }

          .gallery-heading {
            font-size: 2rem;
          }

          .lb-nav.prev { left: 8px; }
          .lb-nav.next { right: 8px; }
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
            <h3>Can't find your perfect Tour Package?</h3>
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
                          src={getImageUrl(item.mainImage)}
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

      {/* ─── Premium Gallery Section ─── */}
      {galleryImages.length > 0 && (
        <section className="gallery-section">
          <div className="gallery-header">
            <div className="gallery-eyebrow">
              <span></span>
              Our Gallery
              <span></span>
            </div>
            <h2 className="gallery-heading">
              Captured <span>Moments</span>
            </h2>
            <p className="gallery-subtext">
              A curated glimpse into the experiences, landscapes, and memories
              our travellers take home.
            </p>
          </div>

          <div className="gallery-mosaic">
            {galleryImages.map((img, i) => {
              const title = img.title || img.caption || img.packageTitle || "";
              const sub = img.location || img.category || "";
              const src = getImageUrl(img.image || img.url || img.src || img);

              return (
                <div
                  key={i}
                  className="gallery-cell"
                  onClick={() => setActiveGalleryImage(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveGalleryImage(img)}
                  aria-label={title || `Gallery image ${i + 1}`}
                >
                  {/* Extra corner brackets (top-right & bottom-left) */}
                  <span className="gallery-corner tr"></span>
                  <span className="gallery-corner bl"></span>

                  {/* Inner photo wrapper */}
                  <div className="gallery-cell-inner">
                    <img src={src} alt={title || `Gallery ${i + 1}`} loading="lazy" />

                    {/* Shine sweep */}
                    <div className="gallery-shine"></div>

                    {/* Gradient overlay */}
                    <div className="gallery-overlay">
                      {title && <div className="gallery-caption">{title}</div>}
                      {sub   && <div className="gallery-caption-sub">{sub}</div>}
                    </div>

                    {/* Zoom pill */}
                    <div className="gallery-zoom-icon">
                      <i className="fa fa-expand-alt"></i>
                      VIEW
                    </div>

                    {/* Index badge */}
                    <div className="gallery-index-badge">{i + 1}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Lightbox ─── */}
      {activeGalleryImage && (() => {
        const img = activeGalleryImage;
        const src = getImageUrl(img.image || img.url || img.src || img);
        const title = img.title || img.caption || img.packageTitle || "";
        const sub = img.location || img.category || "";

        return (
          <div
            className="gallery-lightbox"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveGalleryImage(null);
            }}
          >
            {/* Close */}
            <button
              className="lb-close"
              onClick={() => setActiveGalleryImage(null)}
              aria-label="Close"
            >
              <i className="fa fa-times"></i>
            </button>

            {/* Prev */}
            {galleryImages.length > 1 && (
              <button
                className="lb-nav prev"
                onClick={() => navigateGallery(-1)}
                aria-label="Previous"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
            )}

            <div className="gallery-lightbox-inner">
              <img
                className="gallery-lightbox-img"
                src={src}
                alt={title || "Gallery"}
              />
              {(title || sub) && (
                <div className="gallery-lightbox-caption">
                  {title && <span>{title}</span>}
                  {title && sub && <span> &middot; </span>}
                  {sub && <span style={{ opacity: 0.65 }}>{sub}</span>}
                </div>
              )}
            </div>

            {/* Next */}
            {galleryImages.length > 1 && (
              <button
                className="lb-nav next"
                onClick={() => navigateGallery(1)}
                aria-label="Next"
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            )}

            {/* Counter */}
            <div className="lb-counter">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </div>
        );
      })()}
    </div>
  );
}