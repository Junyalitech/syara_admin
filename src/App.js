import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Skeleton from '../src/Skeleton.js';
import HomePage from '../src/components/homePage/HomePage.js';
import ContactUs from './components/contactus/ContactUs.js';
import AboutPage from './components/aboutPage/AboutPage.js';
import Category from './components/ourproducts/Category.js';

import Login from './components/Login.js';
import RegistrationLogin from './components/RegistrationLogin.js';

import AddProduct from './components/ourproducts/AddProduct.js';
import DisplayProducts from './components/ourproducts/ProductsList.js';
import ShippingPage from './components/Pincode/Shipping.js';
import Orders from './components/OrderPage/Order.js';



function PrivateRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
}

function App() {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRegister = async (userData) => {
    console.log('Registering:', userData);
    setRegisteredUsers([...registeredUsers, userData]);
  };

  const handleLogin = async (username, password) => {
    console.log('Login:', username, password);
    const user = registeredUsers.find(user => user.username === username && user.password === password);
    if (user) {
      sessionStorage.setItem('isAuthenticated', true);
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('isAuthenticated')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registrationuser" element={<RegistrationLogin onRegister={handleRegister} />} />

        <Route path="/" element={<PrivateRoute><Skeleton /></PrivateRoute>}>
          <Route path="home" element={<HomePage />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="aboutus" element={<AboutPage />} />

          <Route path="shipping" element={<ShippingPage />} />
          <Route path="orders" element={<Orders />} />

          <Route path="ourproduct" element={<Category />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="showallproducts" element={<DisplayProducts />} />

        </Route>
      </Routes>
    </Router>

  );
}

export default App;
