import React from "react";
import logoImage from "../images/ttslogopng.png";
import { Link } from "react-router-dom";

function Dashboard() {

  return (
    <div className="sidenav-print-hide">
      <div className="sidenav">
        <Link to="*" className="tts_logo_bg">
          <img src={logoImage} alt="" className="ttslogo" />
        </Link>

        <Link
          className="nav-tab"
          to="/saleinvoice"
        >
          <i className="fa-solid fa-bag-shopping me-1"></i> Sale Invoice
        </Link>

        <Link to="/purchase" className="nav-tab">
          <i className="fa-solid fa-cart-shopping me-1"></i> Purchase
        </Link>

        <Link to="/stock" className="nav-tab">
          <i className="fa-solid fa-store me-1"></i> Stock
        </Link>

        <Link to="/search" className="nav-tab">
          <i className="fa-solid fa-search me-1"></i> Search
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
