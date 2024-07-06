import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

// import { API_URL } from '../../api/config';

import apiUser from '../../api/apiUser';

import Cookies from 'js-cookie';

import Login from './Login';
import Register from './Register';

const Authentification = () => {
    const [user, setUser] = useState('');
    const [redirect, setRedirect] = useState('');

    const dispatch = useDispatch();
    const userData = useSelector(state => state.user_data);

    const navigate = useNavigate();
    const username = Cookies.get('username');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getAuth(localStorage.getItem('token'));
        }
    }, []);

    useEffect(() => {
        if (userData && userData !== username) {
            setUser(userData);            
        }
        
    }, [userData, user]);

    const getAuth = (token) => {
        apiUser.getAuth({
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        })
        .then(result => {
            // console.log("response: ",result)
            setUser(result.data.user);
        })
        .catch(error => {
            console.log("error: ",error)
            logout();
        });
    };

    const logout = () => {        

        localStorage.removeItem('token');
        Cookies.remove('email', { path: '' }) // removed!
        Cookies.remove('password', { path: '' }) // removed!
        Cookies.remove('username', { path: '' }) // removed!

        setUser('');
        dispatch({ 
            type: 'USER', 
            value: 'guest' 
        });
    };

    const handleClick = (e) => {
        switch (e.target.id) {
            case '0':
                setRedirect('dashboard');
                break;
            case '1':
                setRedirect('my-account');
                break;
            case '2':
                setRedirect('track-my-order');
                break;
            case '3':
                logout();
                break;
            default:
                break;
        }
    };

    if (redirect) {
        navigate(`/${redirect}`)
    }

    return (
        (userData !== 'guest' && localStorage.getItem('token')) ? (
            <li>
               
                <Dropdown>
                    <Dropdown.Toggle variant="toggle" id="dropdown-basic">
                        <i className="fa fa-user-o"></i>
                        <span>{username}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu onClick={handleClick}>
                        <Dropdown.Item id="0">Dashboard</Dropdown.Item>
                        <Dropdown.Item id="1">My Account</Dropdown.Item>
                        <Dropdown.Item id="2">Track My Order</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item id="3">
                            <i id="3" className="fa fa-sign-out" aria-hidden="true"></i>
                            Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
              
            </li>
        ) : (
            <React.Fragment>
                <li><Login /></li>
                <li><Register /></li>
            </React.Fragment>
        )
    );
};

export default Authentification;
