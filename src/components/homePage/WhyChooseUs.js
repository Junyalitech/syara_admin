import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WhyChooseUs.css'; // Assuming you want to keep CSS external

const WhyChooseUs = () => {
  const [images, setImages] = useState([]);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [text4, setText4] = useState('');
  const [text5, setText5] = useState('');
  const [items, setItems] = useState([]);

  const handleImageChange = (e) => {
    setImages(e.target.files); // Multiple file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Array.from(images).forEach((image) => {
      formData.append('image', image);
    });
    formData.append('text1', text1);
    formData.append('text2', text2);
    formData.append('text3', text3);
    formData.append('text4', text4);
    formData.append('text5', text5);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/why-choose-us`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Submit response:', response.data);
      fetchItems(); // Refresh the list of items
      setImages([]);
      setText1('');
      setText2('');
      setText3('');
      setText4('');
      setText5('');
      alert('New item inserted successfully');
    } catch (error) {
      console.error('Error uploading item:', error);
      alert('Failed to upload item. Please try again.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/why-choose-us`);
      console.log('Fetched why choose us :', response.data); // Log response to verify image paths
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to fetch items. Please try again.');
    }
  };

  return (
    <div className="why-choose-us-container">
      <h2 className="heading">Why Choose Us</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="custom-file-upload">
          <input className="file-input-home" type="file" onChange={handleImageChange} multiple />
          Choose images (up to 5)
        </label>
        <input className="text-input" type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="Enter Text 1" />
        <input className="text-input" type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Enter Text 2" />
        <input className="text-input" type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Enter Text 3" />
        <input className="text-input" type="text" value={text4} onChange={(e) => setText4(e.target.value)} placeholder="Enter Text 4" />
        <input className="text-input" type="text" value={text5} onChange={(e) => setText5(e.target.value)} placeholder="Enter Text 5" />
        <button className="upload-button1" type="submit">Submit</button>
      </form>

      {/* Display items in tabular format */}
      <table className="items-table">
        <thead>
          <tr>
            <th>Images</th>
            <th>Text 1</th>
            <th>Text 2</th>
            <th>Text 3</th>
            <th>Text 4</th>
            <th>Text 5</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 && items.map((item) => {
            // Parse the image field if it's a stringified array
            const imagesArray = JSON.parse(item.image);

            return (
              <tr key={item.id}>
                <td className="image-gallery">
                  {imagesArray && imagesArray.length > 0 ? (
                    imagesArray.map((img, index) => (
                      <img key={index} src={`${process.env.REACT_APP_API_URL}/${img}`} alt={`Why Choose Us ${index}`} className="table-image" />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </td>
                <td>{item.text1}</td>
                <td>{item.text2}</td>
                <td>{item.text3}</td>
                <td>{item.text4}</td>
                <td>{item.text5}</td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default WhyChooseUs;
