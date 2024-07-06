import React, { Component } from 'react'
import axios from 'axios'
import Slider from 'react-slick'
// import { Api } from './../api/Api';

import apiProduct from '../../api/apiProduct'

class WidgetColumn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: []
        }
    }

    componentDidMount() {

        this.getProducts()
    }

    getProducts() {

        const query = 'top-selling'
        apiProduct.getNewestTopSelling(query)
        .then(( response ) => {
            this.setState({
                products: [...response.data]
            })
        }).catch(function (error) {
            console.log(error)
        })
    }

    render() {

        var settings = {
            infinite: true,
            autoplay: true,
            speed: 300,
            dots: true,
            arrows: false,
        }

        return (
            <div>
                <div className="section-title">
                    <h4 className="title">{this.props.title}</h4>
                    <div className="section-nav">
                        <div id="slick-nav-1" className="products-slick-nav"></div>
                    </div>
                </div>

                <div className="products-widget-slick" data-nav="#slick-nav-1" >
                    <Slider {...settings}>
                        <div>
                            {this.state.products.map((product, index) => (
                                <React.Fragment key={product.id}>
                                    {index < 3 &&
                                        <div className="product-widget">
                                            <div className="product-img">
                                                <img src={JSON.parse(product.photo)[0] && require(`../../assets/images/${JSON.parse(product.photo)[0]}`) ? require(`../../assets/images/${JSON.parse(product.photo)[0]}`) : require('../../assets/images/hotdeal.png')} alt={product.name} />
                                            </div>
                                            <div className="product-body">
                                                <p className="product-category">{product?.category?.name}</p>
                                                <h3 className="product-name"><a href="#">{product.name}</a></h3>
                                                {
                                                    (new Date(product.sale_expires).getTime() > new Date().getTime()) ?
                                                        <h4 className="product-price">${product.price - (product.price * product.sale)} <del className="product-old-price">${product.price}</del></h4>
                                                        :
                                                        <h4 className="product-price">${product.price}</h4>
                                                }
                                            </div>
                                        </div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <div>
                            {this.state.products.map((product, index) => (
                                <React.Fragment key={product.id}>
                                    {(index >= 3 && index < 6) &&
                                        <div className="product-widget">
                                            <div className="product-img">
                                                <img src={product.photo && require(`../../assets/images/${JSON.parse(product.photo)[0]}`) ? require(`../../assets/images/${JSON.parse(product.photo)[0]}`) : require('../../assets/images/hotdeal.png')} alt={product.name} />
                                            </div>
                                            <div className="product-body">
                                                <p className="product-category">{product?.category?.name || product?.category_name}</p>
                                                <h3 className="product-name"><a href="#">{product.name}</a></h3>
                                                {
                                                    (new Date(product.sale_expires).getTime() > new Date().getTime()) ?
                                                        <h4 className="product-price">${product.price - (product.price * product.sale)} <del className="product-old-price">${product.price}</del></h4>
                                                        :
                                                        <h4 className="product-price">${product.price}</h4>
                                                }
                                            </div>
                                        </div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </Slider>
                </div>
            </div>
        )
    }
}

class Widgets extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="section">
                {/* <!-- container --> */}
                <div className="container">
                    {/* <!-- row --> */}
                    <div className="row">

                        <div className="col-md-4 col-xs-6">
                            <WidgetColumn title="Top selling" />
                        </div>

                        <div className="col-md-4 col-xs-6">
                            <WidgetColumn title="Top selling" />
                        </div>

                        <div className="col-md-4 col-xs-6">
                            <WidgetColumn title="Top selling" />
                        </div>

                    </div>
                    {/* <!-- /row --> */}
                </div>
                {/* <!-- /container --> */}
            </div>
        )
    }
}

export default Widgets