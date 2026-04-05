import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const ElectronicsList = () => {
  const [products, setProducts] = useState([]);
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
          quantity: 1,
        }),
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
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories/Electronics/products");
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.products || []);
        } else {
          console.error("Failed to fetch electronics:", data.message);
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching electronics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="electronics-container">
      <h2 className="electronics-title">Electronics</h2>
      <div className="electronics-grid">
        {products.map((product) => (
          <div key={product.id} className="electronics-card">
            <img 
              src={product.photo} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
            <h3
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => navigate(`/product/electronics/${product.id}`)}
            >
              {product.name}
            </h3>
            <p className="price">${product.price}</p>
            <p className="details">{product.details}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectronicsList;