import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from './CheckoutForm';
import AddressCard from './AddressCard';

import Cookies from 'js-cookie';


import apiShoppingCart from '../../api/apiShoppingCart';
import apiUser from '../../api/apiUser';
import apiUserAddress from '../../api/apiUserAddress';
import apiOrder from '../../api/apiOrder';
import apiOrderDetail from '../../api/apiOrderDetail';
import apiProduct from '../../api/apiProduct';

// const promise = loadStripe(process.env.MIX_STRIPE_KEY);

const Checkout = () => {
	const navigate = useNavigate();
	const [presistAddress, setPresistAddress] = useState(true);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [zip, setZip] = useState('');
	const [telephone, setTelephone] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [note, setNote] = useState('');
	const [total, setTotal] = useState(0);
	const [redirect, setRedirect] = useState(false);
	const [checkoutList, setCheckoutList] = useState([]);
	const [subTotal, setSubTotal] = useState(0)
	const [orderId, setOrderId] = useState(null);

	const user_id = Cookies.get('user_id');

	// const [selectedListS, setSelectedListS] = useState([]);

	const user = useSelector(state => state.user_data);
	const dispatch = useDispatch();
	// const params = useParams()

	// console.log(params.selectedList)

	useEffect(() => {
		if (localStorage.getItem('selectedList')) {
			if (localStorage.getItem('token')) {
				getShoppingCartList();
				setTotal(localStorage.getItem('total'));
				setSubTotal(localStorage.getItem('subtotal'));
				// console.log(localStorage.getItem('total'))
				// console.log(localStorage.getItem('subtotal'))
				// setSelectedListS(localStorage.getItem('selectedList'));
			} else {
				getGuestShoppingCartList(localStorage.getItem('cartList'));
			}
		} else {
			if (!localStorage.getItem('checkoutList')) {
				setRedirect(true);
			} else {
				const list = JSON.parse(localStorage.getItem('checkoutList'));
				setCheckoutList(list);
				// calcTotal(list);

				if (localStorage.getItem('token') && !user) {
					getAuth(localStorage.getItem('token'));
				}
			}
		}


	}, [user]);

	useEffect(() => {
		if (user && user !== 'guest') {
			getUserDefaultAddress();
			// console.log("selected: ",localStorage.getItem('selectedList'))
			setSubTotal(localStorage.getItem('subtotal'))
        	setTotal(localStorage.getItem('total'))
		}
	}, [user]);

	const getAuth = (token) => {
		apiUser.getAuth({
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
		.then(result => {
			dispatch({ type: 'USER', value: result.data.user });
			if (result.data.address_id) {
				getUserDefaultAddress();
			}
		});
	};

	const getShoppingCartList = async () => {
		const selectedList = JSON.parse(localStorage.getItem('selectedList'));
		console.log(selectedList);
		
		const newCheckoutList = await Promise.all(
			selectedList.map(async (item) => {
				try {
					const responseCart = await apiShoppingCart.getOne(item, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					});
					const quantity = responseCart.data[0].quantity;

					const responseProduct = await apiProduct.getOne(responseCart.data[0].stock_id);
					// console.log(responseProduct.data);

					return {
						quantity: quantity,
						product_name: responseProduct.data.name,
						total: responseProduct.data.price * quantity
					};
				} catch (error) {
					console.log(error);
					return null; 
				}
			})
		);
		
		const validCheckoutList = newCheckoutList.filter(item => item !== null);		
		setCheckoutList(validCheckoutList);		
		getUserDefaultAddress();
	};

	const getGuestShoppingCartList = (localCartList) => {

		apiShoppingCart.getCartGuest({
            cartList: localCartList,
        })
		.then(response => {
			setCheckoutList(response.data);
			// generateCheckoutList();
		});
	};

	// const generateCheckoutList = () => {
	// 	let selectedList = JSON.parse(localStorage.getItem('selectedList'));
	// 	let updatedCheckoutList = localStorage.getItem('token')
	// 		? checkoutList.filter(item => selectedList.includes(item.id))
	// 		: checkoutList.filter((item, index) => selectedList.includes(index + 1));

	// 	localStorage.setItem('checkoutList', JSON.stringify(updatedCheckoutList));
	// 	// localStorage.removeItem('selectedList');
	// 	setCheckoutList(updatedCheckoutList);
	// 	// calcTotal(selectedList);
	// 	// console.log(selectedList);
	// };

	// const calcTotal = (list) => {
	// 	let subtotal = 0;
	// 	let shipping = 0;

	// 	list.forEach(item => {
	// 		subtotal += (item.stock?.product?.price * item?.quantity);
	// 	});

	// 	setTotal(subtotal + shipping);
	// 	setSubTotal(subtotal + shipping);

	// };

	const handleChange = (event) => {
		const { name, value } = event.target;
		switch (name) {
			case 'firstName':
				setFirstName(value);
				break;
			case 'lastName':
				setLastName(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'address':
				setAddress(value);
				break;
			case 'city':
				setCity(value);
				break;
			case 'country':
				setCountry(value);
				break;
			case 'zip':
				setZip(value);
				break;
			case 'telephone':
				setTelephone(value);
				break;
			case 'password':
				setPassword(value);
				break;
			case 'passwordConfirm':
				setPasswordConfirm(value);
				break;
			case 'note':
				setNote(value);
				break;
			default:
				break;
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();


		apiUserAddress.create({
			firstName,
			lastName,
			email,
			address,
			city,
			country,
			zip,
			telephone,
			password,
			passwordConfirm,
			localCartList: localStorage.getItem('cartList')
		})
		.then(response => {
			localStorage.setItem('token', response.data.token);
			dispatch({ type: 'USER', value: response.data.user });
			setPresistAddress(false);
		});


	};

	const handleCheckout = () => {
		apiOrder.create(
			{
				user_id: user_id
			},
			{
			headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
		})
		.then((response) => {
			// console.log(response.data)
			const id = response.data

			let selectedList = JSON.parse(localStorage.getItem('selectedList'));


			for(let i = 0; i < selectedList?.length; i++) {
				console.log(selectedList[i])
				apiShoppingCart.getOne(selectedList[i],
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				)
				.then((response) => {
					console.log("res:",response)
			
					const data = {
						order_id: id,
						stock_id: response.data[0]?.stock_id,
						quantity: response.data[0]?.quantity,
					}
					console.log("data:",data);

					apiOrderDetail.create(
						data,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`,
							}
						}
					)
					.then(res => {
						console.log(res)
						
					})
					.catch(err => {
						console.log(err)
						
						throw err;

					})

				})


			}

			localStorage.removeItem('selectedList')

			navigate("/home")
			})

		.catch(err => {
			console.log(err)
			throw err
		})

		

		
	};

	const getUserDefaultAddress = () => {
		// axios.get('/api/user/default-address/', {
		// 	headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		// })
		apiUserAddress.getDefault({
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
		.then(result => {
			if (result.status === 200 && result.data) {
				// console.log()
				setFirstName(result.data.firstname);
				setLastName(result.data.lastname);
				setEmail(result.data.email);
				setAddress(result.data.address);
				setCity(result.data.city);
				setCountry(result.data.country);
				setZip(result.data.zip);
				setTelephone(result.data.telephone);
				setPresistAddress(false);
			}
		});
	};

	const addressForm = {
		presistAddress,
		firstName,
		lastName,
		email,
		address,
		city,
		country,
		zip,
		telephone
	};

	if (redirect) {
		navigate(`/`)
	}

	return (
		<div className="section">
			<div className="container">
				<div className="row">
					<div className="col-md-7">
						{localStorage.getItem('token') && !presistAddress ? (
							<div className="section-title">
								<h3 className="title">Shipping address</h3>
								<AddressCard address={addressForm} />
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								<div className="billing-details">
									<div className="section-title">
										<h3 className="title">Shipping address</h3>
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={firstName} type="text" name="firstName" placeholder="First Name" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={lastName} type="text" name="lastName" placeholder="Last Name" />
									</div>
									{!localStorage.getItem('token') && (
										<div className="form-group">
											<input className="input" onChange={handleChange} value={email} type="email" name="email" placeholder="Email" />
										</div>
									)}
									<div className="form-group">
										<input className="input" onChange={handleChange} value={address} type="text" name="address" placeholder="Address" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={city} type="text" name="city" placeholder="City" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={country} type="text" name="country" placeholder="Country" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={zip} type="text" name="zip" placeholder="ZIP Code" />
									</div>
									<div className="form-group">
										<input className="input" onChange={handleChange} value={telephone} type="tel" name="telephone" placeholder="Telephone" />
									</div>
									{!localStorage.getItem('token') && (
										<>
											<div className="form-group">
												<div className="caption">
													<p>Enter the password for your new account.</p>
													<div className="form-group">
														<input className="input" onChange={handleChange} value={password} type="password" name="password" placeholder="Enter Your Password" />
													</div>
													<div className="form-group">
														<input className="input" onChange={handleChange} value={passwordConfirm} type="password" name="passwordConfirm" placeholder="Enter Password Again" />
													</div>
												</div>
											</div>
											<button className="create-btn"><i className="fa fa-user-plus"></i> Create Account</button>
										</>
									)}
								</div>
							</form>
						)}
						{localStorage.getItem('token') && (
							<div className="order-notes">
								<textarea className="input" value={note} name="note" onChange={handleChange} placeholder="Order Notes"></textarea>
							</div>
						)}
					</div>

					<div className="col-md-5 order-details">
						<div className="section-title text-center">
							<h3 className="title">Your Order</h3>
						</div>
						<div className="order-summary">
							<div className="order-col">
								<div><strong>PRODUCT</strong></div>
								<div><strong>{subTotal}</strong></div>
							</div>
							<div className="order-products">
								{checkoutList.map((item, key) => (
									<div key={key} className="order-col">
										<div>{item.quantity} x {item.product_name}</div>
										<div>${item.total}</div>
									</div>
								))}
							</div>
							<div className="order-col">
								<div>Shipping</div>
								<div><strong>FREE</strong></div>
							</div>
							<div className="order-col">
								<div><strong>TOTAL</strong></div>
								<div><strong className="order-total">${total}</strong></div>
							</div>
						</div>
						{/* {localStorage.getItem('token') ? (
							<div className="payment-method">
								<div className="order-col">
									{total > 0 && (
										<Elements stripe={promise}>
											<CheckoutForm items={checkoutList} address={address} note={note} />
										</Elements>
									)}
								</div>
							</div>
						) : (
							<h4 id="login-warning">Please login or register to be able to place the order!</h4>
						)} */}
						<button id={0}
                                onClick={handleCheckout}
                                to=''
                                className="primary-btn order-submit"
                            >
                                Checkout
                        </button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
