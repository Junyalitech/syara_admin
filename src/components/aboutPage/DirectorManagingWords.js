import React, { useState } from 'react';
import axios from 'axios';
import OurCompanyProfile from './DirectorManagingwordsGet';

const OurMissionForm = () => {
  const [formData, setFormData] = useState({
    text1: '',
    text2: '',
    text3: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/director-managing-words`, formData, {
        headers: {
          'Content-Type': 'application/json' // Set content type to application/json
        }
      });
      console.log('OurMission data submitted successfully:', response.data);
      alert('OurMission data added successfully!');
    } catch (error) {
      console.error('Error submitting OurMission data:', error);
    }
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '900px',
    margin: '50px auto',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '50px', // Space between form elements
    alignItems: 'center',
    flexWrap: 'wrap', // Allows wrapping if necessary
  };

  const formGroupStyle = {
    flex: '1',
    minWidth: '200px', // Minimum width for each element
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '16px',
    height: '48px', // Ensure consistent height
  };

  const buttonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    height: '48px', // Ensure consistent height
    minWidth: '120px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Director Managing Word’s</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <input
            type="text"
            name="text1"
            value={formData.text1}
            onChange={handleInputChange}
            placeholder="Description"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <input
            type="text"
            name="text2"
            value={formData.text2}
            onChange={handleInputChange}
            placeholder="Position"
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <input
            type="text"
            name="text3"
            value={formData.text3}
            onChange={handleInputChange}
            placeholder="Name"
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Submit
          </button>
        </div>
      </form>
      <OurCompanyProfile />
    </div>
  );
};

export default OurMissionForm;
