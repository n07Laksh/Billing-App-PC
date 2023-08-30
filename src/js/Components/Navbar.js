import React, { useState, useEffect } from "react";
import userImage from "../images/user.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState("");

  useEffect(()=>{
    let a = JSON.parse(localStorage.getItem("userData"));
    if(a){
      setUser(a);
    }
  },[]);
 
  return (
    <div className="navbar-print-hide">
      <nav className="navbar navbar-expand-lg nav-div bg-body-tertiary ">
        <div className="container-fluid justify-content-end">
        <Link to="/user" className="me-5" ><img src={userImage} className="userImage" alt="" /></Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
