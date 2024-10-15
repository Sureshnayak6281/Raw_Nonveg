import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductContext } from './productContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import FoodPreloader from './preloader';
import {CartContext} from './cart/cartContext'

const ProductItem = () => {
  const { id } = useParams();
  const { productItems, fetchProductsByCategory } = useContext(ProductContext);
  const {addToCart} = useContext(CartContext);
  const [showPreloader, setShowPreloader] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const categoryId = id;
  const productId = '';

  useEffect(() => {
    console.log('useEffect running, categoryId:', categoryId);
    setShowPreloader(true);
    fetchProductsByCategory(categoryId, productId);

    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    console.log('Current productItems:', productItems);
  }, [productItems]);

  if (showPreloader) return <div><FoodPreloader /></div>;

  const handleAddToCart = async (item) => {
    console.log('Add to Cart clicked for item:', item);
    setLoadingItems(prev => ({ ...prev, [item._id]: true }));

    try {
      const result = await addToCart(item);
      if (result.success) {
        console.log('Item added to cart successfully');

      } else {
        console.error('Failed to add item to cart:', result.error);

      }
    } catch (error) {
      console.error('Error adding item to cart:', error);

    } finally {
      setLoadingItems(prev => ({ ...prev, [item._id]: false }));
    }
  };

  const handlemodalclick = (item) =>{
    const userId = localStorage.getItem('userId');
    if(userId){
      handleAddToCart(item)
    }
    else{
    setModal(true);
    }
  }

  return (
    <>
    <div className="container">
      <h2 className="text-center my-4">Chicken</h2>
      <div className="row">
        {productItems.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100">
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.imageUrl}
                  className="card-img-top"
                  alt={item.name}
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text">
                  <strong>Price:</strong> ₹{item.price} &nbsp;
                  <span className="badge bg-success">10% off</span>
                </p>
                <p className="card-text">
                  Gross Weight: <strong>{item.unit}</strong> &nbsp;
                  Net Weight: <strong>{item.unit}</strong>
                </p>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => handlemodalclick(item)}
                  disabled={loadingItems[item._id]}
                >
                  {loadingItems[item._id] ? (
                    <>
                      <span className="spinner-border spinner-border-sm text-dark me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div
    className={`modal fade ${modal ? 'show' : ''}`}
    tabIndex="-1"
    role="dialog"
    style={{ display: modal ? 'block' : 'none' }}
    aria-labelledby="loginModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="loginModalLabel">Login Required</h5>
          <button
            type="button"
            className="close"
            onClick={() => setModal(false)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>You need to log in to add items to the cart.</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setModal(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setModal(false);
              navigate('/login');            
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</>

  );
};

export default ProductItem;