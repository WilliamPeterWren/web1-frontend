import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {createStore} from 'redux';
import {Provider} from'react-redux';
import Reducer from './pages/store/Reducer';


const store = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSIONS__ && window.__REDUX_DEVTOOLS_EXTENSIONS__())

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer />
        <App />      
    </Provider>    
  </BrowserRouter>
);
reportWebVitals();
