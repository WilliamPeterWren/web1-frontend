import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
// import Pagination from 'react-bootstrap/Pagination';

import Cookies from 'js-cookie';

import apiWishlist from '../../api/apiWishlist';
import apiShoppingCart from '../../api/apiShoppingCart';
import apiProduct from '../../api/apiProduct';

const Wishlist = () => {
    const [userId, setUserId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const [lastPage, setLastPage] = useState(1);

    const username = Cookies.get('username');


    const showLogin = () => dispatch({ type: 'LOGIN_CONTROL', value: true });

    const showToast = (msg) => dispatch({ type: 'SHOW_TOAST', value: msg });

    const dispatch = useDispatch();

    const user = useSelector(state => state.user_data);

    useEffect(() => {
      if (localStorage.getItem('token')) {  
        getWishlist(currentPage);
      } else {
        dispatch({ type: 'LOGIN_CONTROL', value: true });
      }

    }, [currentPage]);

    useEffect(() => {
      if (user && user !== 'guest' && user.id !== userId) {
        setUserId(user.id);

      }
    }, [user, userId]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // console.log(currentPage)
    };

    const getWishlist = async (page) => {
      if(localStorage.getItem('token') && username){
        try{
          await apiWishlist.getWishListByPagination(
                    page,{            
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                }})
                .then(result => {
                    setCurrentPage(result.data.current_page);
                    setPerPage(result.data.per_page);
                    setWishlist(result.data.data);
                    setLastPage(result.data.last_page);
                    // console.log(result.data);
                })
                .catch(error => {
                  console.log(error);
                  throw error
                });
        }
        catch (error) {
          console.log(error);
          throw error;
        }
      }
      


    };

    const handleAddToCart = async(item) => {
      if (!localStorage.getItem('token')) {
              showLogin();
          } else {
            const productId = item.product.id;
            await apiProduct.getOne(productId)
            .then((response) => {
              console.log(response.data.stocks[0])
              const stock = response.data.stocks[0]
                 
              const data = {
                  stockId: stock.id,
                  quantity: 1
              }
              
              apiShoppingCart.addToCart(
                  data, 
                  {headers: { 
                      Authorization: `Bearer ${localStorage.getItem('token')}` 
              }})       
              .then(response => {
                  console.log(response)
                  showToast('Added to Shopping Cart!');

              })
              .catch(err => {
                  console.log(err)
              })
            })
          


              

          }
    };

    const handleDelete = (e) => {
      let id = e.target.id;
    
      apiWishlist.deleteWishListById(id, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          },
      })
      .then(response => {
        if (response.status === 200) {
          let page = currentPage;
          if (response.data % perPage === 0) {
            page = currentPage - 1;
          }
          getWishlist(page);
          dispatch({ type: 'WISHLIST_COUNT', value: response.data });
          dispatch({ type: 'CART_COUNT', value: response.data });
    
        
          // navigate("/wishlist")
          // window.location.reload();
        }
      });
    };

  return (
    <React.Fragment>
   
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3 className="breadcrumb-header">Wishlist</h3>
              <ul className="breadcrumb-tree">
                <li><Link to="/home">Home</Link></li>
                <li className="active">Wishlist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* SECTION */}
      <div className="section">
        <div className="container">
          <div className="row">
            <table id="wishlist">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}></th>
                  <th style={{ width: '25%' }}>Product Name</th>
                  <th style={{ width: '20%', textAlign: "center" }}>Price</th>
                  <th style={{ width: '20%', textAlign: "center" }}>Stock</th>
                  <th style={{ width: '20%' }}></th>
                  <th style={{ width: '10%' }}></th>
                </tr>
              </thead>
              <tbody>
                {
                !localStorage.getItem('token') ?
                    <tr>
                      <td colSpan="6">
                        <div className="spinner-container">
                          <Spinner animation="border" />
                        </div>
                      </td>
                      
                    </tr>    
                    && 
                    <tr>
                        <td colSpan="6" className='py-5'>
                         <h3>Please login to be able to add or view products in your wishlist!</h3>
                       </td>
                    </tr>
                  :
                    wishlist.map(item => (
                      <tr key={item.id}>
                        <td>                            
                          <img height="100" width="100" src={require(`../../assets/images/${JSON.parse(item.product.photo)[0]}`)} alt={JSON.parse(item.product.photo)[0]} />
                        </td>
                        <td>
                          <h2 className="product-name">
                            <Link to={`/detailproduct/${item.product.id}`}>
                              {item.product.name}
                            </Link>
                          </h2>
                        </td>
                        <td style={{ textAlign: "center" }}>${item.product.price}</td>
                        <td style={{ textAlign: "center" }}>{item.stock ? 'Available' : 'Not Available'}</td>
                        <td className="product-column">
                          <div className="add-to-cart">
                            <button id={item.product.id} className="add-to-cart-btn" onClick={(e) => handleAddToCart(item)}>
                              add to cart
                            </button>
                          </div>
                        </td>
                        <td>
                          <button className="delete-wishlist-icon" style = {{borderColor: '#ffffff'}} >
                            <i id={item.id} onClick={handleDelete} className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
            
              <div className="pagination">
                    {Array.from({ length: lastPage }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Wishlist;
