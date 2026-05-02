import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MissionTable = () => {
  const [data, setData] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/our-approach/api`); // Replace with your GET API endpoint
        console.log(response.data); // Log the response to see the structure

        // Extract the 'data' array from the response object
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data); // Set the array to the state
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Styles for table
  const tableStyle = {
    width: '100%',
    margin: '20px auto',
    borderCollapse: 'collapse',
    maxWidth: '1200px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const thStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  };

  const tdStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center',
  };

  const imageStyle = {
    width: '100px',
    height: 'auto',
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Our Approach Data</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Text 1</th>
            <th style={thStyle}>Text 2</th>
            <th style={thStyle}>Text 3</th>
            <th style={thStyle}>Text 4</th>
            <th style={thStyle}>Text 5</th>
            <th style={thStyle}>Text 6</th>
            <th style={thStyle}>Text 7</th>
            <th style={thStyle}>Text 8</th>
            <th style={thStyle}>Text 9</th>
            <th style={thStyle}>Text 10</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                <img src={`/api/public/userImages/${item.image}`} alt="Mission" style={imageStyle} />
              </td>
              <td style={tdStyle}>{item.text1}</td>
              <td style={tdStyle}>{item.text2}</td>
              <td style={tdStyle}>{item.text3}</td>
              <td style={tdStyle}>{item.text4}</td>
              <td style={tdStyle}>{item.text5}</td>
              <td style={tdStyle}>{item.text6}</td>
              <td style={tdStyle}>{item.text7}</td>
              <td style={tdStyle}>{item.text8}</td>
              <td style={tdStyle}>{item.text9}</td>
              <td style={tdStyle}>{item.text10}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MissionTable;
