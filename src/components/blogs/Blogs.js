import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../blogs/blogs.css";

const Blogs = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    formData.append('image', image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/our-blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBlogs([...blogs, response.data]);
      setText('');
      setImage(null);
      fetchImagesBlogs(); // Fetch images after a new blog is submitted
      alert("blogs are submitted")
    } catch (error) {
      console.error('Error uploading data', error);
    }
  };

  const fetchImagesBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/our-blogs/api`);
      setImages(response.data.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImagesBlogs(); // Fetch images on component mount
  }, []);


  
const handleDeleteBlogs = async (id) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/our-blogs/${id}`);
    console.log('News article deleted successfully');
    alert('Blog deleted successfully');
    setImages(prevImages => prevImages.filter(blog => blog._id !== id)); // Make sure you're using the correct identifier here

  } catch (error) {
    console.error('Error deleting news article:', error);
  }
};

  return (
    <div className="blog-form">
      <form onSubmit={handleSubmit}>
        <table className="input-table">
          <thead>
            <tr>
              <th>Text</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  id="text"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Enter blog text"
                  className="styled-input"
                  required
                />
              </td>
              <td>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="styled-input"
                  required
                />
              </td>
              <td>
                <button type="submit" className="styled-button">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <table className="blog-list">
        <thead>
          <tr>
            <th>Image</th>
            <th>Text</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {images.map((blog) => (
            <tr key={blog._id}> {/* Make sure this key exists */}
              <td>
                <img
                  src={`${process.env.REACT_APP_API_URL}/${blog.image}`}
                  alt="Blog"
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{blog.text}</td>
              <td>
               
                <button
                  onClick={() => handleDeleteBlogs(blog.id)}
                  style={{ backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px', padding: '15px 15px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default Blogs;
