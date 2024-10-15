import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../../../../config';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../cart/cartContext';

const CheckoutProcess = ({ total, onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const loadRazorpay = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);

    const handleCheckout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${config.API_URL}/create-order`, {
                amount: total * 100
            }, {
                withCredentials: true
            });
            handlePayment(response.data);
        } catch (error) {
            setError('Failed to create order. Please try again.');
            console.error('Order creation error:', error);
            setIsLoading(false);
            onError && onError(error);
        }
    };

    const handlePayment = async (order) => {
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "NTR Cuts",
            description: "Purchase of items",
            order_id: order.id,
            handler: function (response) {
                verifyPayment(response, order);
            },
            prefill: {
                name: "Ntr Cuts",
                email: "sureshnayak6281@gmail.com",
                contact: "6281295182"
            },
            theme: {
                color: "#3399cc"
            },
            modal: {
                ondismiss: function() {
                    setIsLoading(false);
                    setError('Payment cancelled. Please try again.');
                }
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const verifyPayment = async (paymentResponse, order) => {
        try {
            const response = await axios.post(`${config.API_URL}/verify-payment`, {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                userId: userId,
                order: order
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                clearCart();
                onSuccess && onSuccess();
                navigate('/');
            } else {
                setError('Payment verification failed. Please try again.');
                onError && onError('Payment verification failed');
            }
        } catch (error) {
            setError('An error occurred during payment verification.');
            console.error('Payment verification error:', error);
            onError && onError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button 
                className="btn btn-danger"
                onClick={handleCheckout}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
            {error && <div className="text-danger mt-2">{error}</div>}
        </div>
    );
};

export default CheckoutProcess;