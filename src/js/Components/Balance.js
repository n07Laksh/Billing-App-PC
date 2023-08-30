import React from "react";

const Balance = () => {
  return (
    <div className="left-div">
      <div className="balance">
        <div className="today">
          <div>
            <div className="today-title">Today Sale</div>
            <div className="today-amount">000</div>
          </div>

          <div className="today-details">
            <ul className="today-ul">
              <li className="today-ul-li">
                Gross Sale
                <ul className="child-ul-today-detail">
                  <li className="child-ul-li-today-detail">0</li>
                </ul>
              </li>

              <li className="today-ul-li">
                Amount Recieved
                <ul className="child-ul-today-detail">
                  <li className="child-ul-li-today-detail">0</li>
                </ul>
              </li>
              <li className="today-ul-li">
                Amount Due
                <ul className="child-ul-today-detail">
                  <li className="child-ul-li-today-detail">0</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="total">
          <div>
            <div className="total-title">Total Sale</div>
            <div className="total-amount">0000</div>
          </div>
          <div>
            <ul className="total-ul">
              <li className="total-ul-li">Previous month total 0</li>
              <li className="total-ul-li">second item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance; 
