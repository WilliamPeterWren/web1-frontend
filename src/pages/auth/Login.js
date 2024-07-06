import React, { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import Cookies from 'js-cookie';



import apiUser from '../../api/apiUser';

function Login() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const dispatch = useDispatch();
    const showLogin = useSelector(state => state.show_login);

    

    const handleClose = () => {
        setShow(false);
        dispatch({ 
            type: 'LOGIN_CONTROL', 
            value: false 
        });
    };

    const handleShow = () => {
        setShow(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            email: email,
            password: password
        }

        apiUser.loginUser(data)
        .then(result => {
            // console.log("result: ",result);
            if(result.status === 200){
                Cookies.set('email', result.data.user.email, {expires: 1});
                Cookies.set('username', result.data.user.name, {expires: 1});
                Cookies.set('password', password, {expires: 1});
                Cookies.set('token', result.data.token, {expires: 1});
                Cookies.set('user_id', result.data.user.id, {expires: 1});                
            }
            localStorage.setItem('token', result.data.token);
            dispatch({ 
                type: 'USER_DATA', 
                value: result.data.user 
            });
            handleClose();
            window.location.reload();
        }).catch(error => {
            console.log(error)
            setError(true);
            setLoading(false);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    return (
        <React.Fragment>
            <Button onClick={handleShow} bsPrefix="auth">
                <i className="fa fa-sign-in"></i> Login
            </Button>
            <Modal show={show || showLogin} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="auth-title">User Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="auth" onSubmit={handleSubmit}>
                        {error && 
                            <div className="form-alert">
                                <Alert variant='danger'>
                                    <i className="fa fa-exclamation-triangle"></i>
                                    Invalid credentials!
                                </Alert>
                            </div>
                        }
                        <div className="form-group">
                            <input type="email" required
                                className="form-control auth-input"
                                name="email"
                                placeholder="Enter Email"
                                onChange={handleChange}
                            />
                            <i className="fa fa-user"></i>
                        </div>
                        <div className="form-group">
                            <input type="password" required
                                className="form-control auth-input"
                                name="password"
                                placeholder="Enter Password"
                                onChange={handleChange}
                            />
                            <i className="fa fa-lock"></i>
                        </div>
                        <button type="submit" className="submit btn btn-danger">
                            {loading ? (
                                <div className="align-middle">
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                <span>Login</span>
                            )}
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

export default Login;
