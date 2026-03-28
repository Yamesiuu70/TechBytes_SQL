// Footer.jsx
import React, { useState } from "react";
import { LiaShippingFastSolid, LiaGiftSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { BsWallet2 } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const Footer = () => {
  const { userInfo } = useAuth(); // ✅ get logged-in user
  const [opinion, setOpinion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!opinion.trim()) {
      alert("⚠️ Please write your opinion before submitting.");
      return;
    }

    if (!userInfo) {
      alert("❌ You must be logged in to submit your opinion.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // use cookies if backend requires
        body: JSON.stringify({
          opinion,
          userId: userInfo._id, // send userId to backend
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Opinion submitted successfully!");
        setOpinion(""); // clear textarea
      } else {
        alert("❌ Error: " + (data.message || data.error));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("❌ Failed to connect to server");
    }
  };

  return (
    <>
      <footer className="footer-section">
        <div className="container">
          {/* Top icons row */}
          <div className="footer-icons-row">
            <div className="footer-icon-col">
              <LiaShippingFastSolid className="footer-icon" />
              <h3>Free Shipping</h3>
              <p>For all Orders Over $100</p>
            </div>
            <div className="footer-icon-col">
              <PiKeyReturnLight className="footer-icon" />
              <h3>30 Days Returns</h3>
              <p>For an Exchange Product</p>
            </div>
            <div className="footer-icon-col">
              <BsWallet2 className="footer-icon" />
              <h3>Secured Payment</h3>
              <p>Payment Cards Accepted</p>
            </div>
            <div className="footer-icon-col">
              <LiaGiftSolid className="footer-icon" />
              <h3>Special Gifts</h3>
              <p>Our First Product Order</p>
            </div>
            <div className="footer-icon-col">
              <BiSupport className="footer-icon" />
              <h3>Support 24/7</h3>
              <p>Contact us Anytime</p>
            </div>
          </div>

          <hr />

          {/* Main footer content */}
          <div className="footer-main">
            {/* Contact */}
            <div className="footer-part1">
              <h2>Contact us</h2>
              <p>
                East Monipur, Mirpur
                <br />
                Dhaka-1216
              </p>
              <Link className="footer-link" to="mailto:techbytes666@gmail.com">
                techbytes666@gmail.com
              </Link>
              <span className="footer-phone">+8801791416682</span>
            </div>

            {/* Links */}
            <div className="footer-part2">
              <div className="footer-links-col">
                <h2>Products</h2>
                <ul>
                  <li><Link to="/" className="footer-link">Prices drop</Link></li>
                  <li><Link to="/" className="footer-link">New products</Link></li>
                  <li><Link to="/" className="footer-link">Best sales</Link></li>
                  <li><Link to="/" className="footer-link">Contact Us</Link></li>
                  <li><Link to="/" className="footer-link">Stores</Link></li>
                </ul>
              </div>
              <div className="footer-links-col">
                <h2>Our Company</h2>
                <ul>
                  <li><Link to="/" className="footer-link">Delivery</Link></li>
                  <li><Link to="/" className="footer-link">Legal Notice</Link></li>
                  <li><Link to="/" className="footer-link">Terms and conditions of use</Link></li>
                  <li><Link to="/" className="footer-link">About Us</Link></li>
                  <li><Link to="/" className="footer-link">Login</Link></li>
                </ul>
              </div>
            </div>

            {/* Report Section */}
            <div className="footer-part3">
              <h2>Report to TechBytes</h2>
              <p>Give Your Opinion</p>
              <form onSubmit={handleSubmit}>
                <textarea
                  className="footer-input"
                  placeholder="Write your opinion here..."
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  rows="4"
                  required
                />
                <Button className="btn-org" type="submit">
                  Submit Your Opinion
                </Button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Strip */}
      <div className="bottom-strip">
        <div className="container bottom-strip-content">
          <ul className="footer-socials">
            <li><Link to="/" target="_blank" className="footer-social-link"><FaFacebookF /></Link></li>
            <li><Link to="/" target="_blank" className="footer-social-link"><AiOutlineYoutube /></Link></li>
            <li><Link to="/" target="_blank" className="footer-social-link"><FaPinterestP /></Link></li>
            <li><Link to="/" target="_blank" className="footer-social-link"><FaInstagram /></Link></li>
          </ul>
          <p className="footer-copy">@ 2025 - TechBytes</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
