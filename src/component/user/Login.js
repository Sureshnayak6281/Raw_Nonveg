import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

import { CartContext } from '../homepage/productsection/cart/cartContext'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { fetchCart } = useContext(CartContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = `${config.API_URL}/login`;

        try {
            const response = await axios.post(url, {
                email,
                password,
            }, {
                withCredentials: true,
            });

            if (response.data.message === 'Logged in successfully') {
                login();
                localStorage.setItem('userId', response.data.userdata.userId);   
                fetchCart();
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data || 'An error occurred during login');
            } else if (error.request) {
                setError('No response received from server');
            } else {
                setError('Error setting up the request');
            }
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card login-card" style={{ maxWidth: '900px' }}>
                <div className="row no-gutters">
                    <div className="col-md-6">
                        <img
                            src="https://i.pinimg.com/564x/78/c9/21/78c921112e3bd2515e8635e1874ab84a.jpg"
                            alt="Login"
                            className="img-fluid h-100 w-100 object-fit-cover"
                            style={{ objectPosition: 'center' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">USERNAME</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-danger btn-block">
                                    Login
                                </button>
                                <div className="d-flex justify-content-between mt-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember Me
                                        </label>
                                    </div>
                                    <a href="#" className="text-muted">Forgot Password</a>
                                </div>
                            </form>
                            <p className="mt-3 text-center">
                                Not a member? <Link to="/registration">Register</Link>
                            </p>
                            <div className="text-center mt-3">
                                <a href="#" className="mr-2">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
