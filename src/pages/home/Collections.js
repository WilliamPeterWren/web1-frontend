import React from 'react';
import { Link } from 'react-router-dom';

const Collections = () => (
    <div className="section">
        <div className="container">
            <div className="row">
                <div className="col-md-4 col-xs-6">
                    <div className="shop">
                        <div className="shop-img">
                            <img src={require("../../assets/images/shop01.png")} alt="" />
                        </div>
                        <div className="shop-body">
                            <h3>Laptop<br /> </h3>
                            <Link to="/products/categories/1" className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-xs-6">
                    <div className="shop">
                        <div className="shop-img">
                            <img src={require("../../assets/images/shop03.png")} alt="" />
                        </div>
                        <div className="shop-body">
                            <h3>Phụ kiện<br /></h3>
                            <Link to="/products/categories/4" className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-xs-6">
                    <div className="shop">
                        <div className="shop-img">
                            <img 
                            src={require("../../assets/images/product10.png")} 
                            alt="phone" 
                            style={{ maxHeight:'280px', opjectFit: 'contain'}}
                            />
                        </div>
                        <div className="shop-body">
                            <h3>Điện thoại<br /> </h3>
                            <Link to="/products/categories/2" className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
export default Collections
