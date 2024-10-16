import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { User, Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../productsection/cart/cartContext';
import { AddressContext } from '../productsection/address/addressContext';
import { useAuth } from '../../user/authContext';
import config from '../../../config';
import axios from 'axios';

export default function Header({ toggleCart }) {
  const { isLoggedIn, user, logout, setIsLoggedIn } = useAuth();
  const { count, cartItems, fetchCart, clearCart, setCartItems } = useContext(CartContext);
  const { selectedAddress, setSelectedAddress, getAddress } = useContext(AddressContext);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  const checkLoginStatus = useCallback(() => {
    const userId = localStorage.getItem('userId');
    const loggedIn = !!userId;
    setIsLoggedIn(loggedIn);
    return loggedIn;
  }, []);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchCart();
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  useEffect(() => {
    const loadCartData = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    if (checkLoginStatus()) {
      loadCart();
    } else {
      loadCartData();
      setIsLoading(false);
    }
  }, [loadCart, setCartItems, checkLoginStatus]);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('addresses', JSON.stringify(addresses));
    }
  }, [addresses]);
  

  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = localStorage.getItem('userId');
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
  
    if (isLoggedIn) {
      fetchAddresses();  // Fetch addresses after login state is set
    }
  }, [isLoggedIn, getAddress, selectedAddress, setSelectedAddress]);
  

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/logout`, {}, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.removeItem('userId');
        localStorage.removeItem('cart');
        setIsLoggedIn(false);
        clearCart();
        setAddresses([]);
      setSelectedAddress(null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Something went wrong during logout:', error);
    }
  };

  return (
    <Navbar bg="danger" expand="lg" className="py-4" style={{ padding: '200px' }}>
      <Navbar.Brand href="/" className="font-weight-bold mr-4 py-2">
        Ntr Cuts
      </Navbar.Brand>

      <Form inline className="flex-grow-1 mr-2">
        <div className="input-group w-100">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-address" className="text-left d-flex align-items-center justify-content-between w-100">
              <span className="text-truncate">
                {selectedAddress ? `${selectedAddress.city}, ${selectedAddress.landmark}` : 'Select Location'}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/AddressSelection">Add New Address</Dropdown.Item>
            </Dropdown.Menu>

          </Dropdown >
          <FormControl
            type="text"
            placeholder="Search products"
            className="mr-2 flex-grow-1 w-50"
          />
          <div className="input-group-append">
            <Button variant="dark">Shop Now</Button>
          </div>
        </div>
      </Form>

      <Button variant="danger" className="mr-2 font-weight-bold">
        Our Stores
      </Button>

      <Nav>
        {isLoggedIn ? (
          <Dropdown alignRight>
            <Dropdown.Toggle as={Nav.Link} id="dropdown-user" className="d-inline-flex align-items-center">
              <User size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/account">Account</Dropdown.Item>
              <Dropdown.Item as={Link} to="/my-rewards">My Rewards</Dropdown.Item>
              <Dropdown.Item as={Link} to="/my-orders">My Orders</Dropdown.Item>
              <Dropdown.Item as={Link} to="/refer-friend">Refer a Friend</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Nav.Link as={Link} to="/registration">
            <User size={20} />
          </Nav.Link>
        )}

        <Nav.Link href="#wishlist">
          <Heart size={20} />
        </Nav.Link>

        <Nav.Link onClick={toggleCart} className="position-relative">
          <ShoppingCart size={20} />
          {!isLoading && count > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white">
              {count}
            </span>
          )}
        </Nav.Link>
      </Nav>

      <div style={{ display: 'none' }}>
        <p>Is Logged In: {isLoggedIn.toString()}</p>
        <p>Is Loading: {isLoading.toString()}</p>
        <p>Cart Count: {count}</p>
        <p>Cart Items: {JSON.stringify(cartItems)}</p>
      </div>
    </Navbar>
  );
}
