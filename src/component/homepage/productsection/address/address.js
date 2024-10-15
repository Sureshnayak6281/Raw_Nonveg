import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { AddressContext } from './addressContext';

const libraries = ['places'];

const AddressForm = () => {
  const {
    address, setAddress,
    flatNo, setFlatNo,
    landmark, setLandmark,
    city, setCity,
    mobileNumber, setMobileNumber,
    coordinates, setCoordinates,
    addressType, setAddressType,
    addAddress
  } = useContext(AddressContext);

  const navigate = useNavigate();
  const addressInputRef = useRef(null);

  const [autocompleteService, setAutocompleteService] = useState(null);
  const [predictions, setPredictions] = useState([]);


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyD3SouQyQWOx0N8bPxc5J2_b0Acse5xyyY',
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, [isLoaded]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length > 0 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: value, componentRestrictions: { country: 'in' } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(predictions);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  }, [autocompleteService, setAddress]);

  const handleSelectPrediction = (prediction) => {
    setAddress(prediction.description);
    setPredictions([]);

    // You might want to get more details about the place here
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails({ placeId: prediction.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      await addAddress(userId);
      alert('Address added successfully!');
      navigate(-1);
    } catch (error) {
      alert('Failed to add address. Please try again.');
    }
  };

  const handleMapClick = (event) => {
    setCoordinates({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="overlay">
      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card bright-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Add New Address</h5>
                <button type="button" className="close" aria-label="Close" onClick={()=>{navigate(-1)}}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body p-0">
                  <div className="row no-gutters">
                    <div className="col-md-8">
                      <div style={{ height: '100%', minHeight: '400px' }}>
                        <GoogleMap
                          mapContainerStyle={{ height: '100%', width: '100%' }}
                          center={coordinates}
                          zoom={14}
                          onClick={handleMapClick}
                        >
                          <Marker position={coordinates} />
                        </GoogleMap>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3">
                        <div className="form-group">
                          <input
                            id="address-input"
                            ref={addressInputRef}
                            className="form-control outlined-input"
                            placeholder="Search for Area/Locality"
                            value={address}
                            onChange={handleInputChange}
                          />
                          {predictions.length > 0 && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                              {predictions.map((prediction) => (
                                <li
                                  key={prediction.place_id}
                                  className="list-group-item list-group-item-action"
                                  onClick={() => handleSelectPrediction(prediction)}
                                >
                                  {prediction.description}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="form-group">
                          <input
                            className="form-control outlined-input"
                            placeholder="Flat no / Building name / Street name"
                            value={flatNo}
                            onChange={(e) => setFlatNo(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            className="form-control outlined-input"
                            placeholder="Landmark"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            className="form-control outlined-input"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            className="form-control outlined-input"
                            placeholder="Mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Save As</label>
                          <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
                            <label className={`btn btn-outline-secondary ${addressType === 'home' ? 'active' : ''}`}>
                              <input
                                type="radio"
                                name="options"
                                value="home"
                                checked={addressType === 'home'}
                                onChange={() => setAddressType('home')}
                              /> Home
                            </label>
                            <label className={`btn btn-outline-secondary ${addressType === 'work' ? 'active' : ''}`}>
                              <input
                                type="radio"
                                name="options"
                                value="work"
                                checked={addressType === 'work'}
                                onChange={() => setAddressType('work')}
                              /> Work
                            </label>
                            <label className={`btn btn-outline-secondary ${addressType === 'other' ? 'active' : ''}`}>
                              <input
                                type="radio"
                                name="options"
                                value="other"
                                checked={addressType === 'other'}
                                onChange={() => setAddressType('other')}
                              /> Other
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Save & Proceed</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these styles to create the dimmed background and bright card
const styles = `
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .outlined-input {
    border: none;
    border-bottom: 1px solid #ced4da;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .outlined-input:focus {
    box-shadow: none;
    border-color: #80bdff;
  }

  .bright-card {
    background-color: white;
    border-radius: 0.25rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <AddressForm />
  </>
);
