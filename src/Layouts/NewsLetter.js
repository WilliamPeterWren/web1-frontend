import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewsLetter = () => {
  const [value, setValue] = useState('');
  const [emailRes, setEmailRes] = useState([]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('api/newsletter', {
        value: value,
      });
      setEmailRes(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div>
      {/* <!-- NEWSLETTER --> */}
      <div id="newsletter" className="section">
        {/* <!-- container --> */}
        <div className="container">
          {/* <!-- row --> */}
          <div className="row">
            <div className="col-md-12">
              <div className="newsletter">
                <p>Sign Up for the <strong>NEWSLETTER</strong></p>
                <form onSubmit={handleSubmit}>
                  <input
                    className="input"
                    name="email"
                    type="email"
                    placeholder="Enter Your Email"
                    value={value}
                    onChange={handleChange}
                    required
                  />
                  <button className="newsletter-btn" type="submit">
                    <i className="fa fa-envelope"></i> Subscribe
                  </button>
                </form>
                <h5><b>{emailRes}</b></h5>
                <ul className="newsletter-follow">
                  <li>
                    <Link to="/"><i className="fa fa-facebook"></i></Link>
                  </li>
                  <li>
                    <Link to="/"><i className="fa fa-twitter"></i></Link>
                  </li>
                  <li>
                    <Link to="/"><i className="fa fa-instagram"></i></Link>
                  </li>
                  <li>
                    <Link to="/"><i className="fa fa-pinterest"></i></Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* <!-- /row --> */}
        </div>
        {/* <!-- /container --> */}
      </div>
      {/* <!-- /NEWSLETTER --> */}
    </div>
  );
};

export default NewsLetter;
