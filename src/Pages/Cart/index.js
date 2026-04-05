import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./style.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!userInfo) return;

      try {
        setLoading(true);
        const res = await fetch("http://localhost:5001/api/cart", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (data.success) {
          setCart(data.cart || []);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch cart");
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userInfo]);

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  // Delete item
  const handleDelete = async (itemId) => {
    if (!itemId) {
      setError("Invalid item ID");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/cart/delete/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setCart((prev) => prev.filter((item) => item._id !== itemId));
      setError(null);
    } catch (err) {
      console.error("Failed to delete item:", err);
      setError("Failed to delete item");
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1 || !itemId) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/cart/update/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed");
      }

      setCart((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setError(null);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Failed to update quantity");
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="cart-section">
      <h2>Your Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-shop">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span>Action</span>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-product">
                  <img
                    src={item.product?.photo || '/placeholder.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="item-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                  <div>
                    <span className="item-name">{item.product?.name || 'Unknown Product'}</span>
                    <span className="item-price">
                      ${(item.product?.price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="quantity-section">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => 
                      handleUpdateQuantity(item._id, Number(e.target.value))
                    }
                  />
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>

                <div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/order", { 
                  state: { cart, total: totalPrice } 
                })
              }
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
