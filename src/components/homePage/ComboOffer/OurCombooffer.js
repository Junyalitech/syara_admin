import React, { useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';

const OurComboOffer = () => {
  const { products, comboOfferSelected, setComboOfferSelected, comboOfferDisplay, fetchComboOfferProducts } = useContext(ProductContext);

  const handleSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setComboOfferSelected(selectedOptions);
  };

  const handleSubmit = () => {
    fetchComboOfferProducts(comboOfferSelected);
  };

  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>Combo Offers</h2>
      <select
        multiple
        onChange={handleSelect}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
        }}
      >
        {products.map((product) => (
          <option key={product._id} value={product.slug}>
            {product.productName}
          </option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Show Selected Products
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '10px', textAlign: 'center' }}>Image</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Product Name</th>
          </tr>
        </thead>
        <tbody>
          {comboOfferDisplay.map((product) => (
            <tr key={product._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <img
                  src={`${process.env.REACT_APP_API_URL}/public/userImages/${product.image1}`}
                  alt={product.productName}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              </td>
              <td style={{ padding: '10px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }}>
                {product.productName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OurComboOffer;
