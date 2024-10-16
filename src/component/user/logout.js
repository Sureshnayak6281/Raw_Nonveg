import React from "react";
import axios from "axios";
import config from "../../config";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Logout() {
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${config.API_URL}/logout`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                console.log('Logout successful');
                window.location.href = '/login'; 
            } else {
                console.error('Logout failed suresh:', response.statusText);
            }
        } catch (error) {
            console.log('hii');
            console.error('Logout error:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            Logout
        </button>
    );
}
