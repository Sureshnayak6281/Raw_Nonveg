import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Registration from './component/user/registration';
import Verify from './component/user/verification';
import Login from './component/user/Login';
import Header from './component/homepage/header/header';
import HomePage from './component/homepage/Homepage';
import ProductItem from './component/homepage/productsection/productItem';
import ProductDetails from './component/homepage/productsection/productDetails';
import { ProductProvider } from './component/homepage/productsection/productContext';
import CartSidebar from './component/homepage/productsection/cart/cart';
import { CartProvider } from './component/homepage/productsection/cart/cartContext';
import {AuthProvider} from './component/user/authContext';
import CheckoutComponent from './component/homepage/productsection/payment/orderCheckout';
import AddressAutocomplete from './component/homepage/productsection/address/address';
import AddressSelection from './component/homepage/productsection/address/addressHomepage';
import{AddressProvider} from './component/homepage/productsection/address/addressContext';
import OrderSummary from './component/homepage/productsection/address/orderSummery';

const App = () => {
  const [isCartVisible, setIsCartVisible] = useState(false);

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <AuthProvider>
    <ProductProvider>
      <CartProvider>
        <AddressProvider>
      <BrowserRouter>
        <div style={{ position: 'relative' }}>
          <Header toggleCart={toggleCart} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:id" element={<ProductItem />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/CheckoutComponent" element={<CheckoutComponent/>}/>
            <Route path ="/AddressAutocomplete" element={<AddressAutocomplete/>}/>
            <Route path="/AddressSelection" element={<AddressSelection/>}/>
            <Route path='/orderSummary' element={<OrderSummary/>}/>
          </Routes>
          {isCartVisible && <CartSidebar toggleCart={toggleCart} />}
        </div>
      </BrowserRouter>
      </AddressProvider>
      </CartProvider>
    </ProductProvider>
    </AuthProvider>
  );
}

export default App;
