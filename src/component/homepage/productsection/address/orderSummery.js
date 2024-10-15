import React, { useContext, useRef, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { X, CircleArrowLeft, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../cart/cartContext';
import { AddressContext } from './addressContext';
import CheckoutProcess from '../payment/orderCheckout';

const OrderSummary = () => {
    const { cartItems, updateCartItemQuantity, count } = useContext(CartContext);
    const { selectedAddress } = useContext(AddressContext);
    const [loadingItems, setLoadingItems] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState();

    const calculateSubtotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const subtotal = calculateSubtotal();
    const deliveryCharge = subtotal >= 499 ? 0 : 39;
    const total = subtotal + deliveryCharge;

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
        <div className="container">
            <div>
                <button className="btn btn-outline-danger" style={{ position: 'absolute', marginTop: '30px', marginLeft: '150px' }} onClick={() => { navigate(-1) }}>
                    <CircleArrowLeft size={20} />
                </button>
            </div>
            <div className="row justify-content-center">


                <div className="col-md-6">
                    <div className="card border-2 shadow-0 mt-5">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title">Order Summary ({count} items)</h5>
                            </div>

                            {cartItems.length === 0 ? (
                                <>
                                    <div className="d-flex justify-content-center mt-5">
                                        <img
                                            src="https://i.pinimg.com/564x/88/37/1a/88371a17882eb97143c906a2e6dec2bd.jpg"
                                            alt="Empty Cart"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <p className="text-center mt-5">Your cart awaits your next meal</p>
                                    <div className="d-flex justify-content-center">
                                        <Link to='/'>
                                            <button className="btn btn-danger">Continue Shopping</button>
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
                                                                disabled={loadingItems[`${item.productId}-minus`]}
                                                            >
                                                                {loadingItems[`${item.productId}-minus`] ? (
                                                                    <span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
                                                                ) : (
                                                                    <Minus size={16} />
                                                                )}
                                                            </button>
                                                            <span className="mx-2">{item.quantity}</span>
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => handleQuantityChange(item, 1)}
                                                                disabled={loadingItems[`${item.productId}-plus`]}
                                                            >
                                                                {loadingItems[`${item.productId}-plus`] ? (
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


                                    {/* Bill Details */}
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

                                    <div className=''>
                                        <h5>Selected Address</h5>
                                        {selectedAddress ? (
                                            <div className="address-item">
                                                <p>{selectedAddress.flatNo}, {selectedAddress.landmark}, {selectedAddress.city}</p>
                                                <p>Mobile: {selectedAddress.mobileNumber}</p>
                                            </div>
                                        ) : (
                                            <p>No address selected</p>
                                        )}
                                    </div>



                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="h5 mb-0">Total : ₹{total.toFixed(2)}</span>
                                        <CheckoutProcess
                                            total={total}
                                            onSuccess={() => {
                                            }}
                                            onError={(error) => {
                                                setError(error.message || 'An error occurred during checkout');
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="progress-container mt-4">
                        <div className="progress">
                            <div
                                className="progress-bar bg-danger"
                                role="progressbar"
                                style={{ width: '66%' }}
                                aria-valuenow="33"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                        <div className="progress-labels d-flex justify-content-between mt-2">
                            <span className="text-muted">Choose Address</span>
                            <span className="text-danger font-weight-bold">Delivery Summary</span>
                            <span className="text-muted">Payment Methods</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
