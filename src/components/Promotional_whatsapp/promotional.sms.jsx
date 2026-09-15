import React, { useState } from "react";
import "./PromotionalMessages.css";

const PromotionalMessages = () => {
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const API_URL = process.env.REACT_APP_API_URL;

  const sendCampaign = async (type) => {
    setMessage({ type: "", text: "" });

    // validation...

    setLoading(type);

    try {
      const endpoint =
        type === "new-arrivals"
          ? `${API_URL}/whatsapp/new-arrivals`
          : `${API_URL}/whatsapp/special-sale`;

      const body =
        type === "special-sale"
          ? { discount: Number(discount) }
          : {};


      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to send promotional messages."
        );
      }

      setMessage({
        type: "success",
        text: data?.message || "Campaign sent successfully!",
      });

    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.message ||
          "Something went wrong while sending the campaign.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="promotional-page">
      {/* HEADER */}
      <div className="promo-header">
        <div>
          <h1>Promotional Messages</h1>
          <p>
            Send promotional WhatsApp messages to your customers
          </p>
        </div>

        <div className="whatsapp-status">
          <span className="status-dot"></span>
          WhatsApp Campaigns
        </div>
      </div>

      {/* GLOBAL RESPONSE */}
      {message.text && (
        <div
          className={`promo-alert ${message.type === "success"
            ? "alert-success"
            : "alert-error"
            }`}
        >
          <span className="alert-icon">
            {message.type === "success" ? "✓" : "!"}
          </span>

          <span>{message.text}</span>

          <button
            onClick={() => setMessage({ type: "", text: "" })}
            className="alert-close"
          >
            ×
          </button>
        </div>
      )}

      {/* CAMPAIGNS */}
      <div className="campaign-grid">
        {/* NEW ARRIVALS */}
        <div className="campaign-card">
          <div className="campaign-top">
            <div className="campaign-icon">
              ✨
            </div>

            <div>
              <h2>New Arrivals</h2>
              <p>Promote your latest collection</p>
            </div>
          </div>

          <div className="campaign-preview-title">
            Message Preview
          </div>

          <div className="whatsapp-preview">
            <div className="preview-body">
              <h3>New Arrivals at Syara Retails</h3>

              <p>
                Discover what's new at Syara Retails! ✨
              </p>

              <p>
                Explore our latest collection featuring new
                products and fresh styles, carefully selected
                for you.
              </p>

              <p>
                Visit our store and discover your next
                favourite today. 🛍️
              </p>

              <div className="preview-brand">
                Syara Retails
              </div>
            </div>

            <div className="preview-button">
              ↗ &nbsp; Explore Now
            </div>
          </div>

          <div className="campaign-info">
            <span>👥</span>
            Message will be sent to all customers
          </div>

          <button
            className="send-btn"
            onClick={() => sendCampaign("new-arrivals")}
            disabled={loading !== null}
          >
            {loading === "new-arrivals" ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                <span>↗</span>
                Send New Arrivals
              </>
            )}
          </button>
        </div>

        {/* SPECIAL SALE */}
        <div className="campaign-card">
          <div className="campaign-top">
            <div className="campaign-icon sale-icon">
              🏷️
            </div>

            <div>
              <h2>Special Sale</h2>
              <p>Send a special discount offer</p>
            </div>
          </div>

          {/* DISCOUNT */}
          <div className="discount-group">
            <label htmlFor="discount">
              Discount Percentage
            </label>

            <div className="discount-input-wrapper">
              <input
                id="discount"
                type="number"
                min="1"
                max="100"
                placeholder="Enter discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                disabled={loading !== null}
              />

              <span>% OFF</span>
            </div>

            <small>
              Enter the discount that should appear in the
              promotional message.
            </small>
          </div>

          <div className="campaign-preview-title">
            Message Preview
          </div>

          <div className="whatsapp-preview">
            <div className="preview-body">
              <h3>Special Offer from Syara Retails</h3>

              <p>
                Exciting savings are here at Syara Retails!
                🛍️
              </p>

              <p>
                Enjoy up to{" "}
                <strong>
                  {discount ? `${discount}%` : "{{1}}%"}
                </strong>{" "}
                OFF on selected products and shop your
                favourites at special prices.
              </p>

              <p>
                Explore the offer and shop now before it's
                over! ✨
              </p>
            </div>

            <div className="preview-button">
              ↗ &nbsp; Shop Now
            </div>
          </div>

          <div className="campaign-info">
            <span>👥</span>
            Message will be sent to all customers
          </div>

          <button
            className="send-btn"
            onClick={() => sendCampaign("special-sale")}
            disabled={loading !== null}
          >
            {loading === "special-sale" ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                <span>↗</span>
                Send Special Sale
              </>
            )}
          </button>
        </div>
      </div>

      {/* WARNING */}
      <div className="campaign-warning">
        <span>⚠️</span>

        <div>
          <strong>Before sending</strong>
          <p>
            Promotional messages will be sent to all
            customers with an available WhatsApp number.
            Please verify the campaign details before
            sending.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionalMessages;