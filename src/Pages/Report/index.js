import React, { useState, useEffect } from "react";
import "./style.css";
//hello
const ReportPage = () => {
  const [opinion, setOpinion] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get userId from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.id) setUserId(userInfo.id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!opinion) return;

    try {
      const res = await fetch(`http://localhost:5001/api/report`, { // changed port to 5001
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opinion, userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setIsError(false);
        setOpinion("");
      } else {
        setMessage(data.error || data.message || "Something went wrong");
        setIsError(true);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Failed to connect to server");
      setIsError(true);
    }
  };

  return (
    <div className="report-container">
      <h2>Give Your Opinion</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="Write your opinion..."
          required
        />
        <button type="submit" disabled={!opinion.trim()}>Submit</button>
      </form>

      {message && (
        <p className={`message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ReportPage;
