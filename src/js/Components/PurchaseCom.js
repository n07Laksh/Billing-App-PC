import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dexie from 'dexie'

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function PurchaseInvoice() {
  const navigate = useNavigate();

  const [addedItems, setAddedItems] = useState([]);
  const [total, setTotal] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [balance, setBalance] = useState();

  useEffect(() => {
    // Calculate total based on updated addedItems
    const newTotal = addedItems.reduce((sub, item) => {
      return sub + Number(item.amount);
    }, 0);

    setTotal(newTotal);
    setGrandTotal(newTotal);

    tableDiv.current.scrollTop = tableDiv.current.scrollHeight;
  }, [addedItems]);


  // calculate the paid amount from clent (return or give)
  const checkPaid = (event) => {
      const val = event.target.value;

      if (val.length) {
      setBalance(total - val);
    } else {
      setBalance(0)
    }
  }

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const [currentDate, setCurrentDate] = useState(formattedDate);

  const handleDateChange = (event) => {
    setCurrentDate(event.target.value);
  };

  const [purchaseData, setPurchaseData] = useState({
    invoiceType: "NoGST", supplierName: "", billNum: "", tag: "", name: "", unit: "KG", quantity: "", salePrice: "", disc: "", gst: "", amount: "", payMode: "", date: currentDate,
  });

  const tableDiv = useRef(); // table parent div





  const inputChange = (event) => {
    setPurchaseData({
      ...purchaseData,
      [event.target.name]: event.target.value,
    });
  };

  const addSaleItem = () => {
    if (purchaseData.name && purchaseData.quantity && purchaseData.salePrice && purchaseData.amount) {

      // setAddedItems([...addedItems, purchaseData]);
      setAddedItems(prevAddedItems => [...prevAddedItems, purchaseData]);
      setPurchaseData({ tag: "", name: "", unit: "KG", quantity: "", salePrice: "", disc: "", gst: "", amount: "" });

    } else {
      toast.error("require fields are not empty");
    }
  };

  const db = new Dexie('purchaseItems');

  // Define the schema including the new collection
  db.version(2).stores({
    // itemData: 'productName', // Existing collection
    perchaseData: 'billNum', // New collection
  });

  const savePurchase = async () => {
    if (addedItems.length > 0) {
      const promises = addedItems.map(async item => {
        try {
          await db.perchaseData.add(item);
          toast.success('Item added to new collection:', item);
        } catch (error) {
          toast.error('Error adding item:', error);
        }
      });
      await Promise.all(promises);

      setAddedItems([]);

    } else {
      toast.warn("Add Purchase Details");
    }
  };

  return (
    <>
    <ToastContainer
position="top-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
      <div className="sale-content-parentdiv">

        <div className="back-div">
          <span className="back" onClick={() => navigate(-1)}>&larr;</span><span className="mx-5 h6">Purchase Item</span>
          <Link to="/addItem" className="back-div-add-item-sec">Add Items</Link>
        </div>

        <div className="mx-4 mt-3 user-info gap-3">
          <div>

            <label htmlFor="invoiceType" className="lable-txt">
              Invoice Type
            </label>
            <br />
            <select
              onChange={inputChange}
              id="invoice-type"
              name="invoiceType"
              value={purchaseData.invoiceType}
            >
              <option value="no">No GST</option>
              <option value="gst">GST</option>
            </select>
          </div>

          <div>
            <label htmlFor="supplierName" className="lable-txt">
              Supplier Name<span className="text-danger mx-1">*</span>
            </label>
            <br />
            <input type="text" name="supplierName" id="supplierName" value={purchaseData.supplierName} onChange={inputChange} />
          </div>

          <div>
            <label htmlFor="billDate" className="lable-txt">
              Bill Date
            </label>
            <br />
            <input
              onChange={handleDateChange}
              type="date"
              value={currentDate}
              name="date"
              className="date"
            // max={currentDate}
            />
          </div>

          <div>
            <label htmlFor="billNum" className="lable-txt">
              Purchase Bill No.
            </label>
            <br />

            <input type="number" name="billNum" className="billNum" value={purchaseData.billNum} onChange={inputChange} />
          </div>

        </div>



        <div className="item-section mt-4 mx-4">
          <div>
            <label className="lable-txt" htmlFor="tag ">
              Item tag
            </label>
            <br />
            <input
              onChange={inputChange}
              type="text"
              id="tag"
              className="tag"
              name="tag"
              value={purchaseData.tag}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="name">
              Name <span className="text-danger">*</span>
            </label>
            <br />
            <input
              onChange={inputChange}
              type="text"
              id="name"
              className="name"
              name="name"
              value={purchaseData.name}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="unit">
              Unit
            </label>
            <br />
            <select
              onChange={inputChange}
              id="unit"
              name="unit"
              value={purchaseData.unit}
            >
              <option value="NO">None</option>
              <option value="BG">Bag (BG)</option>
              <option value="BTL">Bottle (BTL)</option>
              <option value="BX">Box (BX)</option>
              <option value="BDL">Bundles (BDL)</option>
              <option value="CAN">Cans (CAN)</option>
              <option value="CTN">Cortons (CTN)</option>
              <option value="DZN">Dozens (DZN)</option>
              <option value="GM">Grammes (GM)</option>
              <option value="KG">Kilograms (KG)</option>
              <option value="LT">Liter (LT)</option>
              <option value="MT">Meters (MT)</option>
              <option value="MLT">MiliLiter (MLT)</option>
              <option value="NUM">Numbers (NUM)</option>
              <option value="PAC">Packs (PAC)</option>
              <option value="PRS">Pairs (PRS)</option>
              <option value="PCS">Pieces (PCS)</option>
              <option value="QTL">Quintal (QTL)</option>
              <option value="ROL">Rolls (ROL)</option>
              <option value="SF">Square Feet (SF)</option>
              <option value="SM">Square Meter (SM)</option>
              <option value="TAB">Tablets (TAB)</option>
            </select>
          </div>
          <div>
            <label className="lable-txt" htmlFor="quantity">
              Quantity <span className="text-danger">*</span>
            </label>
            <br />
            <input
              onChange={inputChange}
              type="number"
              id="quantity"
              className="quantity"
              name="quantity"
              value={purchaseData.quantity}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="sale-price">
             Purchase Price <span className="text-danger">*</span>
            </label>
            <br />
            <span className="ruppe-div">&#8377; </span>
            <input
              onChange={inputChange}
              type="number"
              id="sale-price"
              className="sale-price"
              name="salePrice"
              value={purchaseData.salePrice}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="disc">
              Disc %
            </label>
            <br />
            <span className="percent-div"> % </span>
            <input
              onChange={inputChange}
              type="number"
              id="disc"
              className="disc"
              name="disc"
              value={purchaseData.disc}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="gst">
              GST %
            </label>
            <br />
            <span className="percent-div"> % </span>
            <input
              onChange={inputChange}
              type="number"
              id="gst"
              className="gst"
              name="gst"
              value={purchaseData.gst}
            />
          </div>

          <div>
            <label className="lable-txt" htmlFor="amount">
              Amount <span className="text-danger">*</span>
            </label>
            <br />
            <span className="ruppe-div"> &#8377; </span>
            <input
              onChange={inputChange}
              type="number"
              id="amount"
              className="amount"
              name="amount"
              value={purchaseData.amount}
            />
          </div>
        </div>
        <div className="add-btn-parent mt-3 me-3">
          <button
            onClick={addSaleItem}
            className="btn btn-primary btn-sm add-btn "
          >
            Add
          </button>
        </div>

        {/* div for spacing */}
        <div className="d-block space-div "></div>

        {/* add item list */}
        <div ref={tableDiv} className="item-list-parent mx-3 border">
          <table className="table caption-top text-center ">
            <thead className="table-info">
              <tr>
                <th className="name-head" scope="col">
                  Name
                </th>
                <th scope="col">Tag</th>
                <th scope="col">Qunatity</th>
                <th scope="col">Unit</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Discount</th>
                <th scope="col">Tax</th>
                <th scope="col">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item, index) => (
                <tr className="position-relative" key={index}>
                  <td>{item.name}</td>
                  <td>{item.tag === "" ? "__" : item.tag}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.salePrice}</td>
                  <td>{item.disc === "" ? "0" : item.disc}</td>
                  <td>{item.gst === "" ? "0" : item.gst}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="sale-invoice-footer mx-3 my-1">
          <div className="payment d-flex justify-content-center gap-5">
            <div>
              <label className="lable-txt" htmlFor="payMode">
                Payment Mode
              </label>
              <br />
              <select
                onChange={inputChange}
                id="payMode"
                name="payMode"
                value={purchaseData.payMode}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI (Online Payment)</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card Payment</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <div>
                <label className="lable-txt calc-amount-txt" htmlFor="paidAmount">Amount Paid</label>
                <input onChange={checkPaid} type="number" name="paidAmount" />
              </div>
              <div>
                <label className="lable-txt calc-amount-txt" htmlFor="bal">Balance</label>
                <input type="text" name="bal" disabled value={balance} />
              </div>
            </div>
          </div>

          <div className="print-save">
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>Sub-Total</div>
              <div>{total?total:"0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> CGST(0%)</div>
              <div>0.00</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> SGST(0%)</div>
              <div>0.00</div>
            </div>
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>GRAND TOTAL</div>
              <div>{grandTotal?grandTotal:"0.00"}</div>
            </div>
            <button onClick={savePurchase} className="btn btn-sm btn-primary mt-2 w-75">
              Save
            </button>
          </div>
        </div>


      </div>
    </>
  );
}

export default PurchaseInvoice;
