import React, { useState } from "react";
import logoImage from "../images/ttslogopng.png";
import { Link } from "react-router-dom";

function Dashboard() {

  return (
    <div className="sidenav-print-hide">
      <div className="sidenav">
        <Link>
          <img src={logoImage} alt="" className="ttslogo" />
        </Link>

        <Link
          className="nav-tab "
          to="/saleinvoice"
        >
          <i className="fa-solid fa-bag-shopping me-2"></i>Sale Invoice
        </Link>

        <Link to="/purchase" className="nav-tab">
          <i className="fa-solid fa-cart-shopping me-1"></i> Purchase
        </Link>
        
        <Link className="nav-tab">
          <i className="fa-solid fa-store me-1"></i> Stocks
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
