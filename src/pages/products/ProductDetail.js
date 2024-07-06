import React, { useState, useEffect } from "react";

import ProductDetailLink from '../detail/ProductDetailLink';
import ProductDetailRelated from '../detail/ProductDetailRelated'
import ProductDetailContent from '../detail/ProductDetailContent'


import { useParams } from "react-router-dom";


import { useDispatch } from "react-redux";

import apiProduct from "../../api/apiProduct";
import apiWishlist from "../../api/apiWishlist";
function ProductDetail() {

  // const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  // const [cartLoading, setCartLoading] = useState(false);
  // const [cartButtonInit, setCartButtonInit] = useState(true);
  // const [productId, setProductId] = useState("");
  const [product, setProduct] = useState("");
  const [stocks, setStocks] = useState(0);
  // const [selectedSize, setSelectedSize] = useState("");
  // const [selectedColor, setSelectedColor] = useState("");
  // const [cartCount, setCartCount] = useState("");
  // const [quantity, setQuantity] = useState(1);
  // const [avaibleQuantity, setAvaibleQuantity] = useState("");
  const { productId: paramProductId } = useParams();
  // const [userId, setUserId] = useState('');
    // const [currentPage, setCurrentPage] = useState(1);
    // const [perPage, setPerPage] = useState(0);
    // const [wishlist, setWishlist] = useState([]);
    // const [lastPage, setLastPage] = useState(1);

  const dispatch = useDispatch();

  const showToast = (msg) => dispatch({ type: 'SHOW_TOAST', value: msg });
  const showQuickView = (id) => dispatch({ type: 'QUICKVIEW_CONTROL', value: id });
  const updateCart = (count) => dispatch({ type: 'CART_CONTROL', value: count });
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

  const getProduct = (id) => {
    setLoading(true);
    // console.log("Fetching product with ID:", id);
    apiProduct.getOne(id)
      .then((response) => {
        // console.log("API call successful:", response.data.stocks[0]);
        // setProductId(id);
        setProduct(response.data);
        setStocks(response.data.stocks[0].quantity);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("API call failed:", error);
      });
  };

  // const getWishlist = async (page) => {

  //     await apiWishlist.getWishListByPagination(
  //         page,{            
  //             headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }})
  //     .then(result => {
  //         // setCurrentPage(result.data.current_page);
  //         // setPerPage(result.data.per_page);
  //         // setWishlist(result.data.data);
  //         // setLastPage(result.data.last_page);
  //         // console.log(result.data);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  //   };

  // const handleMouseLeave = () => {
  //   // setCartButtonInit(true);
  // };

  const handleWishlist = (e) => {
        // console.log("Wishlist clicked")
        if (!localStorage.getItem('token')) {
          showLogin();
        } 
        else {       
            const data = {
                productId: product.id
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
                }
            })
            .catch(error => {
                console.log(error)
                showToast('Product is already in the wishlist!');
            });
        }
    };

  useEffect(() => {
    getProduct(paramProductId);
  }, [paramProductId]);

  return (
    <div>
      <ProductDetailLink product={product} />
      <ProductDetailContent product={product} />
      <ProductDetailRelated />
    </div>
  )
}

export default ProductDetail
