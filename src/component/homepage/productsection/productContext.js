import React, { createContext, useState, useCallback } from 'react';
import config from '../../../config';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productItems, setProductItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  

  const fetchProductsByCategory = async (categoryId, productId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${config.API_URL}/productitem`, {
        categoryId: categoryId,
        productId: productId
      });
      setProductItems(response.data);
    } catch (error) {
      console.error('Error fetching product items:', error);
    }
    setLoading(false);
  };


  return (
    <ProductContext.Provider
      value={{
        productItems,
        fetchProductsByCategory,
        loading,
        cartItems,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};