// src/App.jsx
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Signup from './components/SignUp';
import Login from './components/Login';
import './index.css';
import Banner from './components/Banner';
import CardList from './components/CardList';
import ProductPage from './components/ProductsPage';
import OrderPage from './components/OrderPage';
import PaymentPage from './components/PaymentPage';
import OrderTrackPage from './components/OrderTrackPage';
import Footer from './components/Footer';

import AdminDashboard from './components/Admin/AdminDashboard';
import AllUsers from './components/Admin/AllUsers';
import AllOrders from './components/Admin/AllOrders';
import ProductCrud from './components/Admin/ProductsCrud';
import OrderDetailsPage from './components/OrderDetailsPage';
import ProductDetail from './components/ProductDetail';
import AllCategories from './components/Admin/AllCategories';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomeLayout />} />
            <Route path="/products/:categoryId" element={<ProductPage />} />
            <Route path="/productpage/:productId" element={<ProductDetail />} />
            <Route path="/carts" element={<OrderPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-success" element={<OrderTrackPage />} />
            <Route path="/order-details" element={<OrderDetailsPage />} />
            
            {/* Admin dashboard routes
             
            
             <Route path="/admin" element={<AdminDashboard />}>
              <Route path="users" element={<AllUsers />} />
              <Route path="orders" element={<AllOrders />} />
              <Route path="products" element={<ProductCrud />} />
              <Route path="categories" element={<AllCategories/>}/>
            </Route>
             */}

            {/* Admin dashboard routes wrapped in ProtectedRoute */}
            <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AllUsers />} />
                <Route path="orders" element={<AllOrders />} />
                <Route path="products" element={<ProductCrud />} />
                <Route path="categories" element={<AllCategories />} />
              </Route>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const HomeLayout = () => {
  const location = useLocation();
  const showBanner = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {showBanner && <Banner />}
      <Routes>
        <Route path="/" element={<CardList />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
};

export default App;
