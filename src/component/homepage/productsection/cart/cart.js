import React, { useContext, useRef, useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { X, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './cartContext';
import { AddressContext } from '../address/addressContext';
import CheckoutProcess from '../payment/orderCheckout';

const CartSidebar = ({ toggleCart }) => {
  const { cartItems, addToCart, updateCartItemQuantity, count } = useContext(CartContext);
  const { selectedAddress, setSelectedAddress, getAddress } = useContext(AddressContext);
  const sidebarRef = useRef(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleCart();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleCart]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        const response = await getAddress(userId);
        if (response.success) {
          const addresses = Object.values(response.addresses);
          setAddresses(addresses);

          if (!selectedAddress && addresses.length > 0) {
            setSelectedAddress(addresses[0]);
          }
        }
      }
    };

    fetchAddresses();
  }, [getAddress, userId, selectedAddress, setSelectedAddress]);

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const subtotal = calculateSubtotal();
  const deliveryCharge = subtotal >= 499 ? 0 : 39;
  const total = subtotal + deliveryCharge;
  const savings = cartItems.reduce((total, item) => total + (Math.round(item.price * 1.1) - item.price) * item.quantity, 0);

  const handleQuantityChange = async (item, change) => {
    const loadingKey = `${item.productId}-${change > 0 ? 'plus' : 'minus'}`;
    setLoadingItems(prev => ({ ...prev, [loadingKey]: true }));

    try {
      if (item.quantity + change <= 0) {
        await updateCartItemQuantity(item.productId, 0);
      } else {
        await updateCartItemQuantity(item.productId, change);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="cart-sidebar bg-light"
      style={{
        width: '400px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        right: 0,
        overflowY: 'auto',
        padding: '20px',
        zIndex: 1000,
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Order Summary ({count} items)</h4>
        <button onClick={toggleCart} className="btn btn-danger">
          <X size={24} />
        </button>
      </div>

      {cartItems.length === 0 ? (
        <>
          <div className="d-flex justify-content-center mt-5">
            <img src="https://i.pinimg.com/564x/88/37/1a/88371a17882eb97143c906a2e6dec2bd.jpg" alt="Cart image" />
          </div>
          <p className="text-center mt-5">Your cart awaits your next meal</p>
          <div className="d-flex justify-content-center">
            <Link to={'/'}>
              <button onClick={toggleCart} className="btn btn-danger">Continue Shopping</button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <ul className="list-unstyled">
            {cartItems.map((item) => {
              const loadingKeyMinus = `${item.productId}-minus`;
              const loadingKeyPlus = `${item.productId}-plus`;
              return (
                <li key={item.productId} className="mb-3 border-bottom pb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{item.name}</h6>
                      <small>{item.weight}</small>
                      <div>₹{item.price} <del className="text-muted">₹{Math.round(item.price * 1.1)}</del></div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQuantityChange(item, 0)}
                        disabled={loadingItems[loadingKeyMinus]}
                      >
                        {loadingItems[loadingKeyMinus] ? (
                          <span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={loadingItems[loadingKeyPlus]}
                      >
                        {loadingItems[loadingKeyPlus] ? (
                          <span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
                        ) : (
                          <Plus size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border rounded p-3 mb-4">
            <h5>Bill Details</h5>
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-success">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-danger">
              <strong>Total</strong>
              <strong>₹{total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="border rounded p-3 mb-4">
            <h5>Shipping Address</h5>
            {selectedAddress ? (
              <div className="address-item">
                <p>{selectedAddress.flatNo}, {selectedAddress.landmark}, {selectedAddress.city}</p>
              </div>
            ) : (
              <Link to='/AddressSelection'>
                <button className="btn btn-danger">+ Add Address</button>
              </Link>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">Total: ₹{total.toFixed(2)}</span>
            {selectedAddress ? (
              <CheckoutProcess
                total={total}
                onSuccess={() => {
                  toggleCart();
                }}
                onError={(error) => {
                  console.error("Checkout error:", error);
                }}
              />
            ) : (
              <button className="btn btn-danger" disabled>
                Proceed Payment
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
