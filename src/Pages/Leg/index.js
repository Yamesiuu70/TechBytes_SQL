import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const LegsList = () => {
  const [legs, setLegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    if (!userInfo) {
      alert("❌ Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 }), // ✅ userId দরকার নেই, token থেকে নিবে
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
    const fetchLegs = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories/Legs/products");
        const data = await res.json();
        
        if (data.success) {
          // ✅ MongoDB _id এর পরিবর্তে SQL id ব্যবহার করুন
          const formattedLegs = data.products.map(product => ({
            ...product,
            _id: product.id  // SQL id কে _id হিসেবে map করছি (frontend এ _id use করা আছে)
          }));
          setLegs(formattedLegs);
        } else {
          console.error("Failed to fetch legs:", data.message);
          setLegs([]);
        }
      } catch (err) {
        console.error("Error fetching prosthetic legs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLegs();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="legs-container">
      <h2 className="legs-title">Prosthetic Legs</h2>
      <div className="legs-grid">
        {legs.map((leg) => (
          <div key={leg.id || leg._id} className="legs-card"> {/* ✅ id or _id both work */}
            <img
              src={leg.photo}
              alt={leg.name}
              className="legs-image"
              style={{ cursor: "pointer" }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
              onClick={() => navigate(`/product/legs/${leg.id || leg._id}`)}
            />
            <h3
              className="legs-name"
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => navigate(`/product/legs/${leg.id || leg._id}`)}
            >
              {leg.name}
            </h3>
            <p className="legs-price">${leg.price}</p>
            <p className="legs-details">{leg.details}</p>
            <button className="legs-btn" onClick={() => addToCart(leg.id || leg._id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegsList;