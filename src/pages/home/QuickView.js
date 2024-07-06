import React, { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { connect } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import apiProduct from '../../api/apiProduct';
import apiShoppingCart from '../../api/apiShoppingCart';
import apiWishlist from '../../api/apiWishlist';

function QuickView(props) {

    const [userId, setUserId] = useState('')
    const [loading, setloading] = useState(true)
    const [cartLoading, setCartLoading] = useState(false)
    const [cartButtonInit, setCartButtonInit] = useState(true)
    const [productId, setProductId] = useState('')
    const [product, setProduct] = useState('')
    const [stocks, setStocks] = useState([])
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [cartCount, setCartCount] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [avaibleQuantity, setAvaibleQuantity] = useState('')
    const [settings] = useState({
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1
    })

    const navigate = useNavigate();

    const handleClose = () => {
        props.updateCartCount(cartCount)
        props.hideQuickView()
    }

    function getProduct(id) {
        setloading(true)
        
        apiProduct.getProductById(id)
        .then(( response) => {
            setProductId(id)
            setProduct(response.data)
            setStocks([...response.data.stocks])
            setloading(false)
        })
    }

    function handleClick() {

        setCartLoading(true)
        setCartButtonInit(false)

        let stock = stocks.filter(item => (item.size == selectedSize && item.color == selectedColor))
        stock = stock[0]

        if (localStorage.getItem('token')) {    
            apiShoppingCart.addToCart({
                stockId: stock.id,
                quantity: quantity
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(response => {
                setCartCount(response.data)
                setCartLoading(false)
                props.showToast('Added to Cart!');
            })
            .catch(err => { console.error(err);})
        } 
        else{
			props.showLogin();
		}
        // else {
        //     let cartItem = [
        //         {
        //             'stock_id': stock.id,
        //             'quantity': quantity
        //         }
        //     ]

        //     let items = []

        //     if (localStorage.getItem('cartList')) {
        //         items = JSON.parse(localStorage.getItem('cartList'))

        //         items.map(item => {
        //             if (item[0].stock_id == stock.id) {
        //                 if (avaibleQuantity > (item[0].quantity + quantity))
        //                     item[0].quantity += quantity
        //                 else
        //                     item[0].quantity = avaibleQuantity

        //                 cartItem = '';
        //             }
        //         })
        //     }

        //     if (cartItem)
        //         items.unshift(cartItem)

        //     setCartCount(items.length)
        //     localStorage.setItem('cartList', JSON.stringify(items))
        //     setCartLoading(false)
        // }

       
    }

    function handleChange(e) {

        const value = e.target.value

        if (e.target.className === 'input-select') {
            var found = false
            stocks.map((stock) => {
                if (stock.size == value && !found) {
                    setSelectedSize(value)
                    setAvaibleQuantity(stock.quantity)
                    found = true
                }
                if (stock.color == value) {
                    setSelectedColor(value)
                    setAvaibleQuantity(stock.quantity)
                }

            })
        }

        if (e.target.className === 'qty-up') {
            if (quantity < avaibleQuantity)
                setQuantity(parseInt(quantity) + 1)
        } else if (e.target.className === 'qty-down') {
            if (quantity > 1)
                setQuantity(parseInt(quantity) - 1)
        }

        if (e.target.type == 'number') {
            if (avaibleQuantity >= value)
                setQuantity(value)
            else if (value < 1)
                setQuantity(1)
        }
    }

    function handleMouseLeave() {
        setCartButtonInit(true)
    }

    function handleWishlist(e) {
        if (!localStorage.getItem('token')) {
            // this.props.showLogin();
            toast.error('Cần đăng nhập!');
        } else {
           
            apiWishlist.addToWishlist({
                    productId: e.target.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
            .then(response => {
                if (response.status === 200) {
                    props.updateWishlistCount(response.data);
                    props.showToast('Added to wishlist!');
                    toast.success('Đã thêm sản phẩm vào danh sách yêu thích!');
                }
            })
            .catch(error => {
                props.showToast('Product is already in the wishlist!');
                // toast.info('Sản phẩm đã có trong danh sách yêu thích!');

            });
        }
    }

    const handleViewMore = () => {
        props.updateCartCount(cartCount)
        props.hideQuickView()
        navigate(`/products/${props.productId}`)
    }

    useEffect(() => {

        if (props.productId > 0) {
            if (productId != props.productId) {
                setProduct('')
                setStocks([])
                setSelectedSize('')
                setSelectedColor('')
                setAvaibleQuantity('')
            }

            getProduct(props.productId)
        }


    }, [props.productId])


    return (
        <React.Fragment>
            <Modal size="lg" show={props.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {product && product.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? <div className="spinner-container"><Spinner animation="border" /></div> :
                        product && <React.Fragment>
                            <div>
                                <ToastContainer />
                                <div id="product-img-container" className="col-md-6">
                                    {/* <!-- Product thumb imgs --> */}
                                    <div id="product-imgs">
                                        <div className="product-preview">
                                            <img height="300" width="300" src={product.photo && require(`../../assets/images/${JSON.parse(product.photo)[0]}`) ? require(`../../assets/images/${JSON.parse(product.photo)[0]}`) : require('../../assets/images/hotdeal.png')} alt={product.name} />
                                        </div>
                                    </div>
                                    {/* <!-- /Product thumb imgs -->*/}
                                </div>
                                <div id="product-detail-container" className="col-md-6">
                                    {/*<!-- Product details -->*/}

                                    <div className="product-details">
                                        <h2 className="product-name">{product.name}</h2>
                                        <div>
                                            <div className="product-rating">
                                                <i className={product.review >= 1 ? "fa fa-star" : (product.review > 0 && product.review < 1) ? "fa fa-star-half-o" : "fa fa-star-o"}></i>
                                                <i className={product.review >= 2 ? "fa fa-star" : (product.review > 1 && product.review < 2) ? "fa fa-star-half-o" : "fa fa-star-o"}></i>
                                                <i className={product.review >= 3 ? "fa fa-star" : (product.review > 2 && product.review < 3) ? "fa fa-star-half-o" : "fa fa-star-o"}></i>
                                                <i className={product.review >= 4 ? "fa fa-star" : (product.review > 3 && product.review < 4) ? "fa fa-star-half-o" : "fa fa-star-o"}></i>
                                                <i className={product.review == 5 ? "fa fa-star" : (product.review > 4 && product.review < 5) ? "fa fa-star-half-o" : "fa fa-star-o"}></i>
                                            </div>
                                            <Link className="review-link" to="">{product.num_reviews} Review(s) | Add your review</Link>
                                        </div>
                                        <div>
                                            {
                                                (new Date(product.sale_expires).getTime() > new Date().getTime()) ?
                                                    <h3 className="product-price">${product.price - (product.price * product.sale)} <del className="product-old-price">${product.price}</del></h3>
                                                    :
                                                    <h3 className="product-price">${product.price}</h3>
                                            }
                                            <span className="product-available">{avaibleQuantity ? 'In' : 'Out of'} Stock</span>
                                        </div>
                                        <p>{product.description}</p>

                                        <div className="product-options" >
                                            <label>
                                                Size
                                                <select className="input-select" onChange={handleChange}>
                                                    {stocks.length && [...new Set(stocks.map(stock => stock.size))].map((stockSize, index) => (
                                                        <React.Fragment key={index}>
                                                            {(selectedSize == '' && index == 0) && setSelectedSize(stockSize)}
                                                            <option value={stockSize}>{stockSize}</option>
                                                        </React.Fragment>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Color
                                                <select className="input-select" onChange={handleChange}>
                                                    {stocks.length && stocks.map((stock, index) => (
                                                        <React.Fragment key={stock.id}>
                                                            {(selectedColor === '' && index == 0) && setSelectedColor(stock.color)}
                                                            {(avaibleQuantity === '' && index == 0) && setAvaibleQuantity(stock.quantity)}
                                                            {selectedSize === stock.size && <option value={stock.color}>{stock.color}</option>}
                                                        </React.Fragment>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>

                                        <div className="add-to-cart">
                                            <div className="qty-label">
                                                Qty
                                                <div className="input-number">
                                                    <input type="number" disabled={!avaibleQuantity} value={avaibleQuantity ? quantity : 0} onChange={handleChange} />
                                                    <span className="qty-up" onClick={handleChange} >+</span>
                                                    <span className="qty-down" onClick={handleChange} >-</span>
                                                </div>
                                            </div>
                                            <button className="add-to-cart-btn" onMouseLeave={handleMouseLeave} onClick={handleClick} disabled={!avaibleQuantity}>
                                                {cartButtonInit ?
                                                    <React.Fragment>
                                                        
                                                        <i className="fa fa-shopping-cart"></i>
                                                        <span>add to cart</span>
                                                    </React.Fragment>
                                                    :
                                                    cartLoading ?
                                                        <React.Fragment>
                                                            <i><Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            /></i>
                                                            <span>Adding...</span>
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            <i className="fa fa-check"></i>
                                                            <span>Added</span>
                                                        </React.Fragment>
                                                }
                                            </button>
                                            <br /><sub>{(avaibleQuantity ? 'Only ' : 'There are ')} {avaibleQuantity} item(s) available!</sub>
                                        </div>

                                        <ul className="product-btns">
                                            <li><Link id={product.id} onClick={handleWishlist} href="/"><i id={product.id} onClick={handleWishlist} className="fa fa-heart-o"></i> add to wishlist</Link></li>
                                            <li><Link href="/"><i className="fa fa-exchange"></i> add to compare</Link></li>
                                        </ul>

                                        <ul className="product-links">
                                            <li>Category:</li>
                                            <li><Link to="/">{product.category.name}</Link></li>
                                        </ul>

                                        <ul className="product-links">
                                            <li>Share:</li>
                                            <li><Link to="/"><i className="fa fa-facebook"></i></Link></li>
                                            <li><Link to="/"><i className="fa fa-twitter"></i></Link></li>
                                            <li><Link to="/"><i className="fa fa-google-plus"></i></Link></li>
                                            <li><Link to="/"><i className="fa fa-envelope"></i></Link></li>
                                        </ul>

                                    </div>
                                    {/* <!-- /Product details --> */}
                                </div>
                            </div>
                            <Link to={`product-detail/${props.productId}`} onClick={handleViewMore}>
                                <Button bsPrefix="qv">
                                    <span>View More</span>
                                </Button>
                            </Link>
                        </React.Fragment>}
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        productId: state.product_id,
        showModal: state.show_modal
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateCartCount: ((count) => dispatch({ type: 'CART_COUNT', value: count })),
        updateWishlistCount: ((count) => dispatch({ type: 'WISHLIST_COUNT', value: count })),
        showToast: ((msg) => dispatch({ type: 'SHOW_TOAST', value: msg })),   
        hideQuickView: (() => dispatch({ type: 'MODAL_CONTROL', value: false })),
        showLogin: (() => dispatch({ type: 'LOGIN_CONTROL', value: true })),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickView)