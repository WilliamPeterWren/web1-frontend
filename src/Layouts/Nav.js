import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
    <nav id="navigation">
        <div className="container">
            <div id="responsive-nav">
                <ul className="main-nav nav nav-navbar">
                    <li><Link to="/home">Trang chủ</Link></li>
                    <li><Link to="/products">Sản phẩm</Link></li>
                    <li><Link to="/tin-tuc">Tin tức</Link></li>
                    <li><Link to="/lien-he">Liên hệ</Link></li>
                    <li><Link to="/phan-hoi">Phản hồi</Link></li>
                    <li><Link to="/thong-tin">Thông tin</Link></li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Nav;
