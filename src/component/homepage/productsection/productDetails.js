import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { ProductContext } from './productContext';
import { CartContext } from './cart/cartContext';
import FoodPreloader from './preloader';

const ProductDetails = () => {
    const { id } = useParams();
    const { productItems, fetchProductsByCategory, loading} = useContext(ProductContext);
    const {addToCart} = useContext(CartContext);

    const [loadingItems, setLoadingItems] = useState({});
    const categoryId = '';
    const productId = id;

    useEffect(() => {
        fetchProductsByCategory(categoryId, productId);
    }, [id]);

    if (loading) return <div><FoodPreloader/></div>;

    const handleAddToCart = async (product) => {
        console.log('Add to Cart clicked for item:', product);
        setLoadingItems(prev => ({ ...prev, [product._id]: true }));
        
        try {
          const result = await addToCart(product);
          if (result.success) {
            console.log('Item added to cart successfully');
            // You can add a toast or notification here if you want
          } else {
            console.error('Failed to add item to cart:', result.error);
            // You can show an error message to the user here
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          // You can show an error message to the user here
        } finally {
          setLoadingItems(prev => ({ ...prev, [product._id]: false }));
        }
      };
    return (
        <div className="container mt-4">
            {productItems.map((product) => (
                <div key={product.id} className="row">
                    <div className="col-md-6">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="img-fluid rounded"
                        />
                    </div>
                    <div className="col-md-6">
                        <h2 className="my-1">{product.name}</h2>
                        <p className="text-muted">{product.description}</p>                   
                        <div className="d-flex my-3">
                            <span className="me-3">{product.weight}</span>
                            <span className="me-3">{product.pieces} Piece</span>
                            <span>{product.serves}</span>
                        </div>                     
                        <p>{product.fullDescription}</p>
                        <a href="#" className="text-danger text-decoration-none">Read more</a>                      
                        <div className="my-3">
                            <h4 className="mb-0">MRP: ₹{product.price}</h4>
                            <small className="text-muted">(incl. of all taxes)</small>
                        </div>
                        
                        <button className="btn btn-danger px-4 py-2" onClick={()=>{handleAddToCart(product)}} disabled={loadingItems[product._id]}>{loadingItems[product._id] ? (
                    <>
                      <span className="spinner-border spinner-border-sm text-dark me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    'Add+'
                  )}</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductDetails;
