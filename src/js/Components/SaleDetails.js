import React from "react";

const SaleDetails = (props) => {
  return (
    <div className="d-flex justify-content-end gap-5">
      <div className="sale-texts">
        <div>Total</div>
        <div>Tax %</div>
        <div>Sub-Total</div>
      </div>
      <div className="sale-price">
        <div>{props.total}</div>
        <div>{props.tax?props.tax:"00"}</div>
        <div>{props.grandTotal}</div>
      </div>
    </div>
  );
};

export default SaleDetails;