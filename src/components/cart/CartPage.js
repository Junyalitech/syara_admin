import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [packet1kg, setPacket1kg] = useState('');
    const [packet500gm, setPacket500gm] = useState('');
    const [packet1kgPrice, setPacket1kgPrice] = useState('');
    const [packet500gmPrice, setPacket500gmPrice] = useState('');
    const [reviews, setReviews] = useState('');
    const [star, setStar] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('productname', productName);
        formData.append('packet1kg', packet1kg);
        formData.append('packet500gm', packet500gm);
        formData.append('packet1kgprice', packet1kgPrice);
        formData.append('packet500gmprice', packet500gmPrice);
        formData.append('revies', reviews);
        formData.append('star', star);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/productdetailsupdate`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload successful:', response.data);
            // Handle success, such as showing a success message or updating state
        } catch (error) {
            console.error('Error uploading data:', error);
            // Handle error, such as showing an error message to the user
        }
    };
    //shwo all product name and everything
    const [productdetailsupdate1, setProductDetailsUpdate] = useState([]);

    useEffect(() => {
        const fetchImagesProductDetailsUpdate = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/productdetailsupdate`);
                setProductDetailsUpdate(response.data.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesProductDetailsUpdate();
    }, []);
    //upload description vedio and recipei
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [recepie, setRecepie] = useState('');
    const [imagedesvrec, setImageDesVedRecpie] = useState('');

    const handleImageChangeDesVedioRecepie = (e) => {
        setImageDesVedRecpie(e.target.files[0]);
    };

    const handleSubmitDesVedioRecepie = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imagedesvrec);
        formData.append('description', description);
        formData.append('link', link);
        formData.append('recepie', recepie);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/disvediorecepie`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload successful:', response.data);
            // Handle success, such as showing a success message or updating state
        } catch (error) {
            console.error('Error uploading data:', error);
            // Handle error, such as showing an error message to the user
        }
    };

    //syaradesvediorecipie
    const [descediorecpie1, setDesVedioRecipie] = useState([]);

    useEffect(() => {
        const fetchImagesDesVedioRecpie = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/disvediorecepie`);
                setDesVedioRecipie(response.data.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesDesVedioRecpie();
    }, []);
    //upload also may you like 
    const [imagealsoyoumaylike, setImageAlsoYouMayLike] = useState('');
    const [textalsoyoumaylike, setTextAlsoMayYouLike] = useState('');
    const handleImagealsoyoumaylike = (e) => {
        setImageAlsoYouMayLike(e.target.files[0]);
    };

    const handleSubmitalsoyoumaylike = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imagealsoyoumaylike);
        formData.append('text', textalsoyoumaylike);


        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/youmayalsolike`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload successful:', response.data);
            // Handle success, such as showing a success message or updating state
        } catch (error) {
            console.error('Error uploading data:', error);
            // Handle error, such as showing an error message to the user
        }
    };

    //also you may like start
    //syaranews
    const [youmayalsolike1, setYouMayAlsoLike] = useState([]);

    useEffect(() => {
        const fetchImagesYouMayAlsoLike = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/youmayalsolike`);
                setYouMayAlsoLike(response.data.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImagesYouMayAlsoLike();
    }, []);
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '200px' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Testimonial</div>
                    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', background: '#f9f9f9' }}>
                        <div style={{ display: 'flex', flexWrap: "wrap", gap: '2rem', marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image:</label>
                            <input type="file" onChange={handleImageChange} required />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Name:</label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Packet 1kg:</label>
                            <input
                                type="text"
                                value={packet1kg}
                                onChange={(e) => setPacket1kg(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Packet 500gm:</label>
                            <input
                                type="text"
                                value={packet500gm}
                                onChange={(e) => setPacket500gm(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Packet 1kg Price:</label>
                            <input
                                type="text"
                                value={packet1kgPrice}
                                onChange={(e) => setPacket1kgPrice(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Packet 500gm Price:</label>
                            <input
                                type="text"
                                value={packet500gmPrice}
                                onChange={(e) => setPacket500gmPrice(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reviews:</label>
                            <input
                                type="text"
                                value={reviews}
                                onChange={(e) => setReviews(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />

                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Star:</label>
                            <input
                                type="text"
                                value={star}
                                onChange={(e) => setStar(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ background: '#007bff', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>Submit</button>
                    </form>
                </div>

            </div>
            <div>
                <div>
                    {productdetailsupdate1.map((productdetailsupdate, index) => (
                        <div className="main-conatiner-offlor-rice-details-fisrt-container-img" key={index} style={{ display: "flex", gap: "2rem" }} >
                            <img style={{ width: "200px", height: "200px" }} src={`${process.env.REACT_APP_API_URL}/public/userImages/${productdetailsupdate.image}`} />
                            <div>{productdetailsupdate.productname}</div>
                            <div>{productdetailsupdate.packet1kg}</div>
                            <div>{productdetailsupdate.packet500gm}</div>
                            <div>{productdetailsupdate.packet1kgprice}</div>
                            <div>{productdetailsupdate.packet500gmprice}</div>
                            <div>{productdetailsupdate.revies}</div>
                            <div>{productdetailsupdate.star}</div>

                        </div>
                    ))}


                </div>
            </div>
            {/**description and vedio and recepie start */}
            <form onSubmit={handleSubmitDesVedioRecepie} >
                <div>Description Vedio Recipe</div>
                <label style={{ marginBottom: '0.5rem' }}>Image:</label>
                <input type="file" onChange={handleImageChangeDesVedioRecepie} required />
                <label style={{ marginBottom: '0.5rem' }}>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    required
                />
                <label style={{ marginBottom: '0.5rem' }}>Link:</label>
                <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    required
                />
                <label style={{ marginBottom: '0.5rem' }}>Recepie:</label>
                <input
                    type="text"
                    value={recepie}
                    onChange={(e) => setRecepie(e.target.value)}
                    style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    required
                />
                <button type="submit" style={{ background: '#007bff', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>Submit</button>
            </form>
            <div style={{ marginBottom: "100px", gap: "2rem" }}>
                {descediorecpie1.map((descediorecpie, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <img style={{ width: "200px", height: "200px", borderRadius: '8px', marginBottom: '1rem' }} src={`${process.env.REACT_APP_API_URL}/public/userImages/${descediorecpie.image}`} alt={descediorecpie.description} />
                        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>{descediorecpie.description}</div>
                        <a href={descediorecpie.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '0.5rem', color: '#007bff', textDecoration: 'none' }}>
                            {descediorecpie.link}
                        </a>
                        <div style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>{descediorecpie.recepie}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginBottom: "100px" }}>
                <form onSubmit={handleSubmitalsoyoumaylike} style={{ marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ marginBottom: '0.5rem' }}>Image:</label>
                        <input type="file" onChange={handleImagealsoyoumaylike} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ marginBottom: '0.5rem' }}>Text:</label>
                        <input
                            type="text"
                            value={textalsoyoumaylike}
                            onChange={(e) => setTextAlsoMayYouLike(e.target.value)}
                            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ background: '#007bff', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>Submit</button>
                </form>

            </div>
            <div>
                {youmayalsolike1.map((youmayalsolike, index) => (
                    <div key={index}>
                        <img style={{ width: "200px", height: "200px" }} src={`${process.env.REACT_APP_API_URL}/public/userImages/${youmayalsolike.image}`} />
                        <div>{youmayalsolike.text}</div>
                    </div>

                ))}
            </div>
        </>
    );
};

export default CartPage;
