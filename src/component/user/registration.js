import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './registration.css';
import config from '../../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'

export default function Registration() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Handles form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents page refresh

        try {
            // Send the POST request to register the user
            const response = await axios.post(`${config.API_URL}/register`, {
                email,
                password
            });

            // Log the response or handle success
            console.log('Successfully registered:', response.data);

            // Clear the form
            setEmail('');
            setPassword('');

            navigate('/verify');

            // onRegistrationSuccess();
        } catch (error) {
            // Handle error
            console.error('Something went wrong during registration:', error);
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card login-card" style={{ maxWidth: '900px' }}>
                <div className="row no-gutters">
                    <div className="col-md-6">
                        <img
                            src="https://i.pinimg.com/564x/78/c9/21/78c921112e3bd2515e8635e1874ab84a.jpg"
                            alt="Register"
                            className="img-fluid h-100 w-100 object-fit-cover"
                            style={{ objectPosition: 'center' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Register</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-danger btn-block">
                                    Register
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
                                    {/* <a href="#" className="text-muted">Forgot Password</a> */}
                                </div>
                            </form>
                            <p className="mt-3 text-center">
                                Not a member? <Link to ="/login">Log In</Link>
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
