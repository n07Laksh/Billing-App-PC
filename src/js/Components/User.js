import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [shop, setShop] = useState("");
    const [name, setName] = useState("Name");
    const [email, setEmail] = useState("Email");
    const [shopName, setShopName] = useState(null);
    const [shopAddress, setShopAddress] = useState(null);
    const [shopContact, setShopContact] = useState(null);

    useEffect(()=>{
        getUserDetails()
    },[]);

    const getUserDetails = () =>{
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            if(userData){
                setName(userData.name);
                setEmail(userData.email)
            }

            const userAddCon = JSON.parse(localStorage.getItem("userAdd"));

            if(userAddCon){
                setShopContact(userAddCon.contact)
                setShopAddress(userAddCon.address)
                setShopName(userAddCon.shopName)
            }
            
        } catch (error) {
            alert(error)
        }
    }

    const handleAdd = () => {
        try {
    const userDataString = JSON.stringify({address:address, contact:contact, shopName:shop});

    localStorage.setItem('userAdd', userDataString);
           setShopAddress(address);
           setShopContact(contact);
           setShopName(shop);
        } catch (error) {
            console.log(error)
        }
    }

  return (

    <>
        <div className="back-div backdiv-width">
          <span className="back back-n" onClick={() => navigate(-1)}>&larr;</span><span className="mx-5 h6 back">Profile</span>
        </div>
        <div className="d-flex justify-content-center login-update-user-detail">

            <div className="user-div user-detail-div">
              <div className='user-child-div'>
                <h5 className="user-name m-4">{name}</h5>
                <h5 className="email m-4">{email}</h5>
                <h5 className="shopName m-4">{ shopName }</h5>
                <h5 className="address m-4">{shopAddress}</h5>
                <h5 className="contact m-4">{shopContact}</h5>
                </div>
            </div>

            <div className="detail-div user-detail-div">
            <div className="form-outline user-n m-4">
                    <label className="form-label" htmlFor="address">Address</label>
                     <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} id="address" className="form-control" />
                 </div>

                 <div className="form-outline user-n m-4">
                    <label className="form-label" htmlFor="contact">Contact</label>
                     <input type="text" onChange={(e) => setContact(e.target.value)} value={contact} id="contact" className="form-control" />
                 </div>

                 <div className="form-outline user-n m-4">
                    <label className="form-label" htmlFor="contact">Shop Name</label>
                     <input type="text" onChange={(e) => setShop(e.target.value)} value={shop} id="contact" className="form-control" />
                 </div>

                 <button onClick={handleAdd} className='btn btn-primary w-50 ms-4'>Add</button>


            </div>
        </div>
    </>
  )
}

export default User
