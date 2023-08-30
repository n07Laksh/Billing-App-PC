import React, { useState } from 'react'

const ShopDetails = () => {
  const [shopName, setShopName] = useState(" Name");
  const [shopAddress, setShopAddress] = useState(" Address");
  const [shopContact, setShopContact] = useState(" Contact");

  const getUserDetail = () => {
    try {
      const userData = localStorage.getItem("userData");

      if(userData){
        setShopName(userData.shopName);
        setShopAddress(userData.shopName);
        setShopName(userData.shopName);
      }

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='shop-details'>
      <h3 className="shop-name">{shopName}</h3>
      <div className="shop-address">{shopAddress}</div>
      <div className="shop-phone">{shopContact}</div>
    </div>
  )
}

export default ShopDetails
