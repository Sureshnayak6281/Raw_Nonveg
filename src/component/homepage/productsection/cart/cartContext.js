import React, { createContext, useState, useCallback, useEffect } from 'react';
import config from '../../../../config';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/cartGet`, {
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const cartItemsArray = Object.values(response.data.items || {});
        setCartItems(cartItemsArray);
        const totalQuantity = cartItemsArray.reduce((sum, item) => sum + item.quantity, 0);
        setCount(totalQuantity);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCount(0);
  }, []);
  

  const updateCartItemQuantity = useCallback(async (itemId, quantity) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User not logged in');
      return { success: false, error: 'User not logged in' };
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${config.API_URL}/update-cart-item`, {
        userId,
        productId: itemId,
        quantity,
      });

      if (response.status === 200) {
        await fetchCart();
        return { success: true };
      } else {
        throw new Error('Failed to update cart item quantity');
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  const addToCart = useCallback(async (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      return updateCartItemQuantity(existingItem._id, existingItem.quantity + 1);
    } else {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User not logged in');
        return { success: false, error: 'User not logged in' };
      }

      try {
        setIsLoading(true);
        const response = await axios.post(`${config.API_URL}/add-to-cart`, {
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        });

        if (response.status === 200) {
          await fetchCart();
          return { success: true };
        } else {
          throw new Error('Failed to add item to cart');
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    }
  }, [cartItems, fetchCart, updateCartItemQuantity]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        count,
        clearCart,
        isLoading,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
