import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";

const CheckoutForm = (props) => {
    const [succeeded, setSucceeded] = useState(false);
    const [cardHolder, setCardHolder] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        window
            .fetch("http://localhost:8000/api/stripe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(props.items)
            })
            .then(res => res.json())
            .then(data => {
                setClientSecret(data.clientSecret);
            });


    }, [props.items]);

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Montserrat, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        },
        hidePostalCode: true
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: cardHolder
                }
            }
        });
        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            processOrder();
        }
    };

    const processOrder = () => {
        if (props.address.presistAddress) {
            axios.post('http://localhost:8000/api/user/address', {
                firstName: props.address.firstName,
                lastName: props.address.lastName,
                address: props.address.address,
                city: props.address.city,
                country: props.address.country,
                zip: props.address.zip,
                telephone: props.address.telephone,
                password: props.address.password,
                passwordConfirm: props.address.passwordConfirm
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        }

        axios.post('http://localhost:8000/api/product/orders', {
            items: props.items,
            note: props.note
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            cleanUp();
        });
    };

    const cleanUp = () => {
        let checkoutList = JSON.parse(localStorage.getItem('checkoutList'));
        let cartList = JSON.parse(localStorage.getItem('cartList'));

        checkoutList = checkoutList.map(item => item.stock_id);
        cartList = cartList.filter(item => !checkoutList.includes(item[0].stock_id));

        localStorage.setItem('checkoutList', '');
        localStorage.setItem('cartList', JSON.stringify(cartList));

        updateShoppingCartCount();
    };

    const updateShoppingCartCount = () => {
        axios.get('http://localhost:8000/api/product/cart-list/count', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(result => {
            let localCartList = JSON.parse(localStorage.getItem('cartList'));
            let stockList = localCartList.map(list => list[0].stock_id);

            let cartList = [...stockList, ...result.data];
            let uniqueCartList = [...new Set(cartList)];

            dispatch({ type: 'CART_COUNT', value: uniqueCartList.length });
        });
    };

    return (
        !succeeded ? (
            <React.Fragment>
                <div><strong>PAYMENT DETAILS</strong></div>
                <form id="payment-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className="input"
                            onChange={(e) => setCardHolder(e.target.value)}
                            value={cardHolder}
                            type="text"
                            name="cardHolder"
                            placeholder="Card Holder Name"
                        />
                    </div>

                    <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                    <div className="input-checkbox my-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                        />
                        <label htmlFor="terms">
                            <span></span>
                            I've read and accept the <Link to="/">terms & conditions</Link>
                        </label>
                    </div>
                    <button
                        className="primary-btn"
                        disabled={processing || disabled || succeeded || !checked}
                        id="submit"
                    >
                        <span id="button-text">
                            {processing ? (
                                <Spinner id="place-order-spinner" animation="border" />
                            ) : (
                                "Place Order"
                            )}
                        </span>
                    </button>
                    {error && (
                        <div className="card-error" role="alert">
                            {error}
                        </div>
                    )}
                </form>
            </React.Fragment>
        ) : (
            <div id="order-success">
                <i className="fa fa-check" aria-hidden="true"></i>
                <p><strong>PAYMENT SUCCESSFUL</strong></p>
            </div>
        )
    );
};

export default CheckoutForm;
