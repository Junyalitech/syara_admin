import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../homePage/HomePage.css";

const HallOfFrame = () => {
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmitHallOfFrame = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/hall-of-frame`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Item uploaded successfully:', response.data);
      alert('Hall of frame item inserted successfully');

      // Add the new item to the top of the list
      setItems(prevItems => [response.data, ...prevItems]);
      setImage(null);


    } catch (error) {
      console.error('Error uploading item:', error);
      alert('Failed to upload item. Please try again.');
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/hall-of-frame`);
      console.log('Fetched images:', response.data);
      setItems(response.data.reverse()); // Ensure latest images are shown first
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/hall-of-frame/${id}`);
      console.log('Image deleted successfully');
      alert('Image deleted successfully');

      // Remove the deleted image from the list
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="hall-of-frame-container">
      <h2 className="heading">Hall of Fame</h2>
      <form className="upload-form" onSubmit={handleSubmitHallOfFrame}>
      <label className="custom-file-upload">
          <input className="file-input-home" type="file" onChange={handleImageChange} />
          Choose any image
        </label>        <button className="upload-button" type="submit">Upload Image</button>
      </form>
      <div style={{ width: '100%', overflowY: 'auto', maxHeight: '400px', padding: '10px', border: '1px solid #ddd' }}>
        <table className="category-table" style={{ width: '100%', background: "white", borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #999', padding: '8px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Image</th>

              <th style={{ borderBottom: '2px solid #999', padding: '8px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '2px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  {item.image ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`}
                      alt="Uploaded"
                      style={{ maxWidth: '120px', height: 'auto' }}
                      // onError={(e) => { e.target.onerror = null; e.target.src = "placeholder.jpg"; }}
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </td>

                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <button
                    style={{ backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px', padding: '15px 15px', cursor: 'pointer' }}
                    onClick={() => handleDeleteImage(item.id)}
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

export default HallOfFrame;
