import React from 'react'
import { Link } from 'react-router-dom'

function ProductDetailRelated() {
  return (
    <div>
        <div className="section-title text-center">
            <h3 className="title">Related Products</h3>
        </div>
        <div className="row">
            <div className="col-md-3 col-xs-6">
            <div className="product">
                <div className="product-img">
                    <img src={require("../../assets/images/product01.png")} alt="" />
                <div className="product-label">
                    <span className="sale">-30%</span>
                </div>
                </div>
                <div className="product-body">
                <p className="product-category">Category</p>
                <h3 className="product-name">
                    <Link to ="/">product name goes here</Link>
                </h3>
                <h4 className="product-price">
                    $980.00{" "}
                    <del className="product-old-price">$990.00</del>
                </h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <div className="product-btns">
                    <button className="add-to-wishlist">
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
                <button className="add-to-cart-btn">
                    <i className="fa fa-shopping-cart"></i> add to cart
                </button>
                </div>
            </div>
            </div>
            <div className="col-md-3 col-xs-6">
            <div className="product">
                <div className="product-img">
                <img src={require("../../assets/images/product02.png")} alt="" />
                <div className="product-label">
                    <span className="sale">-30%</span>
                </div>
                </div>
                <div className="product-body">
                <p className="product-category">Category</p>
                <h3 className="product-name">
                    <Link to ="/">product name goes here</Link>
                </h3>
                <h4 className="product-price">
                    $980.00{" "}
                    <del className="product-old-price">$990.00</del>
                </h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <div className="product-btns">
                    <button className="add-to-wishlist">
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
                <button className="add-to-cart-btn">
                    <i className="fa fa-shopping-cart"></i> add to cart
                </button>
                </div>
            </div>
            </div>
            <div className="col-md-3 col-xs-6">
            <div className="product">
                <div className="product-img">
                <img src={require("../../assets/images/product03.png")} alt="" />
                <div className="product-label">
                    <span className="sale">-30%</span>
                </div>
                </div>
                <div className="product-body">
                <p className="product-category">Category</p>
                <h3 className="product-name">
                    <Link to ="/">product name goes here</Link>
                </h3>
                <h4 className="product-price">
                    $980.00{" "}
                    <del className="product-old-price">$990.00</del>
                </h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <div className="product-btns">
                    <button className="add-to-wishlist">
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
                <button className="add-to-cart-btn">
                    <i className="fa fa-shopping-cart"></i> add to cart
                </button>
                </div>
            </div>
            </div>
            <div className="col-md-3 col-xs-6">
            <div className="product">
                <div className="product-img">
                <img src={require("../../assets/images/product04.png")} alt="" />
                <div className="product-label">
                    <span className="sale">-30%</span>
                </div>
                </div>
                <div className="product-body">
                <p className="product-category">Category</p>
                <h3 className="product-name">
                    <Link to ="/">product name goes here</Link>
                </h3>
                <h4 className="product-price">
                    $980.00{" "}
                    <del className="product-old-price">$990.00</del>
                </h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <div className="product-btns">
                    <button className="add-to-wishlist">
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
                <button className="add-to-cart-btn">
                    <i className="fa fa-shopping-cart"></i> add to cart
                </button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDetailRelated
