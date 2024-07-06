import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Slider from "react-slick";
import Modal from "react-bootstrap/Modal";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import apiShoppingCart from "../../api/apiShoppingCart";
import apiWishlist from "../../api/apiWishlist";

const ProductDetailContent = (props) => {
 

  const dispatch = useDispatch();

  const showToast = (msg) => dispatch({ type: 'SHOW_TOAST', value: msg });
  const updateCart = (count) => dispatch({ type: 'CART_CONTROL', value: count });
  const updateCartCount = (count) => dispatch({ type: 'CART_COUNT', value: count });
  const showLogin = () => dispatch({ type: 'LOGIN_CONTROL', value: true });
  const updateWishlistCount = (count) => dispatch({ type: 'WISHLIST_COUNT', value: count });

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  let photo = ""
  if (props.product?.photo){
    // console.log(JSON.parse(props.product?.photo))
    photo = JSON.parse(props.product?.photo)
    // console.log(photo)
  }

  const handleWishlist = (e) => {
        // console.log("Wishlist clicked")
        if (!localStorage.getItem('token')) {
          showLogin();
        } 
        else {       
            const data = {
                productId: props.product.id
            }
            console.log(data)

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
                    // toast.success('Added to wishlist!')
                    
                }
            })
            .catch(error => {
                console.log(error)
                showToast('Product is already in the wishlist!');
            });
        }
    };

    const handleAddToCart = (e) => {
      // console.log(e.target.id)
      if (localStorage.getItem('token')) {          
        apiShoppingCart.addToCart({
            stockId: e.target.id,
            quantity: 1
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
          if(response.status === 200) {
            // toast.success('Added to cart')
            showToast('Added to cart!');
            updateCartCount(response.data);
          } 
        })
      } 
    };

    const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab');
    return tabFromUrl || 'tab2';
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  return (
    <div>      
        <Modal.Body>
        <div className="section">
          <div className="container">
            <div className="row">

              <div className="col-md-6 col-md-push-2">
                <div id="product-main-img">
                  <div id="product-imgs">
                    {
                      photo.length > 1 ?
                      <Slider {...settings}>
                      {                     
                      photo.map((photo, index) => (
                        <div key={index} className="product-preview">                          
                          <img src={require(`../../assets/images/${photo}`)} alt={photo} style={{ maxHeight: '400px' }}/>
                        </div>
                      ))              
                      }
                      </Slider>
                      :
                      photo && <div className="product-preview">                          
                        <img src={require(`../../assets/images/${photo[0]}`)} alt={photo[0]} 
                          style={{ maxHeight: '400px' }}
                        />
                      </div>               
                    }
                    
                    
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <div className="product-details">
                  <h2 className="product-name">{props.product.name}</h2>
                  
                  <div>
                    <div className="product-rating">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star-o"></i>
                    </div>
                    <Link className="review-link" to="/">
                      10 Review(s) | Add your review
                    </Link>
                  </div>
                  
                  <div>
                    <h3 className="product-price">
                      ${props.product.price - props.product.price * 0.1}{" "}
                      <del className="product-old-price">${props.product.price}</del>
                    </h3>
                    <span className="product-available">In Stock: {props.product?.stocks?.[0].quantity} </span>
                  </div>
                  
                  <p>
                    {
                      props.product?.description
                    }
                  </p>

                  <div className="product-options">
                    <label>
                      Size &nbsp; &nbsp;
                      <select className="input-select">
                        <option value="0">X</option>
                      </select>
                    </label>
                    <label>
                      &nbsp; &nbsp; Color &nbsp; &nbsp;
                      <select className="input-select">
                        <option value="0">Red</option>
                      </select>
                    </label>
                  </div>

                  <div className="add-to-cart">
                    <div className="qty-label">
                      Quantity
                      <div className="input-number">
                        <input type="number" />
                        <span className="qty-up">+</span>
                        <span className="qty-down">-</span>
                      </div>
                    </div>
                    <button id={props.product.id} className="add-to-cart-btn" onClick={handleAddToCart} >
                      <i className="fa fa-shopping-cart"></i> add to cart
                    </button>
                  </div>

                  <ul className="product-btns">
                    <li>
                      <button id={props.product.id} onClick={handleWishlist} style={{ border: 'none', outline: 'none', background: 'none', textDecoration: 'underline'}}
                        
                      >
                        <i id={props.product.id} className ="fa fa-heart-o"></i>
                        <span className="tooltipp" >ADD TO WISHLIST</span>  
                      </button>
                          
                      
                    </li>
                    <li>
                      <Link to ="/">
                        <i className="fa fa-exchange"></i> add to compare
                      </Link>
                    </li>
                  </ul>

                  <ul className="product-links">
                    <li>Category: </li>
                    <li>
                      <Link to ={`/products/categories/${props.product?.category?.id}`}> {props.product?.category?.name} </Link>
                    </li>
                    <li>
                      <Link to ="/"> {props.product?.brand} </Link>
                    </li>
                  </ul>

                  <ul className="product-links">
                    <li>Share:</li>
                    <li>
                      <Link to ="/facebook.com/pykenhamster">
                        <i className="fa fa-facebook"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to ="/">
                        <i className="fa fa-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to ="/google.com">
                        <i className="fa fa-google-plus"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to ="/">
                        <i className="fa fa-envelope"></i>
                      </Link>
                    </li>
                  </ul>

                </div>
              </div>

              <div className="col-md-12">
                <div id="product-tab">
                  <ul className="tab-nav">
                    <li className={activeTab === 'tab1' ? 'active' : ''}>
                      <Link
                        to="?tab=tab1"
                        onClick={() => handleTabClick('tab1')}
                      >
                        Description
                      </Link>
                    </li>
                    <li className={activeTab === 'tab2' ? 'active' : ''}>
                      <Link
                        to="?tab=tab2"
                        onClick={() => handleTabClick('tab2')}
                      >
                        Details
                      </Link>
                    </li>
                    <li className={activeTab === 'tab3' ? 'active' : ''}>
                      <Link
                        to="?tab=tab3"
                        onClick={() => handleTabClick('tab3')}
                      >
                        Reviews (3)
                      </Link>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div id="tab1" className={`tab-pane ${activeTab === 'tab1' ? 'in active' : ''}`}>
                      <div className="row">
                        <div className="col-md-12">
                          <h2>
                            {props.product?.description}
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div id="tab2" className={`tab-pane ${activeTab === 'tab2' ? 'in active' : ''}`}>
                      <div className="row">
                        <div className="col-md-12">
                          <h2>
                            {props.product?.details}
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div id="tab3" className={`tab-pane ${activeTab === 'tab3' ? 'in active' : ''}`}>
                      <div className="row">
                        <div className="col-md-3">
                          <div id="rating">
                            <div className="rating-avg">
                              <span>4.5</span>
                              <div className="rating-stars">
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star-o"></i>
                              </div>
                            </div>
                            <ul className="rating">
                              <li>
                                <div className="rating-stars">
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                </div>
                                <div className="rating-progress">
                                  <div style={{ width: '80%' }}></div>
                                </div>
                                <span className="sum">3</span>
                              </li>
                              <li>
                                <div className="rating-stars">
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star-o"></i>
                                </div>
                                <div className="rating-progress">
                                  <div style={{ width: '60%' }}></div>
                                </div>
                                <span className="sum">2</span>
                              </li>
                              <li>
                                <div className="rating-stars">
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star-o"></i>
                                </div>
                                <div className="rating-progress">
                                  <div style={{ width: '60%' }}></div>
                                </div>
                                <span className="sum">2</span>
                              </li>
                              <li>
                                <div className="rating-stars">
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star-o"></i>
                                </div>
                                <div className="rating-progress">
                                  <div style={{ width: '60%' }}></div>
                                </div>
                                <span className="sum">2</span>
                              </li>
                              <li>
                                <div className="rating-stars">
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star-o"></i>
                                </div>
                                <div className="rating-progress">
                                  <div style={{ width: '60%' }}></div>
                                </div>
                                <span className="sum">2</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div id="reviews">
                            <ul className="reviews">
                              <li>
                                <div className="review-heading">
                                  <h5 className="name">John</h5>
                                  <p className="date">27 DEC 2018, 8:0 PM</p>
                                  <div className="review-rating">
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star-o empty"></i>
                                  </div>
                                </div>
                                <div className="review-body">
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="review-heading">
                                  <h5 className="name">John</h5>
                                  <p className="date">27 DEC 2018, 8:0 PM</p>
                                  <div className="review-rating">
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star-o empty"></i>
                                  </div>
                                </div>
                                <div className="review-body">
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua
                                  </p>
                                </div>
                              </li>
                              <li>
                                <div className="review-heading">
                                  <h5 className="name">John</h5>
                                  <p className="date">27 DEC 2018, 8:0 PM</p>
                                  <div className="review-rating">
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star-o empty"></i>
                                  </div>
                                </div>
                                <div className="review-body">
                                  <p>Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua</p>
                                </div>
                              </li>
                            </ul>
                            <ul className="reviews-pagination">
                              <li className="active">1</li>
                              <li>
                                <p to="/">2</p>
                              </li>
                              <li>
                                <p to="/">3</p>
                              </li>
                              <li>
                                <p to="/">4</p>
                              </li>
                              <li>
                                <p to="/">
                                  <i className="fa fa-angle-right"></i>
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div id="review-form">
                            <form className="review-form">
                              <input
                                className="input"
                                type="text"
                                placeholder="Your Name"
                              />
                              <input
                                className="input"
                                type="email"
                                placeholder="Your Email"
                              />
                              <textarea
                                className="input"
                                placeholder="Your Review"
                              ></textarea>
                              <div className="input-rating">
                                <span>Your Rating: </span>
                                <div className="stars">
                                  <input
                                    id="star5"
                                    name="rating"
                                    value="5"
                                    type="radio"
                                  />
                                  <label htmlFor="star5"></label>
                                  <input
                                    id="star4"
                                    name="rating"
                                    value="4"
                                    type="radio"
                                  />
                                  <label htmlFor="star4"></label>
                                  <input
                                    id="star3"
                                    name="rating"
                                    value="3"
                                    type="radio"
                                  />
                                  <label htmlFor="star3"></label>
                                  <input
                                    id="star2"
                                    name="rating"
                                    value="2"
                                    type="radio"
                                  />
                                  <label htmlFor="star2"></label>
                                  <input
                                    id="star1"
                                    name="rating"
                                    value="1"
                                    type="radio"
                                  />
                                  <label htmlFor="star1"></label>
                                </div>
                              </div>
                              <button className="primary-btn">Submit</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Modal.Body>
    </div>        
  );
};

export default ProductDetailContent;
