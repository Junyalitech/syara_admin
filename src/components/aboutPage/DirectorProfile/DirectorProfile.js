import React, { useState } from 'react';
import axios from 'axios';
import OurDirectorProfile from './OurDirectorProfileGet';

const OurDirectorProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    image: null,
    text: '',
  });

  const MAX_WORDS = 500;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const words = value.trim().split(/\s+/).filter(Boolean);

    if (words.length <= MAX_WORDS) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      const limitedText = words.slice(0, MAX_WORDS).join(" ");

      setFormData((prev) => ({
        ...prev,
        [name]: limitedText,
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Image validation
    if (!formData.image) {
      alert("Please upload an image before submitting.");
      return;
    }

    // Confirmation before replacing existing data
    const confirmed = window.confirm(
      "Your existing data will be replaced with the new data. Do you want to continue?"
    );

    if (!confirmed) {
      return;
    }

    const missionData = new FormData();

    missionData.append("image", formData.image);
    missionData.append("text", formData.text);

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/director-profile`,
        missionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Director Profile updated successfully:",
        response.data
      );

      // Immediately refresh the Director Profile table
      setRefreshTrigger((prev) => prev + 1);

      alert("Director Profile updated successfully!");

    } catch (error) {
      console.error("Error submitting Director Profile:", error);

      alert("Failed to update Director Profile.");

    } finally {
      setLoading(false);
      setFormData({
        image: null,
        text: '',
      });
    }
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "900px",
    margin: "40px auto",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    boxSizing: "border-box",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#222",
    marginBottom: "30px",
    fontFamily: "Arial, sans-serif",
    fontSize: "26px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  };

  const formGroupStyle = {
    width: "100%",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "15px",
    color: "#333",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fff",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "250px",
    padding: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "15px",
    lineHeight: "1.6",
    resize: "vertical",
    outline: "none",
    fontFamily: "Arial, sans-serif",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "13px",
    border: "none",
    borderRadius: "7px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
  };

  const counterStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "6px",
    fontSize: "12px",
    color: "#777",
  };

  return (
    <div style={containerStyle}>

      <h2 style={headingStyle}>
        Director Profile
      </h2>

      <form onSubmit={handleSubmit} style={formStyle}>

        {/* Image */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Director Image
          </label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={inputStyle}
          />

          <small style={{ color: "#777", display: "block", marginTop: "6px" }}>
            Please upload a suitable profile image.
          </small>
        </div>


        {/* Description */}
        <div style={formGroupStyle}>

          <label style={labelStyle}>
            Director's Message
          </label>

          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Write the Director's message here..."
            style={textareaStyle}
          />

          <div style={counterStyle}>
            <span>
              Maximum {MAX_WORDS} words
            </span>

            <span>
              {formData.text.trim() === ""
                ? `0/${MAX_WORDS}`
                : `${formData.text.trim().split(/\s+/).length}/${MAX_WORDS}`}
            </span>
          </div>

        </div>


        {/* Submit */}
        <div style={formGroupStyle}>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Updating..." : "Update Director Profile"}
          </button>

        </div>

      </form>

      <OurDirectorProfile refreshTrigger={refreshTrigger} />

    </div>
  );
};

export default OurDirectorProfileForm;