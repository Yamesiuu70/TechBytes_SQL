import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import Search from "../Search";
import {  IoCartOutline } from "react-icons/io5";
import Navigation from "./Navigation";
import "./style.css";

const Header = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setIsLoggedIn(!!userInfo);
  }, [location]);

  return (
    <header className="header-container">
      <div className="top-strip">
        <p className="promo-text">
          Get up to 50% off new season styles, limited time only
        </p>
        <div className="top-links">
          <Link to="/help">Help Center</Link>
          <Link to="/order-tracking">Order Tracking</Link>
        </div>
      </div>

      <div className="main-header-content container">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="brand-name">TechBytes</h2>
        </div>

        <div className="header-search">
          <Search />
        </div>

        <div className="header-icons">
          {isLoggedIn ? (
            <Link to="/profile" className="signin-text">Account</Link>
          ) : (
            <Link to="/login" className="signin-text">Account</Link>
          )}

         

        

          <Link to="/cart">
            <IconWithBadge icon={<IoCartOutline size={20} />} count={0} />
          </Link>
        </div>
      </div>

      <div className="sub-header">
        <div className="container flex items-center gap-6">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
};

const IconWithBadge = ({ icon, count }) => (
  <div className="icon-badge">
    {icon}
    {count > 0 && <span className="badge">{count}</span>}
  </div>
);

export default Header;
