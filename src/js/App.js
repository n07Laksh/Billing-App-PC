import 'bootstrap';
import './scss/_style.scss';
import "@fortawesome/fontawesome-free/js/all";

import React, { useState, useEffect } from 'react';
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Navigation from "./Components/Navigation";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SaleInvoice from "./Components/SaleInvoice";
import PurchaseInvoice from "./Components/PurchaseCom";
import User from './Components/User';
import Login from './Components/Login';
import Search from './Components/Search';
import Stock from './Components/Stock';
import Signup from './Components/Signup';


const App = () => {

  const user = localStorage.getItem("user");
  console.log(user)
  const [login, setLogin] = useState(user ? true : false);

useEffect(() => {
  // Check if the user token exists in localStorage
  const userToken = localStorage.getItem('user');

  if (userToken) {
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const currentTime = new Date();
    
    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - (lastLoginTime || 0);
    
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Check if the user token should be removed (e.g., if it's older than 24 hours)
    if (timeDifference >= oneDayInMilliseconds) {
      // Remove the user token from localStorage
      localStorage.removeItem('user');
    }
  }

  // // If the user token doesn't exist or it was removed, perform the login process here
  // if (!localStorage.getItem('user')) {
  //   // Perform the login process and obtain a new user token
  //   // const newUserToken = 'your_new_token'; // Replace this with your actual login code
    
  //   // Store the new user token and the current login time
  //   // localStorage.setItem('user', newUserToken);
  //   localStorage.setItem('lastLoginTime', new Date().getTime());
  // }
}, []);


  return (
    <>
      <Router basename="/C:/Users/user/Projects/electron-exam/">

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
                <Route exact path="/user" element={<User />} />
                <Route exact path="/search" element={<Search />} />
                <Route exact path="/stock" element={<Stock />} />
              </Routes>
            </>
          )
          }

        </div>

      </Router>



      {/* <button onClick={() => {
        // electron.notificationApi.sendNotification('My custom notification!');
        alert("hello")
      }}>Notify</button>
      <button onClick={() => {
        electron.notificationApi.sendNotification('My custom notification!');
      }}>Notify</button>
      <div>{name}</div>
      <button onClick={()=>{setName(name + 1)}}>Increase</button> */}
    </>
  )
}


export default App