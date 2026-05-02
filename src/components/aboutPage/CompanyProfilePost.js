import React, { useState } from 'react';
import axios from 'axios';
import OurCompanyProfie from './OurCompanyProfileGet'
const OurMissionForm = () => {
  const [formData, setFormData] = useState({
    image: null,
    text: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missionData = new FormData();
    missionData.append('image', formData.image);
    missionData.append('text', formData.text);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/company-profile`, missionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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
      <h2 style={headingStyle}>Company Profile</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <input type="file" name="image" onChange={handleImageChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <input
            type="text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Enter text for section 1"
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
      <OurCompanyProfie/>
    </div>
  );
};

export default OurMissionForm;
