import 'bootstrap';
import './scss/_style.scss';
import "@fortawesome/fontawesome-free/js/all";

import React, { useState, useEffect } from 'react';
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Navigation from "./Components/Navigation";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SaleInvoice from "./Components/SaleInvoice";
import PurchaseInvoice from "./Components/PurchaseCom";
import User from './Components/User';
import Login from './Components/Login';
import Search from './Components/Search';
import Stock from './Components/Stock';
import Signup from './Components/Signup';


const App = () => {

  const user = localStorage.getItem("user");
  const [login, setLogin] = useState(user ? true : false);

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const lastLoginTime = localStorage.getItem('lastLoginTime');

  if (storedUser && lastLoginTime) {
    const currentTime = new Date().getTime();
    const storedTime = parseInt(lastLoginTime, 10);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    const timeDifference = currentTime - storedTime;

    if (timeDifference >= oneDayInMilliseconds) {
      localStorage.removeItem('user');
      localStorage.removeItem('lastLoginTime');
      setLogin(false); // Update the login state if the token is removed
    } else {
      setLogin(true); // Set login state to true if the token is valid
    }
  } else {
    setLogin(false); // Set login state to false if no user or lastLoginTime found
  }
}, []);



  return (
    <>
      <Router >

        <div>

          {!login ? (
            <>
              <Routes>
                <Route path="/signup" element={<Signup setLogin={setLogin} />} />
                <Route path="*" element={<Login setLogin={setLogin} />} />
              </Routes>
            </>
          ) : (


            <>

              <Navbar />
              <Navigation />

              <Routes>
                <Route exact path="*" element={<Home />} />
                <Route exact path="/saleinvoice" element={<SaleInvoice />} />
                <Route exact path="/purchase" element={<PurchaseInvoice />} />
                <Route exact path="/user" element={<User setLogin={setLogin} />} />
                <Route exact path="/search" element={<Search />} />
                <Route exact path="/stock" element={<Stock />} />
              </Routes>
            </>
          )
          }

        </div>

      </Router>
    </>
  )
}


export default App