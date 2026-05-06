import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../homePage/TopCategory.css"; // Import the CSS file

const TopCategory = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const [dataLoading, setDataLoading] = useState(false); // for fetch
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // for delete button
  const [uploadLoading, setUploadLoading] = useState(false); // for upload button

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle name change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('description', description);

    try {
      setUploadLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Top category item inserted successfully');

      // Add the new item to the top of the list
      setItems(prevItems => [response.data, ...prevItems]);
      setImage(null);
      setName('');
      setDescription('');
      
    } catch (error) {
      console.error('Error uploading item:', error);
      alert('Failed to upload item. Please try again.');
    }
    finally{
      setUploadLoading(false);
    }
  };

  // Fetch items from the server
  const fetchItems = async () => {
    try {
      setDataLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to fetch items. Please try again.');
    }
    finally {     setDataLoading(false);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle delete button click
  const handleDeleteButtonClick = async (itemId) => {
    if (!itemId) {
      alert('Invalid item ID');
      return;
    }

    setDeleteLoadingId(itemId);

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${itemId}`);
      alert('Item deleted successfully');

      // Remove the item from the list
      setItems(prevItems => prevItems.filter(img => img.id !== itemId));
    } catch (error) {
      alert('Failed to delete item. Please try again.');
    }
    finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="top-category-container">
      <h2 className="heading">Category</h2>
      <form className="upload-form-category" onSubmit={handleSubmit}>
        <label className="custom-file-upload">
          <input className="file-input-home" type="file" onChange={handleImageChange} />
          Choose any image
        </label>
        <input className="text-input" type="text" value={name} onChange={handleNameChange} placeholder="Enter Name" />
        <textarea className="description-input" value={description} onChange={handleDescriptionChange} placeholder="Enter Description"></textarea>
        <button className="upload-button1" type="submit" disabled={uploadLoading}>
          {uploadLoading ? 'Uploading...' : 'Upload Item'}
        </button>
      </form>

      <div style={{ width: '100%', overflowY: 'auto', maxHeight: '400px', padding: '10px', border: '1px solid #ddd' }}>
        <table className="category-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No items found.</td>
              </tr>
            ) : 
            items.map(item => (
              <tr key={item.id}>
                <td>
                  {item.image ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`}
                      alt="Uploaded"
                      // onError={(e) => { e.target.onerror = null; e.target.src="placeholder.jpg" }}
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteButtonClick(item.id)}
                    disabled={deleteLoadingId === item.id}
                  >
                    {deleteLoadingId === item.id ? 'Deleting...' : 'Delete'}  
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

export default TopCategory;
