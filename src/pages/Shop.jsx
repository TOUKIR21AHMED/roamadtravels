import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaSearch, FaShoppingCart, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import API_BASE_URL from "../config";


const ProductSkeleton = () => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="shop-product-card p-3">

        <div className="skeleton-img"></div>

        <div className="skeleton-line"></div>

        <div className="skeleton-line short"></div>

        <div className="skeleton-btn"></div>

      </div>
    </div>
  );
};

const Shop = () => {
  const [wishlist, setWishlist] = useState(() => {
  const saved = localStorage.getItem("shop_wishlist");
  return saved ? JSON.parse(saved) : [];
});

  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [sortOption, setSortOption] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [activeProduct, setActiveProduct] = useState(null);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("shop_cart_items");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
  localStorage.setItem("shop_wishlist", JSON.stringify(wishlist));
}, [wishlist]);

  useEffect(() => {
    localStorage.setItem("shop_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/shop-banners/active/list`);
      setBanners(res.data || []);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/product-categories`);
      const activeCats = (res.data || []).filter((cat) => cat.status === "active");
      setCategories(activeCats);

      if (activeCats.length > 0 && !activeCategory) {
        setActiveCategory(activeCats[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setMessage("");

      const params = {
        page: currentPage,
        limit: 9,
      };

      if (sortOption) params.sort = sortOption;

      // Global search
      if (searchText.trim().length >= 2) {
        params.search = searchText.trim();
      } else if (activeCategory) {
        params.categoryId = activeCategory;
      }

      const res = await axios.get(`${API_BASE_URL}/api/products`, { params });

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalProducts(res.data.totalProducts || 0);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setMessage("Products load করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory || searchText.trim().length >= 2) {
      fetchProducts();
    }
  }, [activeCategory, currentPage, sortOption, searchText]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [banners]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);

    if (showSearch) {
      setSearchText("");
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

const toggleWishlist = (product) => {
  const exists = wishlist.find(p => p._id === product._id);

  if(exists){
    setWishlist(wishlist.filter(p => p._id !== product._id));
  }else{
    setWishlist([...wishlist, product]);
  }
};

const addToCart = (product) => {
  setCartItems((prev) => {
    const existing = prev.find((item) => item.productId === product._id);

    if (existing) {
      return prev.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
        categoryName: product.categoryId?.name || "",
      },
    ];
  });
};

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const activeCategoryName =
    categories.find((cat) => cat._id === activeCategory)?.name || "";

  return (
    <div className="container py-5">
      {/* Carousel */}
      <section className="shop-carousel mb-5">
        <div className="shop-carousel-box position-relative overflow-hidden rounded-4 shadow">
          {banners.length > 0 ? (
            <>
              <img
                src={banners[currentBanner]?.image}
                alt={banners[currentBanner]?.title || "Shop Banner"}
                className="w-100 shop-carousel-image"
              />

              <div className="shop-carousel-overlay">
                <div>
                  <h2 className="fw-bold text-white mb-2">
                    {banners[currentBanner]?.title || "ROAMAD Shop"}
                  </h2>
                  <p className="text-white mb-0">
                    Premium products for your lifestyle
                  </p>
                </div>
              </div>

              {banners.length > 1 && (
                <>
                  <button className="shop-carousel-btn left" onClick={prevBanner}>
                    <FaChevronLeft />
                  </button>
                  <button className="shop-carousel-btn right" onClick={nextBanner}>
                    <FaChevronRight />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="shop-carousel-fallback">
              <h2 className="fw-bold mb-2">ROAMAD Shop</h2>
              <p className="mb-0">Dynamic shop banner will appear here</p>
            </div>
          )}
        </div>
      </section>

      {/* Toolbar */}
      <section className="shop-toolbar card border-0 shadow-sm rounded-4 p-3 p-lg-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-2">
            <select
              className="form-select rounded-pill"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="">Default Sort</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          <div className="col-lg-7">
            <div className="shop-category-tabs d-flex flex-wrap gap-2 justify-content-lg-center">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`shop-category-btn ${
                    activeCategory === cat._id && searchText.trim().length < 2
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="d-flex justify-content-lg-end align-items-center gap-2">
              <button
                className="shop-icon-btn position-relative"
                onClick={() => (window.location.href = "/shop-checkout")}
                title="Cart"
              >
                <FaShoppingCart />
                <span className="shop-cart-counter">{cartCount}</span>
              </button>

              <button
                className="shop-icon-btn"
                onClick={handleSearchToggle}
                title="Search"
              >
                {showSearch ? <FaTimes /> : <FaSearch />}
              </button>
            </div>
          </div>
        </div>

        {showSearch && (
          <div className="mt-3">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="পণ্যের নাম লিখুন..."
              value={searchText}
              onChange={handleSearchChange}
            />
            <small className="text-muted d-block mt-2">
              2 বা তার বেশি অক্ষর লিখলে search শুরু হবে
            </small>
          </div>
        )}
      </section>

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          {searchText.trim().length >= 2 ? (
            <>
              <h4 className="fw-bold mb-1">
                Search results for "{searchText.trim()}"
              </h4>
              <p className="text-muted mb-0">{totalProducts}টি পণ্য পাওয়া গেছে</p>
            </>
          ) : (
            <>
              <h4 className="fw-bold mb-1">{activeCategoryName || "Products"}</h4>
              <p className="text-muted mb-0">{totalProducts}টি পণ্য</p>
            </>
          )}
        </div>
      </div>

      {/* Products */}
      <section className="mb-4">
        {loading ? (

  <div className="row g-4">

    {[...Array(9)].map((_, i) => (
      <ProductSkeleton key={i} />
    ))}

  </div>

) : message ? (
          <div className="alert alert-warning rounded-4">{message}</div>
        ) : products.length === 0 ? (
          <div className="alert alert-light border rounded-4 text-center py-5">
            কোনো product পাওয়া যায়নি
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-md-6 col-lg-4" key={product._id}>
                <div className="shop-product-card h-100 position-relative">
                  <div
                    className="shop-product-image-wrap"
                    onClick={() => setActiveProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="shop-product-image"
                    />
                    {/* Stock badge */}
{product.stock > 0 && product.stock <= 9 && (
  <span className="stock-badge">
    Only {product.stock} left
  </span>
)}

{product.stock === 0 && (
  <span className="stock-badge out">
    Out of Stock
  </span>
)}



{/* Wishlist button */}
<button
  className="wishlist-btn"
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(product);
  }}
>
  {wishlist.find(p => p._id === product._id) ? "❤️" : "🤍"}
</button>

                  </div>

                  <div className="p-3">
                    <h5
                      className="shop-product-title"
                      onClick={() => setActiveProduct(product)}
                    >
                      {product.name}
                    </h5>

                    <p className="shop-product-price mb-3">৳ {product.price}</p>

                    <button
  className="btn shop-add-cart-btn w-100 rounded-pill"
  disabled={product.stock === 0}
  onClick={() => addToCart(product)}
>
  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="d-flex justify-content-center mt-4">
          <div className="shop-pagination d-flex flex-wrap gap-2">
            <button
              className="shop-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  className={`shop-page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="shop-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {/* Product Modal */}
      {activeProduct && (
        <div
          className="shop-modal-overlay"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="shop-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="shop-modal-close"
              onClick={() => setActiveProduct(null)}
            >
              <FaTimes />
            </button>

            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="shop-modal-image"
                />
              </div>

              <div className="col-lg-6">
                <span className="badge bg-success mb-3">
                  {activeProduct.categoryId?.name || "Product"}
                </span>

                <h3 className="fw-bold mb-3">{activeProduct.name}</h3>
                <h4 className="text-success fw-bold mb-3">৳ {activeProduct.price}</h4>

                <p className="text-muted mb-4" style={{ whiteSpace: "pre-line" }}>
                  {activeProduct.details}
                </p>

                <button
                  className="btn shop-add-cart-btn rounded-pill px-4"
                  onClick={() => addToCart(activeProduct)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS */}
      <style>{`

.stock-badge{
position:absolute;
top:10px;
left:10px;
background:#ffc107;
color:#000;
padding:6px 10px;
font-size:12px;
border-radius:20px;
font-weight:600;
z-index:10; /* important */
}

.stock-badge.out{
background:#dc3545;
color:#fff;
}
.shop-product-image-wrap{
  position: relative;
}

.wishlist-btn{
position:absolute;
top:10px;
right:10px;
background:#fff;
border:none;
width:34px;
height:34px;
border-radius:50%;
font-size:18px;
box-shadow:0 4px 12px rgba(0,0,0,.15);
}


.skeleton-img{
height:220px;
background:#e9ecef;
border-radius:12px;
margin-bottom:15px;
animation:pulse 1.5s infinite;
}

.skeleton-line{
height:16px;
background:#e9ecef;
border-radius:8px;
margin-bottom:10px;
animation:pulse 1.5s infinite;
}

.skeleton-line.short{
width:60%;
}

.skeleton-btn{
height:36px;
background:#e9ecef;
border-radius:20px;
margin-top:10px;
animation:pulse 1.8s infinite;
}

@keyframes pulse{
0%{opacity:.6}
50%{opacity:1}
100%{opacity:.6}
}

        .shop-product-card{
transition: all 0.3s ease;
}

.shop-product-card:hover{
transform: translateY(-6px);
box-shadow:0 15px 40px rgba(0,0,0,0.12);
}

.shop-product-image{
transition: transform 0.4s;
}

.shop-product-card:hover .shop-product-image{
transform:scale(1.08);
}

.shop-search-bar{
transition:all 0.4s ease;
}

.shop-search-bar.open{
height:50px;
opacity:1;
}

.shop-search-bar.closed{
height:0;
opacity:0;
overflow:hidden;
}

        .shop-carousel-image{
          height: 420px;
          object-fit: cover;
          display:block;
        }

        .shop-carousel-box{
          min-height: 420px;
          background: linear-gradient(135deg, #1D3815, #277f0d);
        }

        .shop-carousel-overlay{
          position:absolute;
          inset:0;
          background: linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.15));
          display:flex;
          align-items:center;
          padding: 40px;
        }

        .shop-carousel-fallback{
          min-height: 420px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          color:#fff;
          text-align:center;
          padding:20px;
          background: linear-gradient(135deg, #1D3815, #277f0d);
        }

        .shop-carousel-btn{
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          width:46px;
          height:46px;
          border:none;
          border-radius:50%;
          background:rgba(255,255,255,0.2);
          color:#fff;
          backdrop-filter:blur(6px);
          z-index:2;
        }

        .shop-carousel-btn.left{ left:20px; }
        .shop-carousel-btn.right{ right:20px; }

        .shop-category-btn{
          border:none;
          padding:10px 18px;
          border-radius:999px;
          background:#f1f4f1;
          color:#1D3815;
          font-weight:600;
          transition:0.3s;
        }

        .shop-category-btn.active,
        .shop-category-btn:hover{
          background:#1D3815;
          color:#fff;
        }

        .shop-icon-btn{
          width:46px;
          height:46px;
          border:none;
          border-radius:50%;
          background:#1D3815;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:16px;
          position:relative;
        }

        .shop-cart-counter{
          position:absolute;
          top:-6px;
          right:-4px;
          min-width:22px;
          height:22px;
          border-radius:50%;
          background:#dc3545;
          color:#fff;
          font-size:12px;
          font-weight:700;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0 4px;
        }

        .shop-product-card{
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
          transition:0.3s;
        }

        .shop-product-card:hover{
          transform:translateY(-5px);
        }

        .shop-product-image-wrap{
          height:260px;
          overflow:hidden;
          cursor:pointer;
          background:#f7f7f7;
        }

        .shop-product-image{
          width:100%;
          height:100%;
          object-fit:cover;
          transition:0.4s;
        }

        .shop-product-card:hover .shop-product-image{
          transform:scale(1.06);
        }

        .shop-product-title{
          font-size:1.1rem;
          font-weight:700;
          color:#1D3815;
          cursor:pointer;
          margin-bottom:12px;
          min-height:52px;
        }

        .shop-product-price{
          font-size:1.1rem;
          font-weight:700;
          color:#277f0d;
        }

        .shop-add-cart-btn{
          background:#1D3815;
          color:#fff;
          border:none;
          padding:11px 18px;
        }

        .shop-add-cart-btn:hover{
          background:#277f0d;
          color:#fff;
        }

        .shop-pagination .shop-page-btn{
          border:none;
          min-width:42px;
          height:42px;
          border-radius:10px;
          background:#f1f4f1;
          color:#1D3815;
          font-weight:700;
          padding:0 12px;
        }

        .shop-pagination .shop-page-btn.active{
          background:#1D3815;
          color:#fff;
        }

        .shop-pagination .shop-page-btn:disabled{
          opacity:0.5;
          cursor:not-allowed;
        }

        .shop-modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.65);
          z-index:9999;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
        }

        .shop-modal-box{
          width:min(100%, 1000px);
          background:#fff;
          border-radius:24px;
          padding:30px;
          position:relative;
          max-height:90vh;
          overflow-y:auto;
        }

        .shop-modal-close{
          position:absolute;
          top:15px;
          right:15px;
          width:42px;
          height:42px;
          border:none;
          border-radius:50%;
          background:#f1f4f1;
          color:#1D3815;
        }

        .shop-modal-image{
          width:100%;
          height:420px;
          object-fit:cover;
          border-radius:20px;
        }

        @media (max-width: 991px){
          .shop-carousel-image,
          .shop-carousel-box{
            min-height:300px;
            height:300px;
          }

          .shop-carousel-overlay{
            padding:25px;
          }

          .shop-product-image-wrap{
            height:220px;
          }

          .shop-modal-image{
            height:280px;
          }
        }

        @media (max-width: 575px){
          .shop-carousel-btn{
            width:40px;
            height:40px;
          }

          .shop-category-tabs{
            justify-content:flex-start !important;
            overflow-x:auto;
            padding-bottom:6px;
          }

          .shop-category-btn{
            white-space:nowrap;
          }

          .shop-modal-box{
            padding:20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;