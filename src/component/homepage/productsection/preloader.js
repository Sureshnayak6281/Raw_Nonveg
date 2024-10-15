import React, { useState, useEffect } from 'react';

const FoodPreloader = () => {
  const [currentFood, setCurrentFood] = useState(0);
  const foods = ['chicken', 'fish', 'mutton', 'egg', 'crab', 'prawn'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFood((prev) => (prev + 1) % foods.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <div className="position-relative" style={{ width: '100px', height: '100px' }}>
        <div className="position-absolute inset-0 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" style={{ width: '100px', height: '100px' }} role="status">
          </div>
        </div>
        <div className="position-absolute inset-0 d-flex align-items-center justify-content-center" style={{ padding: '10px' }}>
          <img
            src="https://i.pinimg.com/564x/af/5b/7e/af5b7e28df0878067c2ad5dbe402cfa9.jpg"
            alt={foods[currentFood]}
            className="w-100 h-100 object-cover rounded-circle"
          />
        </div>
      </div>
    </div>
  );
};

export default FoodPreloader;