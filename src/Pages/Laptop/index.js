import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const LaptopList = () => {
  const [laptops, setLaptops] = useState([]);
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
    const fetchLaptops = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories/Laptops/products");
        const data = await res.json();
        
        if (data.success) {
          // ✅ SQL id → _id format (frontend এ _id use করা আছে)
          const formattedLaptops = data.products.map(product => ({
            ...product,
            _id: product.id  // SQL id কে _id হিসেবে map
          }));
          setLaptops(formattedLaptops);
        } else {
          console.error("Failed to fetch laptops:", data.message);
          setLaptops([]);
        }
      } catch (err) {
        console.error("Error fetching laptops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="laptop-container">
      <h2 className="laptop-title">Our Laptops</h2>
      <div className="laptop-grid">
        {laptops.map((laptop) => (
          <div key={laptop._id || laptop.id} className="laptop-card">
            <img
              src={laptop.photo}
              alt={laptop.name}
              className="laptop-image"
              style={{ cursor: "pointer" }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
              onClick={() => navigate(`/product/laptops/${laptop._id || laptop.id}`)}
            />
            <h3
              className="laptop-name"
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => navigate(`/product/laptops/${laptop._id || laptop.id}`)}
            >
              {laptop.name}
            </h3>
            <p className="laptop-price">${laptop.price}</p>
            <p className="laptop-details">{laptop.details}</p>
            <button
              className="laptop-btn"
              onClick={() => addToCart(laptop._id || laptop.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaptopList;