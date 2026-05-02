import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeSlider.css';

const HomeSlider = () => {
    const [sliderImages, setSliderImages] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };

    const handleApi = async () => {
        if (!image) {
            alert("Please select an image");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", image);

            const result = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            alert("Home Slider image submitted successfully!");
            fetchSliderImages();
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (imageId) => {
        setLoading(true);
        try {
            const result = await axios.delete(`${process.env.REACT_APP_API_URL}/upload/${imageId}`);
            alert("Image deleted successfully!");
            fetchSliderImages();
        } catch (error) {
            console.error("Error deleting image:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliderImages();
    }, []);

    const fetchSliderImages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/upload`);
            console.log(response.data); // Check the response structure
            setSliderImages(response.data.data || []);  // Ensure it's an array
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Home Slider</h2>

            <div className="image-upload-container">
                <label htmlFor="imageUpload" className="label-button">
                    Choose Image
                </label>
                <input
                    id="imageUpload"
                    type="file"
                    onChange={handleImage}
                    style={{ display: 'none' }}
                />
                <button
                    type="submit"
                    onClick={handleApi}
                    className="submit-button"
                >
                    {loading ? 'Uploading...' : 'Submit'}
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Image Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sliderImages && sliderImages.length > 0 ? (
                            sliderImages.map((item, index) => (
                                <tr key={index} style={{ backgroundColor: '#f7f7f7' }}>
                                    <td>
                                    <img src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`} alt={`slider-${index}`} />

                                    </td>
                                    <td>{item.image}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="action-button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No images found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomeSlider;
