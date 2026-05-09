
//esme sidebar ko bnaya h skeleton.js file m code likha h aur eska css skeleton.css m likh h 
import React, { useState } from 'react';
import './Skeleton.css';
import { FaCaretDown, FaBars, FaTimes } from 'react-icons/fa'; // Make sure FaTimes is imported
import { Outlet, Link } from "react-router-dom";
import image from "./assets/user.png"

const Skeleton = () => {
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleProductDetails = () => {
    setShowProductDetails(!showProductDetails);
  };

  return (
    <div className='main'>
      {/* Toggle Button for Mobile */}
      <button className='sidebar-toggle' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>



      <div className={`sidebar ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className='user_profile'>
          <img style={{ height: "80px" }} src={image} alt="user" />
          <p style={{ fontSize: "20px", fontWeight: "700",textAlign:'center' }}>Syara Retails</p>
        </div>

        <div><Link to='/home'>Home Page</Link></div>
        <div><Link to='/aboutus'>About Us Page</Link></div>
        <div className='navlinks-container-subcontainer' onClick={toggleProductDetails}>
          <FaCaretDown /> Our Products
        </div>
        {showProductDetails && (
          <div className='navlinks-container-subcontainer navlinks-container-ourproducts'>
            <div className='navlinks-container-ourproduct'><Link to="/ourproduct">Category</Link></div>

            <div className='navlinks-container-ourproduct'><Link to="/addproduct">Add Products</Link></div>
            <div className='navlinks-container-ourproduct'><Link to="showallproducts">Show All Products</Link></div>

          </div>
        )}

        <div><Link to="/orders">Orders</Link></div>
        {/* <div><Link to="/cartpage">Cart Page</Link></div> */}
        <div><Link to="/shipping">Shipping Page</Link></div>

        <div><Link to="/contactus">Contact Us</Link></div>

        <div onClick={() =>
          sessionStorage.setItem('isAuthenticated', false)}><Link to="/login">Logout</Link></div>
        {/* <div >Logout</div> */}
      </div>

      <div className='content'>
        <div className='header'>
          <div><Link to="login"></Link></div>
        </div>
        <div className='content_below'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
