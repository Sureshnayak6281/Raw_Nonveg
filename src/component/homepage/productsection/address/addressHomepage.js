import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AddressContext } from './addressContext';

const AddressSelection = () => {
  const { getAddress, setSelectedAddress } = useContext(AddressContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        const response = await getAddress(userId);
        if (response.success) {
          const fetchedAddresses = Object.values(response.addresses);
          setAddresses(fetchedAddresses);

          if (fetchedAddresses.length > 0) {
            setSelectedAddressId(fetchedAddresses[0]._id);
          }
        }
      }
    };

    fetchAddresses();
  }, [getAddress, userId]);

  const handleSelectAndProceed = () => {
    if (selectedAddressId) {
      const selectedAddr = addresses.find((address) => address._id === selectedAddressId);
      setSelectedAddress(selectedAddr);
      navigate('/orderSummary');
    } else {
      alert('Please select an address before proceeding.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-2 shadow-0">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <MapPin size={48} color="#dc3545" />
              </div>

              {addresses.length > 0 ? (
                <>
                  <h5 className="card-title mb-4">Select an address</h5>
                  
                  <div className="mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`form-check p-3 mb-3 border rounded ${
                          selectedAddressId === address._id ? 'border-danger text-danger' : 'border-secondary'
                        }`}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="addressOptions"
                          id={address._id}
                          value={address._id}
                          checked={selectedAddressId === address._id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                        />
                        <label className="form-check-label ml-2" htmlFor={address._id}>
                          {address.flatNo}, {address.landmark}, {address.city}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <h5 className="card-title mb-4">No address saved</h5>
              )}

              <Link to='/AddressAutocomplete' className="text-decoration-none text-reset">
                <button className="btn btn-outline-danger btn-block mb-3">
                  Add new address
                </button>
              </Link>

              <button className="btn btn-danger btn-block" onClick={handleSelectAndProceed}>
                Select & Proceed
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container mt-4">
            <div className="progress">
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: '33%' }}
                aria-valuenow="33"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="progress-labels d-flex justify-content-between mt-2">
              <span className="text-danger font-weight-bold">Choose Address</span>
              <span className="text-muted">Delivery Summary</span>
              <span className="text-muted">Payment Methods</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
