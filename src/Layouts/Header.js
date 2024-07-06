import React,{useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

import Authentification from '../pages/auth/Authentification';

import apiCategory from '../api/apiCategory';
import apiShoppingCart from '../api/apiShoppingCart';

import CartPreview from '../pages/home/CartPreview';
import apiWishlist from '../api/apiWishlist';

const Header = (props) => {
    const [categories, setCategories] = useState();
    const [wishlist, setWishlist] = useState();
    const [shoppingCart, setShoppingCart] = useState();
    const [shoppingCartCount, setShoppingCartCount] = useState();
    const [total, setTotal] = useState(0);
    const wishlist_count = useSelector(state => state.wishlist_count);
    const cart_count = useSelector(state => state.cart_count);
    // console.log(wishlist_count)
    // console.log(cart_count)
    const username = Cookies.get('username')

    const fetchCategories = async (page) => {
        try {
            await apiCategory.getCategoryPagination(page)
            .then((response) => {
                setCategories(response.data);
            })
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

   

    const fetchShoppingCart = async () => {

        if (username && localStorage.getItem('token')){
            // console.log(localStorage.getItem('token'))
           
            try {
                
                await apiShoppingCart.getAll({            
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                }})
                .then((response) => {
                    // console.log(response.data)
                    setShoppingCart(response.data)
                    setShoppingCartCount(response.data.length)
                
                    let subtotal = 0;
                    let shipping = 0;
                    response.data.map(item => {
                        subtotal += (item.stock?.product?.price * item.quantity);
                    });
                    setTotal(subtotal + shipping);
                    
                })
            } catch (error) {
                console.error('Error fetching shopping cart', error);
            }
        }

        
    };

    const fetchWishlist = async() => { 
        // const token = Cookies.get('token')
        // console.log(localStorage.getItem('token'))
        // console.log(username)
        if (username && localStorage.getItem('token')){            
            await apiWishlist.getAll({
                headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                // console.log(response.data.total)
                setWishlist(response.data.total)
            })
        }
        
    }

    useEffect(() => {
        if (localStorage.getItem('token') && username){
            fetchWishlist();
            fetchShoppingCart();
            // console.log("yes")
        }
        fetchCategories();      
    },[username]);

    const [showCartPreview, setShowCartPreview] = useState(false);

    const handleMouseOver = () => {
        // console.log("Mouse Over")
        setShowCartPreview(true);
    };

    const handleMouseLeave = () => {
        // console.log("Mouse Leave")
        setShowCartPreview(false);
    };

    const [category, setCategory] = useState('products');
    const [query, setQuery] = useState('');
    const navigate = useNavigate();


    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cat = category;

        navigate(`/search/${query}`);
    };

    return (
        <header>
            {/* <!-- TOP HEADER --> */}
            <div id="top-header">
                <div className="container">
                    <ul className="header-links">
                        <li><Link to="/"><i className="fa fa-phone"></i> +84-982 105 525</Link></li>
                        <li><Link to="/"><i className="fa fa-envelope-o"></i> info@txphong2010@gmail.com</Link></li>
                        <li><Link to="/"><i className="fa fa-map-marker"></i> 24A Nguyen Gia Thieu</Link></li>
                    </ul>
                    <ul className="header-links">
                        <li><Link to="/"><i className="fa fa-vnd"></i>VND</Link></li>
                        <Authentification />
                    </ul>
                </div>
            </div>
            {/* <!--/TOP HEADER -->*/}

            {/* <!-- MAIN HEADER --> */}
            <div id="header">
                <div className="container">
                    {/* <!-- row --> */}
                    <div className="row">
                        {/* <!-- LOGO --> */}
                        <div className="col-md-3">
                            <div className="header-logo">
                                <Link to="/" className="logo">
                                    <img 
                                    src={require("../assets/images/logo5.png")} 
                                    alt="logo" 
                                    style={{ maxWidth:'200px' }}
                                    />
                                </Link>
                            </div>
                        </div>
                        {/* <!--/LOGO -->*/}
                        {/*<!-- SEARCH BAR --> */}
                        <div className="col-md-6">
                            <div className="header-search">
                                <form onSubmit={handleSubmit}>
                                    <select className="input-select" onChange={handleCategoryChange}>
                                        <option value="0">Tất cả sản phẩm</option>
                                        {                                            
                                            categories && categories.map(item =>
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        }                                        
                                    </select>
                                    <input className="input" placeholder="Tìm kiếm tại đây" onChange={handleQueryChange} />
                                    <button className="search-btn">Search</button>
                                </form>
                            </div>
                        </div>
                        {/* <!--/SEARCH BAR -->*/}

                        {/*<!-- ACCOUNT --> */}
                        <div className="col-md-3" >
                            <div className="header-ctn">
                                {/* <!-- Wishlist --> */}
                                <div>
                                    <Link to="/wishlist">
                                        <i className="fa fa-heart-o"></i> <span>Yêu thích</span>
                                        {
                                            wishlist_count > 0 ? <div className="qty">
                                                {wishlist_count}  
                                            </div>
                                            :<div className="qty">
                                                {wishlist}  
                                            </div>
                                        }
                                        
                                    </Link>
                                </div>
                                {/* <!-- /Wishlist --> */}

                                {/* <!-- Cart --> */}
                                <div 
                                    className="dropdown" 
                                    onMouseOver={handleMouseOver} 
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link className="dropdown-toggle" to={'/shopping-cart'}>
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>Giỏ hàng</span>


                                        { 
                                            cart_count > 0 ? <div className="qty">
                                                {cart_count}
                                            </div>
                                            :
                                            <div className="qty">
                                                {shoppingCartCount}
                                            </div>
                                        }

                                        {showCartPreview && <CartPreview shoppingCart={shoppingCart} total={total} />}
                                    </Link>
                                </div>
                                {/* <!-- /Cart -->*/}

                                {/*<!-- Menu Toggle --> */}
                                <div className="menu-toggle">
                                    <Link to="/">
                                        <i className="fa fa-bars"></i>
                                        <span>Menu</span>
                                    </Link>
                                </div>
                                {/* <!--/Menu Toggle --> */}
                            </div>
                        </div>
                        {/* <!--/ACCOUNT --> */}
                    </div>
                    {/* <!-- row --> */}
                </div>
                {/* <!-- container --> */}
            </div>
            {/* <!--/MAIN HEADER --> */}
        </header>
    );
}

export default Header;
