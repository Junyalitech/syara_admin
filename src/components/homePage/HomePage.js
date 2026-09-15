import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../homePage/HomePage.css";
import TopCategory from './Category/TopCategory.js';
import PromoBanner from './PromoBanner/PromoBanner.js';
import ContactForm from './ClientContact/ContactInfo.js';

import OurCombooffer from './ComboOffer/OurCombooffer';
import NewLaunches from './NewLaunch/NewLuanches';


const HomePage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);
  const [dataLoading, setDataLoading] = useState(false); // for fetch
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // for delete button
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    button: ""
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image before submitting.');
      return;
    }

    if (!form.title || !form.description || !form.button) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    const formData = new FormData();

    formData.append('image', image);
    formData.append('title', form.title);
    formData.append('subtitle', form.subtitle);
    formData.append('description', form.description);
    formData.append('button', form.button);

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );


      await fetchImages();
      alert('Uploaded successfully');

      // reset
      setImage(null);
      setImageName('');
      setForm({
        title: "",
        subtitle: "",
        description: "",
        button: ""
      });

    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      setDataLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/upload`);
      console.log('Fetched images:', response.data);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    finally {
      setDataLoading(false)
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDeleteButtonClick = async (user) => {
    if (!user || !user.id) {
      console.error('User or user ID is undefined');
      return;
    }

    // Minimum 1 slider must always exist
    if (images.length <= 1) {
      alert(
        'You cannot delete the last slider. Please add a new slide first, then you can delete this slide.'
      );
      return;
    }

    setDeleteLoadingId(user.id);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/upload/${user.id}`
      );

      console.log('Item deleted successfully:', response.data);
      alert('Delete slide of home slider is successfully');

      setImages(prevImages =>
        prevImages.filter(img => img.id !== user.id)
      );

    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="home-container">
      <h1 className="heading">Home Slider Manager</h1>

      {/* Upload Card */}
      {/* Upload Card */}
      <div className="card upload-card">

        <h2>Add New Slider</h2>

        {images.length >= 10 ? (
          <div className="slider-limit-message">
            <span>⚠️</span>
            <div>
              <strong>Maximum slider limit reached</strong>
              <p>You can have a maximum of 10 sliders. Please delete an existing slider to add a new one.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleInputChange}
            />

            <select
              name="button"
              value={form.button}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category *</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleInputChange}
            />

            <label className="file-upload">
              <input type="file" onChange={handleImageChange} />
              {imageName ? imageName : "Choose Image"}
            </label>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || images.length >= 10}
            >
              {loading ? 'Uploading...' : 'Upload Slider'}
            </button>

          </form>
        )}
      </div>


      {
        dataLoading ? (
          <div className="gallery">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card image-card skeleton-card">

                <div className="skeleton skeleton-image"></div>

                <div className="image-info">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text short"></div>
                </div>

                <div className="skeleton skeleton-button"></div>

              </div>
            ))}
          </div>
        ) : (
          <div className="gallery">
            {images.map((item) => (
              <div key={item.id} className="card image-card">

                {item.image && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`}
                    alt={item.title}
                  />
                )}

                <div className="image-info">
                  <h3>{item.title || "No Title"}</h3>

                  {item.subtitle && (
                    <p className="subtitle">{item.subtitle}</p>
                  )}

                  <p>{item.description || "No Description"}</p>
                </div>

                <button
                  className="btn-danger"
                  onClick={() => handleDeleteButtonClick(item)}
                  disabled={deleteLoadingId === item.id}
                >
                  {deleteLoadingId === item.id ? "Deleting..." : "Delete"}
                </button>

              </div>
            ))}
          </div>
        )
      }


      <TopCategory />
      <PromoBanner />
      <ContactForm />
    </div >
  );
};

export default HomePage;
