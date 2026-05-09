import React, { useState, useEffect } from 'react';
import axios from 'axios';
import slugify from 'slugify';

const style = {
  container: { padding: '20px', marginBottom: '100px' },
  form: { marginBottom: '20px' },
  input: { margin: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', margin: '5px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' }
};

const App = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [updateCategoryId, setUpdateCategoryId] = useState('');
  const [updateCategoryName, setUpdateCategoryName] = useState('');
  const [updateCategoryDescription, setUpdateCategoryDescription] = useState('');
  const [updatedCategoryImage, setUpdatedCategoryImage] = useState(null);
  const [originalSlug, setOriginalSlug] = useState(''); // State for original slug during update

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleCreateCategory = async () => {
    const formData = new FormData();
    formData.append('name', newCategory);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Reset state after successful creation
      setNewCategory('');
      setDescription('');
      setImage(null);
      fetchCategories();
      alert("Category added successfully");
    } catch (error) {
      console.error('Error creating category', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!updateCategoryName) {
      console.error('Category name is required.');
      alert('Category name is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', updateCategoryName);
    formData.append('description', updateCategoryDescription);
    if (updatedCategoryImage) {
      formData.append('image', updatedCategoryImage);
    }

    // Generate new slug for the updated name
    const newSlug = slugify(updateCategoryName, { lower: true });

    try {
      // Perform the PUT request to update the category
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/categories/${originalSlug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Category updated successfully:', response.data);
      alert("Category updated successfully");
      fetchCategories();
      // Reset update states
      setUpdateCategoryId('');
      setUpdateCategoryName('');
      setUpdateCategoryDescription('');
      setUpdatedCategoryImage(null);
      setOriginalSlug(''); // Reset original slug
    } catch (error) {
      console.error('Error updating category:', error.response ? error.response.data : error.message);
      alert('Error updating category: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditClick = (category) => {
    setUpdateCategoryId(category.id);
    setUpdateCategoryName(category.name);
    setUpdateCategoryDescription(category.description);
    setOriginalSlug(category.slug); // Store the original slug for the update
    // You might want to store the current image URL if you plan to display it
    // Optionally set the image preview state if needed
  };

  return (
    <div style={style.container}>
      <h1>Category Management</h1>
      <div style={style.form}>
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={style.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={style.input}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={style.input}
        />
        <button onClick={handleCreateCategory} style={style.button}>Add Category</button>
      </div>
      {updateCategoryId && (
        <div style={style.form}>
          <input
            type="text"
            placeholder="Update Category Name"
            value={updateCategoryName}
            onChange={(e) => setUpdateCategoryName(e.target.value)}
            style={style.input}
          />
          <input
            type="text"
            placeholder="Update Description"
            value={updateCategoryDescription}
            onChange={(e) => setUpdateCategoryDescription(e.target.value)}
            style={style.input}
          />
          <input
            type="file"
            onChange={(e) => setUpdatedCategoryImage(e.target.files[0])}
            style={style.input}
          />
          <button onClick={handleUpdateCategory} style={style.button}>Update Category</button>
          <button onClick={() => setUpdateCategoryId('')} style={style.button}>Cancel</button>
        </div>
      )}
      <table style={style.table}>
        <thead>
          <tr>
            <th style={style.th}>Category Name</th>
            <th style={style.th}>Category Description</th>
            <th style={style.th}>Image</th>
            <th style={style.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td style={style.td}>{category.name}</td>
              <td style={style.td}>{category.description}</td>
              <td style={style.td}>
                {category.image && <img src={`${process.env.REACT_APP_API_URL}/public/userImages/${category.image}`} alt={category.name} style={{ width: '100px', height: 'auto' }} />}
              </td>
              <td style={style.td}>
                <button onClick={() => handleEditClick(category)} style={style.button}>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)} style={style.button}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
