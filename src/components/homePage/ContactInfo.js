import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [currentContactInfo, setCurrentContactInfo] = useState(null);

  // Fetch the current contact information from the API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/contact-info/api`);
        console.log('Fetched data:', response.data); // Check the response data structure

        // Access the actual data from the response
        const contactInfo = response.data.data;
        if (contactInfo) {
          setCurrentContactInfo(contactInfo);
          setPhone(contactInfo.phone || ''); // Handle possible missing fields
          setEmail(contactInfo.email || ''); // Handle possible missing fields
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
        setMessage('Failed to load contact information.');
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact-info`, { phone, email });
      console.log('Update response:', response.data); // Check the update response
      setMessage(response.data.message);
      setCurrentContactInfo({ phone, email });
    } catch (error) {
      setMessage('Failed to update contact info.');
      console.error('Error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Update Contact Information</h2>
      
      {currentContactInfo ? (
        <div style={styles.currentInfo}>
          <h3 style={styles.subHeading}>Current Contact Information</h3>
          <p><strong>Phone:</strong> {currentContactInfo.phone || 'N/A'}</p>
          <p><strong>Email:</strong> {currentContactInfo.email || 'N/A'}</p>
        </div>
      ) : (
        <div style={styles.currentInfo}>
          <p>Loading current contact information...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.leftColumn}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.rightColumn}>
          <label htmlFor="phone" style={styles.label}>Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Update</button>
      </form>
      
      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  subHeading: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '15px',
  },
  currentInfo: {
    backgroundColor: '#e9e9e9',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flexShrink: 0,
    alignSelf: 'center',
    marginLeft: '20px',
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
};

export default ContactForm;
