import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';


import apiWishlist from '../../api/apiWishlist';
import apiShoppingCart from '../../api/apiShoppingCart';

function ProductItem({product}) {
    const dispatch = useDispatch();
    // const showQuickView = (id) => dispatch({ type: 'QUICKVIEW_CONTROL', value: id });
    const showLogin = () => dispatch({ type: 'LOGIN_CONTROL', value: true });
    const updateWishlistCount = (count) => dispatch({ type: 'WISHLIST_COUNT', value: count });
    const showToast = (msg) => dispatch({ type: 'SHOW_TOAST', value: msg });
    const updateCartCount = (count) => dispatch({ type: 'CART_COUNT', value: count });

    const handleWishlist = () => {
        // console.log("Wishlist clicked")
        // console.log(product)
        if (!localStorage.getItem('token')) {
        showLogin();
        } 
        else {       
            const data = {
                productId: product.id
            }

            apiWishlist.addToWishlist(
                data, 
                {headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
            }})       
            .then(response => {
                // console.log("response status: " + response.status)
                if (response.status === 200) {                
                    updateWishlistCount(response.data);
                    showToast('Added to wishlist!');
                }
            })
            .catch(error => {
                console.log(error)
                showToast('Product is already in the wishlist!');
            });
        }
    };

    const handleAddToCart = () => {
        //   console.log("e:",product)
        if (!localStorage.getItem('token')) {
            showLogin();
        } else {
            const stock_id = product.id    
            const data = {
                stockId: stock_id,
                quantity: 1
            }
            // console.log(data);
            apiShoppingCart.addToCart(
                data, 
                {headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
            }})       
           .then(response => {
                console.log(response)
                // showToast('Added to Shopping Cart!');
                toast.success('Added to Shopping Cart!');
                updateCartCount(response.data)
            })
            .catch(err => {
                console.log(err)
            })

        }
    };

  return (
    <div>
        <div className="product" style={{ marginBottom: "60px" }}>
            <div className="product-img">
                         
                <img src={require(`../../assets/images/${JSON.parse(product.photo)[0]}`)} alt={product.name} />
          
                
                
                <div className="product-label">
                    <span className="new">NEW</span>
                </div>
            </div>
            <div className="product-body">
                <p className="product-category">{product.category?.name}</p>
                <h3 className="product-name">
                    <Link to={`/product-detail/${product.id}`}>{product.name}</Link>
                </h3>
                <h4 className="product-price">${product.price}</h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <div className="product-btns">
                    <button className="add-to-wishlist" onClick={handleWishlist}>
                        <i className="fa fa-heart-o"></i>
                        <span className="tooltipp">add to wishlist</span>
                    </button>
                    <button className="add-to-compare">
                        <i className="fa fa-exchange"></i>
                        <span className="tooltipp">add to compare</span>
                    </button>
                    <button className="quick-view">
                        <i className="fa fa-eye"></i>
                        <span className="tooltipp">quick view</span>
                    </button>
                </div>
            </div>
            <div className="add-to-cart">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <i className="fa fa-shopping-cart"></i> add to cart
                </button>
            </div>
        </div>
    </div>
  )
}

export default ProductItem
