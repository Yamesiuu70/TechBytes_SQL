import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const DesktopList = () => {
  const [desktops, setDesktops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    if (!userInfo) {
      alert("❌ You must be logged in to add items to cart!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          productId, 
          quantity: 1 
        }), // ✅ userId বাদ দিয়েছি (token থেকে আসবে)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Added to cart!");
      } else {
        alert(`❌ Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Something went wrong");
    }
  };

  // ✅ FIXED: Correct API endpoint
  useEffect(() => {
    const fetchDesktops = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories/Desktops/products");
        const data = await res.json();
        
        if (data.success) {
          // ✅ SQL id → _id format (frontend এ _id use করা আছে)
          const formattedDesktops = data.products.map(product => ({
            ...product,
            _id: product.id  // SQL id কে _id হিসেবে map
          }));
          setDesktops(formattedDesktops);
        } else {
          console.error("Failed to fetch desktops:", data.message);
          setDesktops([]);
        }
      } catch (err) {
        console.error("Error fetching desktops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesktops();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="desktop-container">
      <h2 className="desktop-title">Our Desktops</h2>
      <div className="desktop-grid">
        {desktops.map((desktop) => (
          <div key={desktop._id || desktop.id} className="desktop-card">
            <img 
              src={desktop.photo} 
              alt={desktop.name} 
              className="desktop-image"
              style={{ cursor: "pointer" }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
              onClick={() => navigate(`/product/desktops/${desktop._id || desktop.id}`)}
            />
            <h3
              className="desktop-name"
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => navigate(`/product/desktops/${desktop._id || desktop.id}`)}
            >
              {desktop.name}
            </h3>
            <p className="desktop-price">${desktop.price}</p>
            <p className="desktop-details">{desktop.details}</p>
            <button 
              className="desktop-btn"  
              onClick={() => addToCart(desktop._id || desktop.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopList;