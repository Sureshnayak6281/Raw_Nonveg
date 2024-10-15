import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SelectByCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-1">Shop by categories</h2>
      <p className="text-muted mb-4">Freshest meats and much more!</p>
      <div className="row">
        {categories.map((category) => (
          <div key={category._id} className="col-md-3 col-sm-6 col-6 mb-4">
            <Link to={`/category/${category._id}`} className="text-decoration-none">
              <div className="text-center">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="img-fluid rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid #cc3300' }}
                />
                <h5 className="mb-1">{category.name}</h5>
                {/* <p className="text-muted small">{category.description}</p> */}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectByCategory;