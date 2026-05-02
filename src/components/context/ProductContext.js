import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [newLaunchesSelected, setNewLaunchesSelected] = useState([]);
  const [comboOfferSelected, setComboOfferSelected] = useState([]);
  const [newLaunchesDisplay, setNewLaunchesDisplay] = useState([]);
  const [comboOfferDisplay, setComboOfferDisplay] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products/api`)
      .then(response => {
        setProducts(response.data.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const fetchNewLaunchesProducts = (slugs) => {
    axios.post(`${process.env.REACT_APP_API_URL}/products/slug`, { slugs })
      .then(response => {
        setNewLaunchesDisplay(response.data);
        localStorage.setItem('newLaunchesDisplay', JSON.stringify(response.data));
      })
      .catch(error => console.error('Error fetching new launches products:', error));
  };

  const fetchComboOfferProducts = (slugs) => {
    axios.post(`${process.env.REACT_APP_API_URL}/products/slug`, { slugs })
      .then(response => {
        setComboOfferDisplay(response.data);
        localStorage.setItem('comboOfferDisplay', JSON.stringify(response.data));
      })
      .catch(error => console.error('Error fetching combo offer products:', error));
  };

  useEffect(() => {
    const savedNewLaunchesDisplay = localStorage.getItem('newLaunchesDisplay');
    if (savedNewLaunchesDisplay) {
      setNewLaunchesDisplay(JSON.parse(savedNewLaunchesDisplay));
    }
    
    const savedComboOfferDisplay = localStorage.getItem('comboOfferDisplay');
    if (savedComboOfferDisplay) {
      setComboOfferDisplay(JSON.parse(savedComboOfferDisplay));
    }
  }, []);

  return (
    <ProductContext.Provider value={{
      products, 
      newLaunchesSelected, setNewLaunchesSelected, newLaunchesDisplay, fetchNewLaunchesProducts,
      comboOfferSelected, setComboOfferSelected, comboOfferDisplay, fetchComboOfferProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
