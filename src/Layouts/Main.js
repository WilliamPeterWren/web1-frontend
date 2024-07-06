import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Layouts/Home'; // Adjust the path if needed
import Collections from '../pages/home/Collections'; // Ensure the path is correct
import ProductPage from '../pages/products/ProductPage';
import ShoppingCart from './../pages/cart/ShoppingCart';
import Wishlist from './../pages/wishlist/Wishlist';
import Checkout from '../pages/cart/Checkout';
import ProductDetail from './../pages/products/ProductDetail';
import Error from '../pages/err/Error';
import Search from '../pages/products/Search';
import TinTuc from '../pages/anyelse/TinTuc';
import LienHe from '../pages/anyelse/LienHe';
import PhanHoi from '../pages/anyelse/PhanHoi';
import ThongTin from '../pages/anyelse/ThongTin';

const Main = () => (
  <main>
    <Routes>

      <Route path="*" element={<Error />} />
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/products/categories/:catid" element={<ProductPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/shopping-cart" element={<ShoppingCart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/product-detail/:productId" element={<ProductDetail />} />
      <Route path="/search/:name" element={<Search />} />


      <Route path="/tin-tuc" element={<TinTuc />} />
      <Route path="/lien-he" element={<LienHe />} />
      <Route path="/phan-hoi" element={<PhanHoi />} />
      <Route path="/thong-tin" element={<ThongTin />} />





    </Routes>
  </main>
);

export default Main;
