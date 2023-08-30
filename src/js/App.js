import 'bootstrap';
import './scss/_style.scss';
import "@fortawesome/fontawesome-free/js/all";

import React, { useState } from 'react';
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Navigation from "./Components/Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SaleInvoice from "./Components/SaleInvoice";
import PurchaseInvoice from "./Components/PurchaseCom";
import User from './Components/User';
import Login from './Components/Login';

export default function App() {
  const user = localStorage.getItem("user");
  const [login, setLogin] = useState(user ? true : false);
  return (
    <>
      <Router basename="/C:/Users/user/Projects/electron-exam/">

        <div>

          {!login ? (
            <>
              <Routes>
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