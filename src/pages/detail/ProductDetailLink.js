import React from 'react'
import { Link } from 'react-router-dom'

function ProductDetailLink(props) {

  return (
     <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <Link to ="/home">Home</Link>
                </li>
                <li>
                  <Link to ="/products">All Product</Link>
                </li>
                <li>
                  <Link to ="/">{props.product.category?.name}</Link>
                </li>
                <li>
                  <Link to ="/"> {props.product?.brand} </Link>
                </li>
                <li className="active"> {props.product?.name} </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProductDetailLink
