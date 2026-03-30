import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminStatsDashboard = () => {
  const printRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);

  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    categories: 0,
    pending: 0,
    delivered: 0,
    revenue: 0,
  });

  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  const [revenueData, setRevenueData] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dailyTraffic, setDailyTraffic] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState([]);
  const [recentRevenue, setRecentRevenue] = useState({
    today: 0,
    last7Days: 0,
    last30Days: 0,
  });

  const COLORS = ["#1D3815", "#277f0d", "#ffc107", "#dc3545", "#0d6efd", "#20c997"];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:5000/api/orders");
        const productsRes = await axios.get("http://localhost:5000/api/products?limit=1000");
        const categoriesRes = await axios.get("http://localhost:5000/api/product-categories");

        const orders = ordersRes.data || [];
        const products = productsRes.data?.products || [];
        const categories = categoriesRes.data || [];

        const pendingOrders = orders.filter((o) => o.orderStatus === "pending");
        const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered");
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          orders: orders.length,
          products: products.length,
          categories: categories.length,
          pending: pendingOrders.length,
          delivered: deliveredOrders.length,
          revenue: totalRevenue,
        });

        // Monthly Revenue
        const monthlyMap = {};
        orders.forEach((order) => {
          const month = new Date(order.createdAt).toLocaleString("default", {
            month: "short",
          });
          monthlyMap[month] = (monthlyMap[month] || 0) + (order.total || 0);
        });

        const monthlyRevenueArray = Object.keys(monthlyMap).map((month) => ({
          month,
          revenue: monthlyMap[month],
        }));
        setRevenueData(monthlyRevenueArray);

        // Latest Orders
        const latest = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setLatestOrders(latest);

        // Top Selling Products
        const productCountMap = {};
        orders.forEach((order) => {
          (order.cartItems || []).forEach((item) => {
            productCountMap[item.name] = (productCountMap[item.name] || 0) + item.quantity;
          });
        });

        const topSelling = Object.keys(productCountMap)
          .map((name) => ({
            name,
            qty: productCountMap[name],
          }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5);

        setTopProducts(topSelling);

        // Daily Traffic Graph (last 7 days based on order count)
        const today = new Date();
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);

          const label = d.toLocaleDateString("en-US", { weekday: "short" });
          const dateKey = d.toISOString().split("T")[0];

          const count = orders.filter((order) => {
            const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
            return orderDate === dateKey;
          }).length;

          last7Days.push({
            day: label,
            visits: count,
          });
        }

        setDailyTraffic(last7Days);

        // Order Status Pie
        setOrderStatusData([
          { name: "Pending", value: pendingOrders.length },
          { name: "Delivered", value: deliveredOrders.length },
        ]);

        // Low Stock Alert
        const lowStock = products
          .filter((product) => Number(product.stock) <= 5)
          .sort((a, b) => Number(a.stock) - Number(b.stock));

        setLowStockProducts(lowStock);

        // Recent Revenue Summary
        const todayKey = new Date().toISOString().split("T")[0];

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

        const todayRevenue = deliveredOrders
          .filter((order) => new Date(order.createdAt).toISOString().split("T")[0] === todayKey)
          .reduce((sum, order) => sum + (order.total || 0), 0);

        const last7Revenue = deliveredOrders
          .filter((order) => new Date(order.createdAt) >= sevenDaysAgo)
          .reduce((sum, order) => sum + (order.total || 0), 0);

        const last30Revenue = deliveredOrders
          .filter((order) => new Date(order.createdAt) >= thirtyDaysAgo)
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setRecentRevenue({
          today: todayRevenue,
          last7Days: last7Revenue,
          last30Days: last30Revenue,
        });

        // Category-wise Sales Chart
        const categorySalesMap = {};
        orders.forEach((order) => {
          (order.cartItems || []).forEach((item) => {
            const cat = item.categoryName || "Unknown";
            categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.quantity;
          });
        });

        const categorySalesArray = Object.keys(categorySalesMap).map((name) => ({
          name,
          sold: categorySalesMap[name],
        }));

        setCategorySalesData(categorySalesArray);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    let start = 0;
    const end = stats.revenue;

    if (end <= 0) {
      setAnimatedRevenue(0);
      return;
    }

    const duration = 1200;
    const increment = Math.ceil(end / 60);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedRevenue(start);
    }, duration / 60);

    return () => clearInterval(timer);
  }, [stats.revenue]);

  const theme = useMemo(() => {
    return darkMode
      ? {
          bg: "#0f1720",
          card: "#16202b",
          text: "#f5f7fa",
          muted: "#b7c2cc",
          border: "#223142",
          heading: "#ffffff",
          soft: "#1b2733",
          tableHead: "#203040",
        }
      : {
          bg: "#f4f8f2",
          card: "#ffffff",
          text: "#1f2937",
          muted: "#6b7280",
          border: "#dfe8d8",
          heading: "#1D3815",
          soft: "#f8faf8",
          tableHead: "#eef5ea",
        };
  }, [darkMode]);

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "18px",
    boxShadow: darkMode
      ? "0 10px 24px rgba(0,0,0,0.35)"
      : "0 10px 24px rgba(0,0,0,0.08)",
  };

  const tableStyle = {
    color: theme.text,
    marginBottom: 0,
  };

  const deliveryProgress =
    stats.orders > 0 ? Math.round((stats.delivered / stats.orders) * 100) : 0;

  const handleExportReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Orders", stats.orders],
      ["Total Products", stats.products],
      ["Total Categories", stats.categories],
      ["Pending Orders", stats.pending],
      ["Delivered Orders", stats.delivered],
      ["Revenue", stats.revenue],
      ["Today Revenue", recentRevenue.today],
      ["Last 7 Days Revenue", recentRevenue.last7Days],
      ["Last 30 Days Revenue", recentRevenue.last30Days],
      [],
      ["Latest Orders"],
      ["Customer", "Total", "Status"],
      ...latestOrders.map((o) => [o.customerName, o.total, o.orderStatus]),
      [],
      ["Top Selling Products"],
      ["Product", "Sold Qty"],
      ...topProducts.map((p) => [p.name, p.qty]),
      [],
      ["Low Stock Products"],
      ["Product", "Stock"],
      ...lowStockProducts.map((p) => [p.name, p.stock]),
    ];

    const csvContent = rows
      .map((row) => row.map((item) => `"${item ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "admin-dashboard-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDashboard = () => {
    window.print();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        padding: "50px 15px",
        transition: "0.3s",
      }}
    >
      <div className="container" ref={printRef}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 no-print">
          <div>
            <h2 style={{ color: theme.heading, fontWeight: "800", marginBottom: "6px" }}>
              Admin Analytics Dashboard
            </h2>
            <p style={{ color: theme.muted, marginBottom: 0 }}>
              Shop overview, sales insights, stock alerts and order analytics
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              onClick={handleExportReport}
              className="btn rounded-pill px-4"
              style={{
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                fontWeight: "600",
              }}
            >
              Export Report
            </button>

            <button
              onClick={handlePrintDashboard}
              className="btn rounded-pill px-4"
              style={{
                background: "#6c757d",
                color: "#fff",
                border: "none",
                fontWeight: "600",
              }}
            >
              Print Dashboard
            </button>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="btn rounded-pill px-4"
              style={{
                background: darkMode ? "#ffc107" : "#1D3815",
                color: darkMode ? "#111" : "#fff",
                border: "none",
                fontWeight: "600",
              }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* Main Stat Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-lg-2">
            <div className="p-4 text-center h-100" style={cardStyle}>
              <h3 style={{ fontWeight: "800", marginBottom: "6px" }}>{stats.orders}</h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Total Orders</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-2">
            <div className="p-4 text-center h-100" style={cardStyle}>
              <h3 style={{ fontWeight: "800", marginBottom: "6px" }}>{stats.products}</h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Total Products</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-2">
            <div className="p-4 text-center h-100" style={cardStyle}>
              <h3 style={{ fontWeight: "800", marginBottom: "6px" }}>{stats.categories}</h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Categories</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-2">
            <div
              className="p-4 text-center h-100"
              style={{
                ...cardStyle,
                background: darkMode ? "#3d2c0f" : "#fff8db",
                border: darkMode ? "1px solid #73551b" : "1px solid #f1d47a",
              }}
            >
              <h3 style={{ fontWeight: "800", marginBottom: "6px" }}>{stats.pending}</h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Pending Orders</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-2">
            <div
              className="p-4 text-center h-100"
              style={{
                ...cardStyle,
                background: darkMode ? "#123224" : "#eaf8ef",
                border: darkMode ? "1px solid #28533f" : "1px solid #bfe5cb",
              }}
            >
              <h3 style={{ fontWeight: "800", marginBottom: "6px" }}>{stats.delivered}</h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Delivered</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-2">
            <div
              className="p-4 text-center h-100"
              style={{
                ...cardStyle,
                background: darkMode ? "#132b1a" : "#edf8ee",
                border: darkMode ? "1px solid #275438" : "1px solid #cfe8d3",
              }}
            >
              <h3
                style={{
                  fontWeight: "800",
                  marginBottom: "6px",
                  color: darkMode ? "#7ee787" : "#1D3815",
                }}
              >
                ৳ {animatedRevenue.toLocaleString()}
              </h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Revenue</p>
            </div>
          </div>
        </div>

        {/* Recent Revenue Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h5 style={{ color: theme.heading, fontWeight: "700" }}>Today Revenue</h5>
              <h3 style={{ color: "#198754", fontWeight: "800", marginTop: "10px" }}>
                ৳ {recentRevenue.today.toLocaleString()}
              </h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Delivered orders of today</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h5 style={{ color: theme.heading, fontWeight: "700" }}>Last 7 Days Revenue</h5>
              <h3 style={{ color: "#0d6efd", fontWeight: "800", marginTop: "10px" }}>
                ৳ {recentRevenue.last7Days.toLocaleString()}
              </h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Recent weekly earnings</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h5 style={{ color: theme.heading, fontWeight: "700" }}>Last 30 Days Revenue</h5>
              <h3 style={{ color: "#fd7e14", fontWeight: "800", marginTop: "10px" }}>
                ৳ {recentRevenue.last30Days.toLocaleString()}
              </h3>
              <p style={{ color: theme.muted, marginBottom: 0 }}>Monthly delivered revenue</p>
            </div>
          </div>
        </div>

        {/* Delivery Progress */}
        <div className="p-4 mb-5" style={cardStyle}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h4 style={{ color: theme.heading, fontWeight: "700", marginBottom: 0 }}>
              Order Delivery Progress
            </h4>
            <span
              className="badge"
              style={{
                background: "#198754",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "999px",
                fontSize: "0.9rem",
              }}
            >
              {deliveryProgress}% Delivered
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "18px",
              background: darkMode ? "#233343" : "#e9f0e5",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${deliveryProgress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #1D3815, #277f0d)",
                borderRadius: "999px",
                transition: "0.5s ease",
              }}
            />
          </div>

          <div className="d-flex justify-content-between mt-2">
            <small style={{ color: theme.muted }}>Pending: {stats.pending}</small>
            <small style={{ color: theme.muted }}>Delivered: {stats.delivered}</small>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Monthly Revenue Chart
              </h4>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" stroke={theme.muted} />
                  <YAxis stroke={theme.muted} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#1D3815" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Order Status Pie Chart
              </h4>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    dataKey="value"
                    label
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Daily Traffic Graph
              </h4>

              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dailyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#2b3d4f" : "#e5ece1"} />
                  <XAxis dataKey="day" stroke={theme.muted} />
                  <YAxis stroke={theme.muted} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#277f0d"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Category-wise Sales Chart
              </h4>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categorySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#2b3d4f" : "#e5ece1"} />
                  <XAxis dataKey="name" stroke={theme.muted} />
                  <YAxis stroke={theme.muted} />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables + Stock */}
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Low Stock Alert
              </h4>

              {lowStockProducts.length > 0 ? (
                <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                  {lowStockProducts.map((product) => (
                    <div
                      key={product._id}
                      className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-4"
                      style={{
                        background: darkMode ? "#23191a" : "#fff3f3",
                        border: darkMode ? "1px solid #553436" : "1px solid #f3c7c7",
                      }}
                    >
                      <div>
                        <h6 style={{ marginBottom: "4px", color: theme.text }}>{product.name}</h6>
                        <small style={{ color: theme.muted }}>
                          Category: {product.categoryId?.name || "N/A"}
                        </small>
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          fontSize: "0.85rem",
                          padding: "8px 12px",
                          borderRadius: "999px",
                        }}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="p-4 rounded-4 text-center"
                  style={{
                    background: darkMode ? "#123224" : "#edf8ee",
                    color: darkMode ? "#7ee787" : "#1D3815",
                    fontWeight: "600",
                  }}
                >
                  No low stock products
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Latest Orders Table
              </h4>

              <div className="table-responsive">
                <table className="table align-middle" style={tableStyle}>
                  <thead>
                    <tr style={{ background: theme.tableHead }}>
                      <th style={{ color: theme.text }}>Customer</th>
                      <th style={{ color: theme.text }}>Total</th>
                      <th style={{ color: theme.text }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestOrders.length > 0 ? (
                      latestOrders.map((order) => (
                        <tr key={order._id}>
                          <td style={{ color: theme.text }}>{order.customerName}</td>
                          <td style={{ color: theme.text }}>৳ {order.total}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background:
                                  order.orderStatus === "delivered" ? "#198754" : "#ffc107",
                                color: order.orderStatus === "delivered" ? "#fff" : "#111",
                                padding: "8px 12px",
                                borderRadius: "999px",
                              }}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ color: theme.muted }}>
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="p-4 h-100" style={cardStyle}>
              <h4 style={{ color: theme.heading, fontWeight: "700" }} className="mb-3">
                Top Selling Products
              </h4>

              <div className="table-responsive">
                <table className="table align-middle" style={tableStyle}>
                  <thead>
                    <tr style={{ background: theme.tableHead }}>
                      <th style={{ color: theme.text }}>Product</th>
                      <th style={{ color: theme.text }}>Sold Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length > 0 ? (
                      topProducts.map((product, index) => (
                        <tr key={index}>
                          <td style={{ color: theme.text }}>{product.name}</td>
                          <td style={{ color: theme.text }}>{product.qty}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ color: theme.muted }}>
                          No sales data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            background: #fff !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminStatsDashboard;