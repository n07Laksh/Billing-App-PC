import React, { useEffect, useState } from 'react'

const ShopDetails = () => {
  const [shopName, setShopName] = useState(" Name");
  const [shopAddress, setShopAddress] = useState(" Address");
  const [shopContact, setShopContact] = useState(" Contact");


  const getUserDetail = () => {

    const user = JSON.parse(localStorage.getItem("userData"))

    const userData = JSON.parse(localStorage.getItem(`userAdd_${user.name}`));

    if (userData) {
      setShopName(userData.shopName);
      setShopAddress(userData.shopName);
      setShopContact(userData.contact);
    }
  }

  useEffect(() => {
    getUserDetail();
  }, [])

  return (
    <div className='shop-details'>
      <h3 className="shop-name">{shopName}</h3>
      <div className="shop-phone"><i className="fa-solid fa-phone me-2"></i>{shopContact}</div>
      <div className="shop-address"><i className="fa-solid fa-location-dot me-2"></i>{shopAddress}</div>
    </div>
  )
}

export default ShopDetails
