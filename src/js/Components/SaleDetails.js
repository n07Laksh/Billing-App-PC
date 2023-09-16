import React from "react";

const SaleDetails = (props) => {
  return (
    <div className="d-flex justify-content-end gap-5">
      <div className="sale-texts">
        <div>Total</div>
        <div>Total Discount</div>
        <div>Tax %</div>
        <div>Round</div>
        <div>Sub-Total</div>
      </div>
      <div className="sale-price">
        <div>{props.total}</div>
        { props.discountAmount?<div>{props.discountAmount}</div>:""}
        { props.gstAmount?<div>{props.gstAmount}</div>:""} 
        <div>{props.fractionalPart}</div>
        <div>{props.grandTotal ? props.grandTotal.toFixed(0) : "00"}</div>
      </div>
    </div>
  );
};

export default SaleDetails;