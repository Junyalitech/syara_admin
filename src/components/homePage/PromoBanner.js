import axios from 'axios';
import React, { useEffect, useState } from 'react'

const PromoBanner = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState('');
    const [images, setImages] = useState([]);
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

        const formData = new FormData();

        formData.append('image', image);
        formData.append('title', form.title);
        formData.append('subtitle', form.subtitle);
        formData.append('description', form.description);
        formData.append('button', form.button);

        try {
            setLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/createTwobanner`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert('Uploaded successfully');

            setImages(prev => [response.data, ...prev]);

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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/gettwoBanner`);
            console.log('Fetched images:', response.data);
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
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
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/upload/${user.id}`);
            console.log('Item deleted successfully:', response.data);
            alert('Delete images of home slider is successfully');
            setImages(prevImages => prevImages.filter(img => img.id !== user.id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div style={{ marginTop: '18px' }}>
            <h1 className="heading">Promotion Banner</h1>

            {/* Upload Card */}
            <div className="card upload-card">
                <h2>Add Promotion Banner</h2>

                <form onSubmit={handleSubmit} className="form-grid">
                    {/* <input type="text" name="id" placeholder="ID" value={form.id} onChange={handleInputChange} /> */}

                    <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleInputChange} />

                    <input type="text" name="subtitle" placeholder="Subtitle" value={form.subtitle} onChange={handleInputChange} />

                    <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} />

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

                    <label className="file-upload">
                        <input type="file" onChange={handleImageChange} />
                        {imageName ? imageName : "Choose Image"}
                    </label>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Promotion Banner'}
                    </button>
                </form>
            </div>

            {/* Gallery */}
            <div className="gallery">
                {images.map((item) => (
                    <div key={item.id} className="card image-card">

                        {/* Image */}
                        {item.image && (
                            <img
                                src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`}
                                alt={item.title}
                            />
                        )}

                        {/* Data */}
                        <div className="image-info">
                            <h3>{item.title || "No Title"}</h3>

                            {item.subtitle && (
                                <p className="subtitle">{item.subtitle}</p>
                            )}

                            <p>{item.description || "No Description"}</p>

                            {/* {item.button && (
                <span className="button-tag">{item.button}</span>
              )} */}
                        </div>

                        {/* Delete */}
                        <button
                            className="btn-danger"
                            onClick={() => handleDeleteButtonClick(item)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PromoBanner