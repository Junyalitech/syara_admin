import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../homePage/HomePage.css";

const Testimonial = () => {
  const [testimonialDetails, setTestimonialDetails] = useState('');
  const [testimonialName, setTestimonialName] = useState('');
  const [items, setItems] = useState([]);

  const handleDetailsChange = (e) => {
    setTestimonialDetails(e.target.value);
  };

  const handleNameChange = (e) => {
    setTestimonialName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      testimonialdetails: testimonialDetails,
      testimonialname: testimonialName,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/testimonial`, formData);
      console.log('Testimonial uploaded successfully:', response.data);
      alert('Testimonial inserted successfully');

      // Prepend the new testimonial to the beginning of the array
      setItems(prevItems => [response.data, ...prevItems]);

      // Clear the form fields
      setTestimonialDetails('');
      setTestimonialName('');

    } catch (error) {
      console.error('Error uploading testimonial:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/testimonial`);
      console.log('Fetched testimonials:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDeleteTestimonial = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/testimonial/${id}`);
      console.log('Testimonial deleted successfully');
      alert('Testimonial deleted successfully');

      // Remove the deleted testimonial from the items array
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  return (
    <div className="testimonial-container">
      <h2 className="heading">Testimonials</h2>
      <form className="upload-form-category" onSubmit={handleSubmit}>
        <textarea
          className="text-input"
          value={testimonialDetails}
          onChange={handleDetailsChange}
          placeholder="Enter Testimonial Details"
        ></textarea>
        <input
          className="text-input"
          type="text"
          value={testimonialName}
          onChange={handleNameChange}
          placeholder="Enter Testimonial Name"
        />
        <button className="upload-button" type="submit">Upload Testimonial</button>
      </form>
      <div style={{ width: '100%', overflowY: 'auto', maxHeight: '400px', padding: '10px', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f4f4f4' }}>Details</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f4f4f4' }}>Name</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f4f4f4' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '2px solid #ddd' }}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>{item.testimonialdetails}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '12px', fontWeight: 'bold' }}>{item.testimonialname}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDeleteTestimonial(item.id)}
                    style={{ backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testimonial;
