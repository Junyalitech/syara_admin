import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const fileInputRefs = useRef({});
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [nickname1, setNickname1] = useState('');
  const [nickname2, setNickname2] = useState('');
  const [nickname3, setNickname3] = useState('');
  const [packeoption1kg, setPackeoption1kg] = useState('');
  const [packeoption500gm, setPackeoption500gm] = useState('');
  const [packeoption1kgrate, setPackeoption1kgrate] = useState('');
  const [packeoption500gmrate, setPackeoption500gmrate] = useState('');
  const [video, setVideo] = useState('');
  const [recipe, setRecipe] = useState('');
  const [productNamealsoyoumaylike, setProductNamealsoyoumaylike] = useState('');
  const [link, setLink] = useState('');
  const [restriction, setRestriction] = useState('');
  const [type, setType] = useState('');
  const [newLaunch, setNewLaunch] = useState(false); // New state for newLaunch
  const [OurComOffer, setOurComOffer] = useState(false); // New state for ourcombooofer
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null
  });
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState("");
  const [review, setReview] = useState(null);
  const [oldPrice, setOldPrice] = useState('');
  const [isLiquid, setIsLiquid] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setProductName('');
    setCategory('');
    setPrice('');
    setDescription('');
    setNickname1('');
    setNickname2('');
    setNickname3('');
    setPackeoption1kg(false);
    setPackeoption500gm(false);
    setPackeoption1kgrate('');
    setPackeoption500gmrate('');
    setVideo('');
    setRecipe('');
    setProductNamealsoyoumaylike('');
    setLink('');
    setRestriction('');
    setType('');
    setNewLaunch(false);
    setOurComOffer(false);
    setStock('');
    setRating("");
    setReview(null);
    setOldPrice('');
    setIsLiquid(false);

    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages((prevImages) => ({
      ...prevImages,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('categoryId', category); // Use category ID here
    formData.append('price', Number(price)); // Convert to number
    formData.append('description', description);
    formData.append('nickname1', nickname1);
    formData.append('nickname2', nickname2);
    formData.append('nickname3', nickname3);
    formData.append('packeoption1kg', packeoption1kg ? 'Available' : 'Not Available');
    formData.append('packeoption500gm', packeoption500gm ? 'Available' : 'Not Available');
    formData.append('packeoption1kgrate', packeoption1kgrate);
    formData.append('packeoption500gmrate', packeoption500gmrate);
    formData.append('video', video);
    formData.append('recipe', recipe);
    formData.append('productNamealsoyoumaylike', productNamealsoyoumaylike);
    formData.append('link', link);
    formData.append('restriction', restriction);
    formData.append('type', type);
    formData.append('newLaunch', newLaunch); // Append newLaunch state
    formData.append('OurComOffer', OurComOffer); // Append OurComOffer state
    formData.append('stock', Number(stock));
    formData.append('rating', Number(rating));
    // formData.append('review', review);
    formData.append('oldPrice', oldPrice);
    formData.append('is_liquid', isLiquid);

    Object.keys(images).forEach((key) => {
      if (images[key]) {
        formData.append(key, images[key]);
      }
    });

    try {

      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response);

      alert('Product added successfully');
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error.message);
      alert('Failed to add product');
    }
    finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  const formStyle = {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    marginBottom: "400px"
  };

  const inputGroupStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px'
  };


  return (
    <form onSubmit={handleSubmit} style={form}>
      <h2 style={title}>Add Product</h2>

      <div style={grid}>
        <input
          type="text"
          placeholder="Product Name *"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={input}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={input}
          required
        >
          <option value="">Category *</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price ₹ *"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={input}
          required
        />

        <input
          type="number"
          placeholder="Stock *"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={input}
          required
        />

        <input
          type="number"
          placeholder="Old Price (optional)"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          style={input}
        />

        {/* <input
          type="number"
          placeholder="1kg Price"
          value={packeoption1kgrate}
          onChange={(e) => setPackeoption1kgrate(e.target.value)}
          style={input}
        />

        <input
          type="number"
          placeholder="500gm Price"
          value={packeoption500gmrate}
          onChange={(e) => setPackeoption500gmrate(e.target.value)}
          style={input}
        /> */}
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={textarea}
      />

      {/* checkboxes */}
      <div style={checkRow}>
        <label><input type="checkbox" checked={newLaunch} onChange={(e) => setNewLaunch(e.target.checked)} /> New</label>
        <label><input type="checkbox" checked={OurComOffer} onChange={(e) => setOurComOffer(e.target.checked)} /> Offer</label>
        <label><input type="checkbox" checked={isLiquid} onChange={(e) => setIsLiquid(e.target.checked)} /> Liquid</label>
      </div>

      <div style={checkRow}>
        <label>
          <input
            type="checkbox"
            style={{ marginRight: '6px' }}
            checked={packeoption1kg}
            onChange={(e) => setPackeoption1kg(e.target.checked)}
          />
          {
            isLiquid ? "1L Pack Available" : "1kg Pack Available"
          }
        </label>

        <label>
          <input
            type="checkbox"

            style={{ marginRight: '6px' }}
            checked={packeoption500gm}
            onChange={(e) => setPackeoption500gm(e.target.checked)}
          />
          {isLiquid ? "500ml Pack Available" : "500gm Pack Available"
          }
        </label>
      </div>

      <div style={grid}>
        {packeoption1kg && (
          <input
            type="number"
            placeholder={isLiquid ? "1L Price *" : "1kg Price *"}

            value={packeoption1kgrate}
            onChange={(e) => setPackeoption1kgrate(e.target.value)}
            style={input}
            required
          />
        )}

        {packeoption500gm && (
          <input
            type="number"
            placeholder={isLiquid ? "500ml Price *" : "500gm Price *"}
            value={packeoption500gmrate}
            onChange={(e) => setPackeoption500gmrate(e.target.value)}
            style={input}
            required
          />
        )}
      </div>

      <div style={grid}>
        <input
          type="text"
          placeholder="Nickname 1 (optional)"
          value={nickname1}
          onChange={(e) => setNickname1(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Nickname 2 (optional)"
          value={nickname2}
          onChange={(e) => setNickname2(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Nickname 3 (optional)"
          value={nickname3}
          onChange={(e) => setNickname3(e.target.value)}
          style={input}
        />
      </div>

      <div style={grid}>
        <input
          type="text"
          placeholder="Video URL"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Recipe URL"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          style={input}
        />

        <input
          type="number"
          placeholder="Rating (0-5)"
          min={1}
          max={5}
          step="0.1"
          value={rating}
          onChange={(e) => {
            let value = e.target.value;

            if (value === "") {
              setRating("");
              return;
            }

            value = Number(value);

            if (value >= 1 && value <= 5) {
              setRating(value);
            }
          }}
          style={input}
        />

        {/*

        
        <input
          type="text"
          placeholder="Review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={input}
        />
        */}
      </div>



      {/* images */}
      <div style={grid}>
        {["image1", "image2", "image3", "image4", "image5"].map((img) => (
          <input key={img} type="file" name={img} ref={(el) => (fileInputRefs.current[img] = el)} onChange={handleImageChange} style={input} />
        ))}
      </div>

      <button type="submit" style={btn} disabled={loading}>
        {loading ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;

const form = {
  maxWidth: "900px",
  margin: "30px auto",
  padding: "20px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(56, 168, 65, 0.69)",
};

const title = {
  marginBottom: "20px",
  textAlign: "center",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  marginBottom: "12px",
};

const input = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
};

const textarea = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  marginBottom: "12px",
};

const checkRow = {
  display: "flex",
  gap: "20px",
  marginBottom: "15px",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#248619",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};