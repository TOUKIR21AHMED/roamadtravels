import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Packages from './pages/Packages'
import Destination from './pages/Destination'
import Booking from './pages/Booking'
import Team from './pages/Team'
import Testimonial from './pages/Testimonial'
import Error from './pages/Error'
import Contact from './pages/Contact'

import TravelGuide from "./pages/TravelGuide";
import DistrictPlaces from "./pages/DistrictPlaces";

import AdminDistrict from "./pages/AdminDistrict";
import AdminPlace from "./pages/AdminPlace";

import ManageDistricts from "./pages/ManageDistricts";
import ManagePlaces from "./pages/ManagePlaces";
import EditDistrict from "./pages/EditDistrict";
import EditPlace from "./pages/EditPlace";

import AdminCategory from "./pages/AdminCategory";
import ManageCategories from "./pages/ManageCategories";
import EditCategory from "./pages/EditCategory";

import AdminProduct from "./pages/AdminProduct";
import ManageProducts from "./pages/ManageProducts";
import EditProduct from "./pages/EditProduct";

import ManageOrders from "./pages/ManageOrders";

import Shop from "./pages/Shop";
import ShopCheckout from "./pages/ShopCheckout";
import OrderSuccess from "./pages/OrderSuccess";

import AdminStatsDashboard from "./pages/AdminStatsDashboard";

import AdminShopBanner from "./pages/AdminShopBanner";
import ManageShopBanners from "./pages/ManageShopBanners";
import EditShopBanner from "./pages/EditShopBanner";
import ProtectedRoute from "./components/ProtectedRoute";

import Visa from "./pages/Visa";
import Flight from "./pages/Flight";

// NEW IMPORTS
import AdminLogin from "./pages/AdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ShopAdminDashboard from "./pages/ShopAdminDashboard";
import TourismAdminDashboard from "./pages/TourismAdminDashboard";
import CreateAdmin from "./pages/CreateAdmin";
import ManageAdmins from "./pages/ManageAdmins";
import EditAdmin from "./pages/EditAdmin";
import CreateEventPackage from "./pages/CreateEventPackage";
import ManageEventPackages from "./pages/ManageEventPackages";
import EditEventPackage from "./pages/EditEventPackage";
import EventPackageDetails from "./pages/EventPackageDetails";
import EventPackageRequest from "./pages/EventPackageRequest";
import ManageEventRequests from "./pages/ManageEventRequests";
import FlightRequestsAdmin from "./pages/FlightRequestsAdmin";

export default function App() {

  const location = useLocation();

  const isAdminRoute =
    location.pathname.includes("admin");

  return (
    <div>

      {!isAdminRoute && <Header />}

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/packages' element={<Packages />} />
        <Route path='/destination' element={<Destination />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/team' element={<Team />} />
        <Route path='/testimonial' element={<Testimonial />} />
        <Route path='/error' element={<Error />} />
        <Route path='/contact' element={<Contact />} />

        <Route path="/travel-guide" element={<TravelGuide />} />
        <Route
          path="/travel-guide/district/:slug"
          element={<DistrictPlaces />}
        />
        <Route
  path="/create-admin"
  element={
    <ProtectedRoute
      allowedRoles={["super_admin"]}
    >
      <CreateAdmin />
    </ProtectedRoute>
  }
/>

<Route path="/visa" element={<Visa />} />
<Route path="/flight" element={<Flight />} />

        {/* ADMIN LOGIN */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

<Route path="/admin/create-event-package" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    ><CreateEventPackage /></ProtectedRoute>} />
<Route path="/admin/manage-event-packages" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    ><ManageEventPackages /></ProtectedRoute>} />
<Route path="/admin/edit-event-package/:id" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    ><EditEventPackage /></ProtectedRoute>} />
<Route path="/events-packages/:slug" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
        "shop_admin",
      ]}
    ><EventPackageDetails /></ProtectedRoute>} />
<Route path="/event-package-request" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    ><EventPackageRequest /></ProtectedRoute>} />
<Route path="/admin/manage-event-requests" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    ><ManageEventRequests /></ProtectedRoute>} />
    <Route path="/admin/flight-requests" element={ <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    ><FlightRequestsAdmin /></ProtectedRoute>} />
        {/* SUPER ADMIN */}

        <Route
  path="/super-admin"
  element={
    <ProtectedRoute
      allowedRoles={["super_admin"]}
    >
      <SuperAdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/manage-admins"
  element={
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <ManageAdmins />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit-admin/:id"
  element={
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <EditAdmin />
    </ProtectedRoute>
  }
/>


        {/* SHOP ADMIN */}

        <Route
  path="/shop-admin"
  element={
    <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "shop_admin",
      ]}
    >
      <ShopAdminDashboard />
    </ProtectedRoute>
  }
/>



        {/* TOURISM ADMIN */}

       <Route
  path="/tourism-admin"
  element={
    <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "tourism_admin",
      ]}
    >
      <TourismAdminDashboard />
    </ProtectedRoute>
  }
/>



        {/* TOURISM MANAGEMENT */}

        <Route
          path="/admin/district"
          element={<AdminDistrict />}
        />

        <Route
          path="/admin/place"
          element={<AdminPlace />}
        />

        <Route
          path="/admin/manage-districts"
          element={<ManageDistricts />}
        />

        <Route
          path="/admin/manage-places"
          element={<ManagePlaces />}
        />

        <Route
          path="/admin/edit-district/:id"
          element={<EditDistrict />}
        />

        <Route
          path="/admin/edit-place/:id"
          element={<EditPlace />}
        />



        {/* SHOP MANAGEMENT */}

        <Route
          path="/admin-category"
          element={<AdminCategory />}
        />

        <Route
          path="/manage-categories"
          element={<ManageCategories />}
        />

        <Route
          path="/edit-category/:id"
          element={<EditCategory />}
        />

        <Route
          path="/admin-product"
          element={<AdminProduct />}
        />

        <Route
          path="/manage-products"
          element={<ManageProducts />}
        />

        <Route
          path="/edit-product/:id"
          element={<EditProduct />}
        />

        <Route
          path="/manage-orders"
          element={<ManageOrders />}
        />



        {/* SHOP */}

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/shop-checkout"
          element={<ShopCheckout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />



        {/* SHOP DASHBOARD */}

        <Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute
      allowedRoles={[
        "super_admin",
        
      ]}
    >
      <AdminStatsDashboard />
    </ProtectedRoute>
  }
/>



        {/* SHOP BANNER */}

        <Route
          path="/admin-shop-banner"
          element={<AdminShopBanner />}
        />

        <Route
          path="/manage-shop-banners"
          element={<ManageShopBanners />}
        />

        <Route
          path="/edit-shop-banner/:id"
          element={<EditShopBanner />}
        />

      </Routes>

      {!isAdminRoute && <Footer />}

    </div>
  )
}