import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import Login from '../auth/Login';

import apiShoppingCart from '../../api/apiShoppingCart';
import apiUser from '../../api/apiUser';
import apiOrder from '../../api/apiOrder';

import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
// import { Button } from 'bootstrap';

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user_data);

    // console.log("yes")

    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [cartList, setCartList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    const username = Cookies.get('username');

   
    useEffect(() => {
        if (user && user !== 'guest') {
            if (user.id !== userId) {
                getAuth(localStorage.getItem('token'));
            }
        }

        if (user === 'guest' && userId !== '' ) {
            getGuestShoppingCartList(localStorage.getItem('cartList'));
            
        }
    }, [user, userId]);

    const getAuth = (token) => {
        setLoading(true);
        apiUser.getAuth({
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        })
        .then(result => {
            setUserId(result.data.id);
            if (localStorage.getItem('cartList')) {
                // saveToShopppingCart(localStorage.getItem('cartList'));
            } else {
                getShoppingCartList(result.data.id);
            }
        }).catch(error => {
            console.log(error);
            if (localStorage.getItem('cartList') !== null) {
                getGuestShoppingCartList(localStorage.getItem('cartList'));
            }
        }).finally(() => setLoading(false));
    };

    const getShoppingCartList = async(userId) => {
        setLoading(true);
        const token = Cookies.get('token')

        await apiShoppingCart.getAll({            
            headers: {
                Authorization: `Bearer ${token}`
        }})
        .then(response => {
            let localCartList = localStorage.getItem('cartList') !== null ? localStorage.getItem('cartList') : null;
            console.log(response)
            setCartList(response.data);
            setLoading(false);
            updateCartCount(response.data.length);
            calcTotal(localCartList)
            // console.log(response)    

        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    };

    const getGuestShoppingCartList = (localCartList) => {
        setUserId('');
        setLoading(true);
        apiShoppingCart.getCartGuest({
            cartList: localCartList,
        })
        .then(response => {
            setCartList(response.data);
            setLoading(false);
            updateCartCount(response.data.length);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    };

    const handleChange = async(e) => {
        if (e.target.type === 'checkbox') {
            let list = selectedList;
            let id = parseInt(e.target.id);

            if (id === 0) {
                if (list.length === 0 || list.length < cartList.length) {
                    list = cartList.map(item => item.id);
                } else {
                    list = [];
                }
            } else if (selectedList.includes(id)) {
                list = list.filter(item => item !== id);
            } else {
                list = [...list, id];
            }

            setSelectedList(list);
            calcTotal(list);
         

        } else {
            let item = cartList.find(item => item.id === parseInt(e.target.id));
            let quantity = item.quantity;

            if (e.target.className === 'qty-up') {
                quantity += 1;
            } else if (e.target.className === 'qty-down') {
                quantity -= 1;
            } else if (e.target.type === 'number') {
                quantity = parseInt(e.target.value);
            }

            let updatedCartList = cartList.map(item => {
                if (item.id === parseInt(e.target.id)) {
                    if (quantity > 0) {
                        if (item.stock.quantity >= quantity) {
                            return { ...item, quantity: quantity };
                        } else {
                            return { ...item, quantity: item.stock.quantity };
                        }
                    } else {
                        return { ...item, quantity: 1 };
                    }
                }
                return item;
            });

            setCartList(updatedCartList);
            
            const data = {
                quantity: quantity
            }
            await apiShoppingCart.updateCartById(
                e.target.id, 
                data,
                {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    }
                }
            )
            .then(response => {
                if (response.status === 200) {
                    calcTotal(selectedList);                
     
                }
                // console.log(response)
            }).catch(error => {
                console.log(error);
            });


        }
    };

    const calcTotal = (list) => {
        let subtotal = 0;
        let shipping = 0;

        cartList.forEach(item => {            
            if (list.includes(item.id)) {
                subtotal += (item.stock.product.price * item.quantity);
            }
        });

        setSubTotal(subtotal);
        setTotal(subtotal + shipping);         
    };

    const handleDelete = (e) => {
        let id = parseInt(e.target.id);

        if (userId) {
          
            apiShoppingCart.deleteCartById(id, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            })
            .then(response => {
                if (response.status === 200) {
                    let list = selectedList.filter(item => item !== id);
                    setSelectedList(list);

                    calcTotal(list);
                  

                    if (localStorage.getItem('cartList')) {
                        let items = JSON.parse(localStorage.getItem('cartList'));
                        items = items.filter((item) =>
                            (item[0].stock_id !== response.data.stock_id && item[0].userId !== response.data.user_id)
                        );
                        localStorage.setItem('cartList', JSON.stringify(items));
                    }

                    getShoppingCartList(userId);
                    toast.error("Deleted successfully item!");
                  
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            let items = JSON.parse(localStorage.getItem('cartList'));
            items = items.filter((item, index) => index + 1 !== id);

            let selectedItems = selectedList.filter(item => item !== id);
            setSelectedList(selectedItems);

            localStorage.setItem('cartList', JSON.stringify(items));
            getGuestShoppingCartList(JSON.stringify(items));

            calcTotal(selectedItems);
     
        }
    };

    const handleCheckout = (e) => {
       
        const id = parseInt(e.target.id);
        let selectCheckout = [];

        if (id !== 0) {
            selectCheckout = [id];
        } else {
            selectCheckout = selectedList;
        }

        localStorage.setItem('selectedList', JSON.stringify(selectCheckout));
        localStorage.setItem('subtotal', subTotal)
        localStorage.setItem('total', total)
        // console.log(selectedList);
        navigate(`/checkout`)

    };

    const updateCartCount = (cartCount) => {
        dispatch({ type: 'CART_COUNT', value: cartCount });
    };

     useEffect(() => {

        if(localStorage.getItem('token') && username){
            // console.log("username")
            apiShoppingCart.getAll({
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
            })
            .then(response => {
                console.log(response.data)
                setCartList(response.data)
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
        }
        else{
            dispatch({ 
                type: 'LOGIN_CONTROL', 
                value: true, 
            });
        }

        
    }, []);


    return (
        <React.Fragment>
            {/* <!-- BREADCRUMB --> */}
            <div id="breadcrumb" className="section">
                {/* <!-- container --> */}
                <div className="container">
                    {/* <!-- row --> */}
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="breadcrumb-header">Shopping Cart</h3>
                            <ul className="breadcrumb-tree">
                                <li><Link to="/">Home</Link></li>
                                <li className="active">Shopping Cart</li>
                            </ul>
                        </div>
                    </div>
                    {/* <!-- /row --> */}
                </div>
                {/* <!-- /container --> */}
            </div>
            {/* <!-- /BREADCRUMB --> */}

            {/* <!-- SECTION --> */}
            <div className="section">
                {/* <!-- container --> */}
                <div className="container">
                    {/* <!-- row --> */}
                    <div className="row">
                        {/* <!-- Orders --> */}
                        <div className="col-md-7 cart-items">
                            <div className="section-title cart-item">
                                <h3 className="title">Shopping Cart {cartList.length > 0 && '(' + cartList.length + ')'}</h3>
                                <div className="checkbox-select-all">
                                    <div className="input-checkbox">
                                        <input
                                            name="selectAll"
                                            type="checkbox"
                                            id={0}
                                            checked={cartList.length > 0 && (selectedList.length === cartList.length)}
                                            onChange={handleChange} />
                                        <label htmlFor={0} className="px-4">
                                            <span></span>
                                            Select All
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {/* Cart Items */}
                            {loading ? <div className="spinner-container"><Spinner animation="border" /></div> :
                                cartList.map((item) => (
                                    
                                    <div key={item.id} className="cart-item">
                                        <div className="media cart-item-box">
                                            <div className="input-checkbox">
                                                <input type="checkbox"
                                                    id={item.id}
                                                    checked={selectedList.includes(item.id)}
                                                    onChange={handleChange} />
                                                <label htmlFor={item.id}>
                                                    <span></span>
                                                </label>
                                            </div>
                                            <img height="100" width="100" className="align-self-start mr-3" src={require(`../../assets/images/${JSON.parse(item.stock.product?.photo)[0]}`)} alt="img" />
                                            <div className="media-body cart-item-body">
                                                <h5 className="mt-0 product-name">
                                                    <Link to={`/detailproduct/${item.stock.product.id}`}>
                                                        {item.stock.product.name}
                                                    </Link>
                                                </h5>
                                                <div>
                                                    <div>
                                                        <strong>Size:</strong> {item.stock.size} <strong>Color:</strong> {item.stock.color}
                                                        <div className="buy-item">
                                                            <div className="qty-label">
                                                                Quantity
                                                                <div className="input-number">
                                                                    <input id={item.id} type="number" value={item.quantity} onChange={handleChange} />
                                                                    <span id={item.id} className="qty-up" onClick={handleChange}>+</span>
                                                                    <span id={item.id} className="qty-down" onClick={handleChange}>-</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div><sub><strong>Free Shipping</strong></sub></div>
                                                <h4 className="product-price">${item.stock.product.price}</h4>
                                            </div>
                                            <div className="delete-icon"><i id={item.id} onClick={handleDelete} className="fa fa-trash" aria-hidden="true"></i></div>
                                            <Link onClick={handleCheckout} to=''>
                                                <button id={item.id} className="item-checkout-btn">checkout</button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            {/* /Cart Items */}
                        </div>
                        {/* <!-- /Orders --> */}

                        {/* <!-- Order Summary --> */}
                        <div className="col-md-4 cart-details">
                            <div className="section-title text-center">
                                <h3 className="title">Order Summary</h3>
                            </div>
                            <div className="cart-summary">
                                <div className="order-col">
                                    <div>Subtotal</div>
                                    <div>${subTotal.toFixed(2)}</div>
                                </div>
                                <div className="order-col">
                                    <div>Shipping</div>
                                    <div><strong>FREE</strong></div>
                                </div>
                                <hr />
                                <div className="order-col">
                                    <div><strong>TOTAL</strong></div>
                                    <div>
                                        <strong className={selectedList.length !== 0 ? "order-total" : "order-total-disabled"}>
                                            ${total.toFixed(2)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <button id={0}
                                onClick={handleCheckout}
                                to=''
                                className={selectedList.length !== 0 ? "primary-btn order-submit" : "primary-btn order-submit-disabled"}
                            >
                                Checkout {selectedList.length !== 0 && '(' + selectedList.length + ')'}
                            </button>
                        </div>
                        {/* <!-- /Order Summary --> */}
                    </div>
                    {/* <!-- /row --> */}
                </div>
                {/* <!-- /container --> */}
            </div>
            {/* <!-- /SECTION --> */}
        </React.Fragment>
    );
};

export default ShoppingCart;
