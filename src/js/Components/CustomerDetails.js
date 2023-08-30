import React from 'react'

const CustomerDetails = (props) => {
  return (
    <div className='customer-details mt-4'> 
      <h5 className="shop-name">{props.saleData.clientName}</h5>
      <div className="shop-address">{props.saleData.clientAddress}</div>
      <div className="shop-phone">{props.saleData.clientContact}</div>
    </div>
  )
}

export default CustomerDetails