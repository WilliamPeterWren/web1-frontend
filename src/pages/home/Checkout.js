import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Api } from './../api/Api';
import AddressCard from './../stripe/AddressCard';
import CheckoutForm from './../stripe/CheckoutForm';

const promise = loadStripe(process.env.MIX_STRIPE_KEY);

const Checkout = ({ user, addUser }) => {
	const [state, setState] = useState({
		presistAddress: true,
		firstName: '',
		lastName: '',
		email: '',
		address: '',
		city: '',
		country: '',
		zip: '',
		telephone: '',
		password: '',
		passwordConfirm: '',
		note: '',
		total: 0,
		redirect: false,
		checkoutList: [],
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('selectedList')) {
			if (localStorage.getItem('token')) {
				getShoppingCartList();
			} else {
				getGuestShoppingCartList(localStorage.getItem('cartList'));
			}
		} else {
			if (!localStorage.getItem('checkoutList')) {
				setState((prevState) => ({ ...prevState, redirect: true }));
			} else {
				const list = JSON.parse(localStorage.getItem('checkoutList'));
				setState((prevState) => ({ ...prevState, checkoutList: list }));
				calcTotal(list);
				if (localStorage.getItem('token') && !user) {
					getAuth(localStorage.getItem('token'));
				}
			}
		}
	}, []);

	useEffect(() => {
		if (user && user !== 'guest') {
			getUserDefaultAddress();
		}
	}, [user]);

	const getAuth = (token) => {
		axios.get(`${Api}/auth`, {
			headers: { Authorization: `Bearer ${token}` },
		}).then((result) => {
			addUser(result.data.user);
			if (result.data.user.address_id) getUserDefaultAddress();
		});
	};

	const getShoppingCartList = () => {
		axios.get(`${Api}/product/cart-list/`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		}).then((response) => {
			setState((prevState) => ({
				...prevState,
				checkoutList: [...response.data],
			}));
			generateCheckoutList();
			getUserDefaultAddress();
		}).catch((error) => {
			console.log(error);
		});
	};

	const getGuestShoppingCartList = (localCartList) => {
		axios.post(`${Api}/product/cart-list/guest`, {
			cartList: localCartList,
		}).then((response) => {
			setState((prevState) => ({
				...prevState,
				checkoutList: [...response.data],
			}));
			generateCheckoutList();
		});
	};

	const generateCheckoutList = () => {
		let { checkoutList } = state;
		let selectedList = JSON.parse(localStorage.getItem('selectedList'));

		if (localStorage.getItem('token')) {
			checkoutList = checkoutList.filter((item) => selectedList.includes(item.id));
		} else {
			checkoutList = checkoutList.filter((item, index) => selectedList.includes(index + 1));
		}

		localStorage.setItem('checkoutList', JSON.stringify(checkoutList));
		localStorage.removeItem('selectedList');

		setState((prevState) => ({ ...prevState, checkoutList: [...checkoutList] }));
		calcTotal(checkoutList);
	};

	const calcTotal = (list) => {
		let subtotal = 0;
		let shipping = 0;

		list.map((item) => {
			subtotal += item.stock.product.price * item.quantity;
		});

		setState((prevState) => ({
			...prevState,
			total: subtotal + shipping,
		}));
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setState((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		axios.post(`${Api}/user/create-user-address`, {
			firstName: state.firstName,
			lastName: state.lastName,
			email: state.email,
			address: state.address,
			city: state.city,
			country: state.country,
			zip: state.zip,
			telephone: state.telephone,
			password: state.password,
			passwordConfirm: state.passwordConfirm,
			localCartList: localStorage.getItem('cartList'),
		}).then((response) => {
			localStorage.setItem('token', response.data.token);
			addUser(response.data.user);
			setState((prevState) => ({ ...prevState, presistAddress: false }));
		});
	};

	const getUserDefaultAddress = () => {
		axios.get(`${Api}/user/default-address/`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		}).then((result) => {
			if (result.status === 200 && result.data) {
				setState((prevState) => ({
					...prevState,
					firstName: result.data.firstname,
					lastName: result.data.lastname,
					email: user.email,
					address: result.data.address,
					city: result.data.city,
					country: result.data.country,
					zip: result.data.zip,
					telephone: result.data.telephone,
					presistAddress: false,
				}));
			}
		});
	};

	const address = {
		presistAddress: state.presistAddress,
		firstName: state.firstName,
		lastName: state.lastName,
		email: state.email,
		address: state.address,
		city: state.city,
		country: state.country,
		zip: state.zip,
		telephone: state.telephone,
	};

	if (state.redirect) {
		navigate('/');
		return null;
	}

	return (
		<div className="section">
			<div className="container">
				<div className="row">
					<div className="col-md-7">
						{localStorage.getItem('token') && !state.presistAddress ? (
							<div className="section-title">
								<h3 className="title">Shipping address</h3>
								<AddressCard address={address} />
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								<div className="billing-details">
									<div className="section-title">
										<h3 className="title">Shipping address</h3>
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.firstName} type="text" name="firstName" placeholder="First Name" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.lastName} type="text" name="lastName" placeholder="Last Name" />
									</div>
									{!localStorage.getItem('token') && (
										<div className="form-group">
											<input className="input" onChange={handleChange} value={state.email} type="email" name="email" placeholder="Email" />
										</div>
									)}
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.address} type="text" name="address" placeholder="Address" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.city} type="text" name="city" placeholder="City" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.country} type="text" name="country" placeholder="Country" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.zip} type="text" name="zip" placeholder="ZIP Code" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.telephone} type="tel" name="telephone" placeholder="Telephone" />
									</div>
									{!localStorage.getItem('token') && (
										<React.Fragment>
											<div className="form-group">
												<div className="caption">
													<p>Enter the password for your new account.</p>
													<div className="form-group">
														<input className="input" onChange={handleChange} value={state.password} type="password" name="password" placeholder="Enter Your Password" />
													</div>
													<div className="form-group">
														<input className="input" onChange={handleChange} value={state.passwordConfirm} type="password" name="passwordConfirm" placeholder="Enter Your Password Again" />
													</div>
												</div>
											</div>
										</React.Fragment>
									)}
									<div className="form-group">
										<input className="input" onChange={handleChange} value={state.note} type="text" name="note" placeholder="Your Note Here" />
									</div>
									<div className="pull-right">
										<button type="submit" className="primary-btn order-submit">Save</button>
									</div>
								</div>
							</form>
						)}
					</div>
					<div className="col-md-5 order-details">
						<div className="section-title text-center">
							<h3 className="title">Your Order</h3>
						</div>
						<div className="order-summary">
							<div className="order-col">
								<div><strong>PRODUCT</strong></div>
								<div><strong>TOTAL</strong></div>
							</div>
							<div className="order-products">
								{state.checkoutList.map((item, index) => (
									<div key={index} className="order-col">
										<div>{item.stock.product.name} x {item.quantity}</div>
										<div>${item.stock.product.price * item.quantity}</div>
									</div>
								))}
							</div>
							<div className="order-col">
								<div>Shipping</div>
								<div><strong>FREE</strong></div>
							</div>
							<div className="order-col">
								<div><strong>TOTAL</strong></div>
								<div><strong className="order-total">${state.total}</strong></div>
							</div>
						</div>
						<div className="payment-method">
							<div className="input-radio">
								<input type="radio" name="payment" id="payment-1" />
								<label htmlFor="payment-1">
									<span></span>
									Direct Bank Transfer
								</label>
								<div className="caption">
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
								</div>
							</div>
							<div className="input-radio">
								<input type="radio" name="payment" id="payment-2" />
								<label htmlFor="payment-2">
									<span></span>
									Cheque Payment
								</label>
								<div className="caption">
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
								</div>
							</div>
							<div className="input-radio">
								<input type="radio" name="payment" id="payment-3" />
								<label htmlFor="payment-3">
									<span></span>
									Paypal System
								</label>
								<div className="caption">
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
								</div>
							</div>
						</div>
						<div className="input-checkbox">
							<input type="checkbox" id="terms" />
							<label htmlFor="terms">
								<span></span>
								I've read and accept the <a href="#">terms & conditions</a>
							</label>
						</div>
						<div className="primary-btn order-submit">
							<Elements stripe={promise}>
								<CheckoutForm total={state.total} />
							</Elements>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	addUser: (user) => dispatch({ type: 'ADD_USER', payload: user }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
