import React from 'react';
import { Link } from "react-router-dom";
import "./style.css";

const Navigation = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-links">
        <ul>
        
          <li><Link to="/desktops">Desktop</Link></li> {/* Desktop page */}
          <li><Link to="/laptops">Laptop</Link></li>
          <li><Link to="/electronics">Electronics</Link></li>
          <li><Link to="/arms">Prosthetic Arms</Link></li>
          <li><Link to="/legs">Prosthetic Legs</Link></li> {/* Corrected */}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
//Beta Testing
