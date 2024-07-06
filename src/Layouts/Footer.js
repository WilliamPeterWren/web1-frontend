import React,{useState, useEffect} from 'react';

import { Link } from 'react-router-dom';

import apiCategory from '../api/apiCategory';

function Footer() {
  const [category, setCategory] = useState();

  useEffect(() => {
    apiCategory.getAll().then(response => {
      setCategory(response.data);
      // console.log(response.data);
    });
  },[]);

  const HOME_URL = 'http://localhost:3000';

  return (
    <footer id="footer">
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Giới thiệu</h3>
              <p>William PT</p>
              <ul className="footer-links">
                <li><Link href="stst"><i className="fa fa-map-marker"></i> 24 Nguyen Gia Thieu</Link></li>
                <li><Link to="/"><i className="fa fa-phone"></i> +84-982105525</Link></li>
                <li><Link to="/"><i className="fa fa-envelope-o"></i>info@txphong2010@gmail.com</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Ngành hàng</h3>
              <ul className="footer-links">
                {
                  category?.map((item, key) => {
                    return <li key={key}><Link to={`/products/categories/${item.id}`}>{item.name}</Link></li>
                  })
                }
              </ul>
            </div>
          </div>


          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Liên hệ</h3>
              <ul className="footer-links">
                <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
                <li><Link to={`${HOME_URL}/lien-he`}>Liên hệ</Link></li>
                <li><Link to="/">Chính sách mua hàng</Link></li>
                <li><Link to="/">Mua hàng</Link></li>
                <li><Link to="/">Điều khoản dịch vụ</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Dịch vụ</h3>
              <ul className="footer-links">
                <li><Link to="/">Tài khoản</Link></li>
                <li><Link to="/shopping-cart">Giỏ hàng</Link></li>
                <li><Link to="/">Ưa thích</Link></li>
                <li><Link to="/">Theo dõi đơn hàng</Link></li>
                <li><Link to="/">Trợ giúp</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* /row */}
      </div>
      {/* /container */}
    </div>
    {/* /top footer */}

    <div id="bottom-footer" className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <ul className="footer-payments">
              <li><Link to="/"><i className="fa fa-cc-visa"></i></Link></li>
              <li><Link to="/"><i className="fa fa-credit-card"></i></Link></li>
              <li><Link to="/"><i className="fa fa-cc-paypal"></i></Link></li>
              <li><Link to="/"><i className="fa fa-cc-mastercard"></i></Link></li>
              <li><Link to="/"><i className="fa fa-cc-discover"></i></Link></li>
              <li><Link to="/"><i className="fa fa-cc-amex"></i></Link></li>
            </ul>
            <span className="copyright">
              Copyright &copy;
              <script>
                document.write(new Date().getFullYear());
              </script>
              All rights reserved | This template is made with <i className="fa fa-heart-o" aria-hidden="true"></i> by <Link href="https://colorlib.com" target="_blank">Colorlib</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
    {/* /bottom footer */}
  </footer>
  )
}

export default Footer

