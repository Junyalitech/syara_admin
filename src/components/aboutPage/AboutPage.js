import React, { useState } from 'react';
import axios from 'axios';
import OurMission from './OurMission';
import OurApproach from './OurApproachPost'
import CompanyProfile from './CompanyProfilePost';
import DirectorProfile from './DirectorProfile';
import DirectorManagingWords from './DirectorManagingWords'
import Team from './Team';
import FAQ from './Faq';
const OurMissionForm = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    image: null,
    text1: '',
    text2: '',
    text3: '',
    text4: '',
    text5: '',
    text6: '',
    text7: '',
    text8: '',
    text9: '',
    text10: '',
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
    missionData.append('text1', formData.text1);
    missionData.append('text2', formData.text2);
    missionData.append('text3', formData.text3);
    missionData.append('text4', formData.text4);
    missionData.append('text5', formData.text5);
    missionData.append('text6', formData.text6);
    missionData.append('text7', formData.text7);
    missionData.append('text8', formData.text8);
    missionData.append('text9', formData.text9);
    missionData.append('text10', formData.text10);

    try {
      setLoading(true)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/our-mission`, missionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('OurMission data submitted successfully:', response.data);
      alert('OurMission data added successfully!');
    } catch (error) {
      console.error('Error submitting OurMission data:', error);
    }
    finally {
      setLoading(false)
      setFormData({
        image: null,
        text1: '',
        text2: '',
        text3: '',
        text4: '',
        text5: '',
        text6: '',
        text7: '',
        text8: '',
        text9: '',
        text10: '',
      })
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
    flexDirection: 'column',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '16px',
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
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
  };

  return (
    <>
      <div style={containerStyle} >
        <h2 style={headingStyle}>Add Our Vision</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Upload Image:</label>
            <input type="file" name="image" onChange={handleImageChange} style={inputStyle} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 1:</label>
            <input
              type="text"
              name="text1"
              value={formData.text1}
              onChange={handleInputChange}
              placeholder="Enter text for section 1"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 2:</label>
            <input
              type="text"
              name="text2"
              value={formData.text2}
              onChange={handleInputChange}
              placeholder="Enter text for section 2"
              style={inputStyle}
            />
          </div>

          {/* Repeat the same pattern for all text inputs */}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 3:</label>
            <input
              type="text"
              name="text3"
              value={formData.text3}
              onChange={handleInputChange}
              placeholder="Enter text for section 3"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 4:</label>
            <input
              type="text"
              name="text4"
              value={formData.text4}
              onChange={handleInputChange}
              placeholder="Enter text for section 4"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 5:</label>
            <input
              type="text"
              name="text5"
              value={formData.text5}
              onChange={handleInputChange}
              placeholder="Enter text for section 5"
              style={inputStyle}
            />
          </div>
          {/* <div style={formGroupStyle}>
            <label style={labelStyle}>Text 6:</label>
            <input
              type="text"
              name="text6"
              value={formData.text6}
              onChange={handleInputChange}
              placeholder="Enter text for section 6"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 7:</label>
            <input
              type="text"
              name="text7"
              value={formData.text7}
              onChange={handleInputChange}
              placeholder="Enter text for section 7"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 8:</label>
            <input
              type="text"
              name="text8"
              value={formData.text8}
              onChange={handleInputChange}
              placeholder="Enter text for section 8"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 9:</label>
            <input
              type="text"
              name="text9"
              value={formData.text9}
              onChange={handleInputChange}
              placeholder="Enter text for section 9"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Text 10:</label>
            <input
              type="text"
              name="text10"
              value={formData.text10}
              onChange={handleInputChange}
              placeholder="Enter text for section 10"
              style={inputStyle}
            />
          </div> */}

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {/**Mission ko show karane k leye code likha gya h */}
        <OurMission />
      </div>
      <div>

        {/* <OurApproach /> */}

      </div>
      <div>
        {/* <CompanyProfile />  */}
      </div>
      <div style={{ padding: "28px" }}>
        <DirectorProfile />
      </div>
      <div>
        {/* <DirectorManagingWords /> */}
        <Team />
      </div>

      <div>
        {/* <DirectorManagingWords /> */}
        <FAQ />
      </div>
    </>
  );
};

export default OurMissionForm;
