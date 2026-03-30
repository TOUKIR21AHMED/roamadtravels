import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
import AdminDashboard from "./pages/AdminDashboard";
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
export default function App() {
  return (
    <div>
        <Header />
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/services' element={<Services/>}/>
        <Route path='/packages' element={<Packages/>}/>
        <Route path='/destination' element={<Destination/>}/>
        <Route path='/booking' element={<Booking/>}/>
        <Route path='/team' element={<Team/>}/>
        <Route path='/testimonial' element={<Testimonial/>}/>
        <Route path='/error' element={<Error/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/travel-guide" element={<TravelGuide/>}/>
        <Route path="/travel-guide/district/:slug" element={<DistrictPlaces />} />
        <Route path="/admin/district" element={<AdminDistrict />} />
<Route path="/admin/place" element={<AdminPlace />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/manage-districts" element={<ManageDistricts />} />
<Route path="/admin/manage-places" element={<ManagePlaces />} />
<Route path="/admin/edit-district/:id" element={<EditDistrict />} />
<Route path="/admin/edit-place/:id" element={<EditPlace />} />
<Route path="/admin-category" element={<AdminCategory />} />
<Route path="/manage-categories" element={<ManageCategories />} />
<Route path="/edit-category/:id" element={<EditCategory />} />
<Route path="/admin-product" element={<AdminProduct />} />
<Route path="/manage-products" element={<ManageProducts />} />
<Route path="/edit-product/:id" element={<EditProduct />} />
<Route path="/manage-orders" element={<ManageOrders />} />
<Route path="/shop" element={<Shop />} />
<Route path="/shop-checkout" element={<ShopCheckout />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route path="/admin-dashboard" element={<AdminStatsDashboard />} />
<Route path="/admin-shop-banner" element={<AdminShopBanner />} />
<Route path="/manage-shop-banners" element={<ManageShopBanners />} />
<Route path="/edit-shop-banner/:id" element={<EditShopBanner />} />
        </Routes>
        <Footer />
    </div>
  )
}
