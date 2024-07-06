import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import Spinner from 'react-bootstrap/Spinner';
// import axios from 'axios';

import Cookies from 'js-cookie';

import apiUser from '../../api/apiUser';
import apiShoppingCart from '../../api/apiShoppingCart';

const CartPreview = (props) => {
    const [userId, setUserId] = useState('');
    // const [loading, setLoading] = useState(true);
    // const [total, setTotal] = useState(0);
    const [cartList, setCartList] = useState([]);
    const dispatch = useDispatch();

    const username = Cookies.get('username');

    const handleToggle = (isOpen) => {
        if (isOpen) {
            if (localStorage.getItem('token')) {
                getAuth(localStorage.getItem('token'));
            } else if (localStorage.getItem('cartList')) {
                getGuestShoppingCartList(localStorage.getItem('cartList'));
            }
        }
    };

    const getAuth = (token) => {
        // setLoading(true);

        apiUser.getAuth({
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        })
        .then(result => {
            // console.log(result.data.id)
            setUserId(result.data.id);
            if (localStorage.getItem('cartList')) {                
                saveToShoppingCart(localStorage.getItem('cartList'));
            } else {
                getShoppingCartList();
            }
        }).catch(error => {
            console.log(error);
            if (localStorage.getItem('cartList') !== null) {
                getGuestShoppingCartList(localStorage.getItem('cartList'));
            }
        });
    };

    const getShoppingCartList = () => {
     
        apiShoppingCart.getAll({
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then(response => {
            let localCartList = localStorage.getItem('cartList') !== null ? localStorage.getItem('cartList') : null;
            console.log(response)
            // setLoading(false);
            update();            
         
        })        
        .catch(error => {
            console.log(error);
        });
    };

    const getGuestShoppingCartList = (localCartList) => {
        setUserId('');
     
        apiShoppingCart.getCartGuest({
             cartList: localCartList,
        })
        .then(response => {
            setCartList(response.data);
            // setLoading(false);
            update();
        });
    };

    const saveToShoppingCart = (localCartList) => {
        
        // const data = {
        //      localCartList: localCartList
        //  }

        // apiShoppingCart.addToCart(data, {
        //      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // })
        // .then(() => {
        //     getShoppingCartList();
        // });
    };

    const handleDelete = (e) => {
        let id = parseInt(e.target.id);
        
           
        apiShoppingCart.deleteCartById(
            id, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
        )
        .then(response => {
            if (response.status === 200) {
                if (localStorage.getItem('cartList')) {
                    let items = JSON.parse(localStorage.getItem('cartList'));
                    items = items.filter(item =>
                        (item[0].stock_id !== response.data.stock_id && item[0].userId !== response.data.user_id)
                    );
                    localStorage.setItem('cartList', JSON.stringify(items));
                }
                getShoppingCartList();
            }
        })
        .catch(err => console.log(err));
       
    };

    const update = () => {       
        dispatch({ type: 'CART_COUNT', value: cartList.length });
    };

    useEffect(() => {
        if(localStorage.getItem('token') && username){
            apiShoppingCart.getAll({
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            })
            .then(response => {
                // console.log(response.data)
                setCartList(response.data)
            })
        }
        

    }, []);

  

    return (
        <Dropdown 
            onToggle={handleToggle}
            show={true}
            bsPrefix='dropdown-arrow'
            >
            <Dropdown.Toggle variant="toggle" id="dropdown-basic" onMouseOver={handleToggle} >                
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <div className="cart-dropdown">
                    <div className="cart-list">                        
                        <div>                            
                            { cartList && cartList?.map(item => (                               
                                <div key={item.id} className="product-widget">
                                    <div className="product-img">
                                        <img src={require(`../../assets/images/${JSON.parse(item.stock?.product?.photo)[0]}`)} alt="cartimage" />
                                    </div>
                                    <div className="product-body">
                                        <h3 className="product-name">
                                            <Link to={`/products/${item.stock.product.id}`}>
                                                {item.stock.product.name}
                                            </Link>
                                        </h3>
                                        <h4 className="product-price"><span className="qty">{item.quantity}x</span>${item.stock.product.price}</h4>
                                    </div>
                                    <button id={item.id} className="delete" onClick={handleDelete}><i id={item.id} className="fa fa-close"></i></button>
                                </div>
                            ))}
                        </div>
                            
                    </div>
                    <div className="cart-summary">
                        <small>{cartList?.length} Item(s) selected</small>
                        <h5>SUBTOTAL: ${props.total}</h5>
                    </div>
                    <div className="cart-btns">
                        <Link to="/shopping-cart">
                            View Cart
                        </Link>
                        <Link to="/checkout">
                            Checkout  <i className="fa fa-arrow-circle-right"></i>
                        </Link>
                    </div>
                </div>
            </Dropdown.Menu>
        </Dropdown>     
    );
};

export default CartPreview;
