import React, { createContext, useState, useCallback } from 'react';
import config from '../../../../config';
import axios from "axios";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [address, setAddress] = useState('');
    const [flatNo, setFlatNo] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 17.3850, lng: 78.4867 });
    const [addressType, setAddressType] = useState('home');
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');


    const addAddress = useCallback(async (userId) => {
        try {
            const response = await axios.post(`${config.API_URL}/addAddress`, {
                userId,
                type: addressType,
                address,
                flatNo,
                landmark,
                city,
                mobileNumber,
                coordinates
            });

            if (response.data.success) {
                // Reset form fields after successful addition
                setAddress('');
                setFlatNo('');
                setLandmark('');
                setCity('');
                setMobileNumber('');
                setCoordinates({ lat: 17.3850, lng: 78.4867 });
                setAddressType('home');

                return response.data.addressId;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    }, [address, flatNo, landmark, city, mobileNumber, coordinates, addressType]);

   
    const getAddress = useCallback(async (userId) => {
        try {
            const response = await axios.post( `${config.API_URL}/getaddress`, { userId });

            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    }, []);

    return (
        <AddressContext.Provider value={{
            address, setAddress,
            flatNo, setFlatNo,
            landmark, setLandmark,
            city, setCity,
            mobileNumber, setMobileNumber,
            coordinates, setCoordinates,
            addressType, setAddressType,
            selectedAddress, setSelectedAddress,
            addAddress,
            getAddress,
            savedAddresses
        }}>
            {children}
        </AddressContext.Provider>
    );
};
