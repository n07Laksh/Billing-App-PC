import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dexie from 'dexie'

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function PurchaseInvoice() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userData"));

  const [addedItems, setAddedItems] = useState([]);
  const [total, setTotal] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isZero, setIsZero] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(null);
  const [gstAmount, setGstAmount] = useState(null);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [totalOriginalAmount, setTotalOriginalAmount] = useState(0);
  const [totalOriginalGSTAmount, setTotalGSTOriginalAmount] = useState(0);
  const [fractionalPart, setFractionalPart] = useState(0);


  useEffect(() => {
    // Calculate total based on updated addedItems
    const newTotal = addedItems.reduce((sub, item) => {
      return sub + Number(item.amount);
    }, 0);

    setTotal(newTotal);

    setGrandTotal(newTotal);

    tableDiv.current.scrollTop = tableDiv.current.scrollHeight;

  }, [addedItems,]);




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


  const [purchaseData, setPurchaseData] = useState({
    invoiceType: "GST",
    supplierName: "",
    billNum: "",
    name: "",
    unit: "KG",
    quantity: "",
    purchasePrice: "",
    salePrice: "",
    disc: "",
    gst: 18,
    amount: "",
    payMode: "Cash",
    date: "",
    today: currentDate,
    totalDiscount: "",
    totalGST: "",
  });

  const tableDiv = useRef(); // table parent div


  // calculate discount and auto fill for sale amount
  useEffect(() => {
    const itemAmount = purchaseData.quantity * purchaseData.purchasePrice;
    if (purchaseData.disc) {
      const discountedAmt = itemAmount - (itemAmount * purchaseData.disc) / 100;
      purchaseData.disc == "100" || discountedAmt <= 0 ? setAmount(0) : setAmount(Math.round(discountedAmt));
      purchaseData.amount = Math.round(discountedAmt);
      setIsZero(true);
      setOriginalAmount(Math.round(discountedAmt))
    } else {
      setOriginalAmount(itemAmount);
      setAmount(itemAmount)
      purchaseData.amount = itemAmount;
      setIsZero(true);
    }
  }, [purchaseData.purchasePrice, purchaseData.quantity, purchaseData.disc, purchaseData.invoiceType]);


  useEffect(() => {
    // Ensure purchaseData.gst is a valid number
    const gstPercentage = parseFloat(purchaseData.gst);
    if (purchaseData.invoiceType === "GST") {

      if (!isNaN(gstPercentage) && gstPercentage >= 0 && gstPercentage <= 100) {
        const gstAmount = (originalAmount * gstPercentage) / 100;
        const newAmount = originalAmount + gstAmount;

        // Update purchaseData.amount and the state
        purchaseData.amount = Math.round(newAmount);
        setAmount(newAmount)
      } else {
        setAmount(originalAmount)
        purchaseData.amount = Math.round(originalAmount);
      }
    } else {
      purchaseData.gst = 0;
    }
  }, [purchaseData.gst, originalAmount, purchaseData.invoiceType]);


  useEffect(() => {
    // Ensure purchaseData.totalDiscount is a valid number
    const discountPercentage = parseFloat(purchaseData.totalDiscount);

    // Check if discountPercentage is a valid number between 1 and 99 (as per your min and max)
    if (!isNaN(discountPercentage) && discountPercentage >= 0 && discountPercentage <= 100) {
      const discountAmount = (total * discountPercentage) / 100;
      setDiscountAmount(discountAmount); // Assuming you have state to store the discount amount
      const totalDiscounted = total - discountAmount;
      setGrandTotal(totalDiscounted);
      setTotalOriginalAmount(totalDiscounted);
    } else {
      setTotalOriginalAmount(total)
      // Handle the case where the discount percentage is invalid
      setDiscountAmount(0); // Set discount amount to 0
      setGrandTotal(total); // Set grand total to the original total
    }
  }, [purchaseData.totalDiscount]);



  useEffect(() => {
    // Ensure purchaseData.totalGST is a valid number
    const gstPercentage = parseFloat(purchaseData.totalGST);

    if (purchaseData.totalDiscount) {
      // Check if gstPercentage is a valid number between 0 and 100 (inclusive)
      if (!isNaN(gstPercentage) && gstPercentage >= 0 && gstPercentage <= 100) {
        const gstAmount = (totalOriginalAmount * gstPercentage) / 100;
        setGstAmount(gstAmount); // Assuming you have state to store the GST amount
        const totalWithGst = totalOriginalAmount + gstAmount;

        setGrandTotal(totalWithGst);

        const fractionalPart = totalWithGst - Math.floor(totalWithGst);

        // Apply Math.round only to the final totalWithGst

        setFractionalPart(fractionalPart);
      } else {
        // Handle the case where the GST percentage is invalid
        setGstAmount(0); // Set GST amount to 0
        setGrandTotal(totalOriginalAmount); // Set grand total to the original total
        setFractionalPart(0);
      }
    }
    else {
      // Check if gstPercentage is a valid number between 0 and 100 (inclusive)
      if (!isNaN(gstPercentage) && gstPercentage >= 0 && gstPercentage <= 100) {
        const gstAmount = (total * gstPercentage) / 100;
        setGstAmount(gstAmount); // Assuming you have state to store the GST amount
        const totalWithGst = total + gstAmount;

        setGrandTotal(totalWithGst);

        const fractionalPart = totalWithGst - Math.floor(totalWithGst);

        // Apply Math.round only to the final totalWithGst

        setFractionalPart(fractionalPart);
      } else {
        // Handle the case where the GST percentage is invalid
        setGstAmount(0); // Set GST amount to 0
        setGrandTotal(total); // Set grand total to the original total
        setFractionalPart(0);
      }
    }
  }, [purchaseData.totalGST]);


  const nameSuppHandle = (event) => {
    const { name, value } = event.target;
    const lowercaseValue = ['supplierName'].includes(name) ? value.toLowerCase() : value;
    setPurchaseData((prevData) => ({
      ...prevData,
      [name]: lowercaseValue,
    }));
  };

  const inputChange = (event) => {
    setPurchaseData({
      ...purchaseData,
      [event.target.name]: event.target.value,
    });
  };



  const addSaleItem = () => {
    if (purchaseData.name && purchaseData.quantity && purchaseData.purchasePrice && isZero && purchaseData.supplierName) {
      // setAddedItems([...addedItems, purchaseData]);
      setAddedItems(prevAddedItems => [...prevAddedItems, purchaseData]);
      setPurchaseData({ ...purchaseData, name: "", unit: "KG", quantity: "", purchasePrice: "", salePrice: "", disc: "", gst: 18, amount: "" });

    } else {
      toast.error("require fields are not empty");
    }console
  };



  const db = new Dexie(`purchase_${user.name}`);

  // Define the schema including the new collection
  db.version(4).stores({
    purchaseData: '++id,billNum,today,supplierName,date', // New collection
  });

  const storeDB = new Dexie(`store_${user.name}`);
  storeDB.version(4).stores({
    items: "name", // collection with keyPath name and
  })

  const dailyPurchase = new Dexie(`dailyPurchase_${user.name}`);
  dailyPurchase.version(5).stores({
    purchases: '++id,today,supplierName', //'++id' is an auto-incremented unique identifier
  });


  //add purchase item in indexeddb
  const savePurchase = async () => {
    if (addedItems.length > 0) {
      const promises = addedItems.map(async item => {
        try {
          await db.purchaseData.add(item);
          await dailyPurchase.purchases.add(item);
          try {
            await storeDB.transaction('rw', storeDB.items, async () => {
              const existingItem = await storeDB.items.get(item.name);
              if (existingItem) {
                // If the item exists, update its quantity by adding the new quantity
                existingItem.quantity = Number(existingItem.quantity) + Number(item.quantity);
                existingItem.purchasePrice = item.purchasePrice;
                existingItem.salePrice = item.salePrice;
                existingItem.unit = item.unit;
                await storeDB.items.put(existingItem);
              } else {
                // If the item doesn't exist, create a new record
                const storeData = { name: item.name.toLowerCase(), quantity: item.quantity, salePrice: item.salePrice, purchasePrice: item.purchasePrice, unit: item.unit };
                await storeDB.items.put(storeData);
              }
            });
          } catch (error) {
            toast.error('Error updating item quantity:', error);
          }

          return true; // Resolve promise if added successfully

        } catch (error) {
          toast.error('Error adding item: ' + error.message);
          return false; // Reject promise if error occurred
        }

      });

      const results = await Promise.all(promises);

      if (results.every(result => result)) {
        // All promises resolved successfully
        toast.success('Items added to collection');
        setAddedItems([]);
      } else {
        // At least one promise had an error
        toast.error('Some items could not be added.');

      }
    } else {
      toast.warn('Add Sale Details');
    }
  };

  // Function to delete an item from addedItems by index
  const handleDeleteItem = (index) => {
    const updatedItems = [...addedItems];
    updatedItems.splice(index, 1); // Remove the item at the specified index
    setAddedItems(updatedItems); // Update the state to reflect the deleted item
  };



  // auto suggest function 
  const [store, setStore] = useState([]);
  const [filteredStore, setFilteredStore] = useState([]);

  useEffect(() => {
    // Function to get all data from indexeddb store collection
    async function getStore() {
      const storeData = await storeDB.items.toArray();
      storeData.length > 0 ? setStore(storeData) : setStore([]);
    }

    getStore();
  }, []);


  // Function to filter store based on input value
  const searchItemName = (value) => {
    const filteredItems = store.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStore(filteredItems);
  };

  const nameHandle = (event) => {
    const { name, value } = event.target;
    const lowercaseValue = ['name'].includes(name) ? value.toLowerCase() : value;

    setPurchaseData((prevData) => ({
      ...prevData,
      [name]: lowercaseValue,
    }));

    searchItemName(value);

  };

  // Function to handle item selection
  const handleItemClick = (item) => {
    setPurchaseData({ ...purchaseData, name: item.name, purchasePrice: item.purchasePrice, salePrice: item.salePrice });
    setFilteredStore([])
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
        theme="light"
      />
      <div className="sale-content-parentdiv p-3">

        <div className="back-div">
          <span className="back" onClick={() => navigate(-1)}>&larr;</span><span className="mx-5 h6">Purchase Item</span>
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
              <option value="NoGST">No GST</option>
              <option value="GST">GST</option>
            </select>
          </div>

          <div>
            <label htmlFor="supplierName" className="lable-txt">
              Supplier Name<span className="text-danger mx-1">*</span>
            </label>
            <br />
            <input type="text" name="supplierName" id="supplierName" value={purchaseData.supplierName} onChange={nameSuppHandle} />
          </div>

          <div>
            <label htmlFor="billDate" className="lable-txt">
              Bill Date
            </label>
            <br />
            <input
              onChange={inputChange}
              type="date"
              value={purchaseData.date ? purchaseData.date : currentDate}
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
            <label className="lable-txt" htmlFor="name">
              Name <span className="text-danger">*</span>
            </label>
            <br />
            <input
              onChange={nameHandle}
              type="text"
              id="name"
              className="name"
              name="name"
              value={purchaseData.name}
            />
            <div className="result_item">
              {/* Display the filtered results as a list of names */}
              <ul className="list-group">
                {filteredStore.map((item) => (
                  <li className="list-group-item" key={item.name} onClick={() => handleItemClick(item)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
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
            <label className="lable-txt" htmlFor="purchase-price">
              Purchase Price <span className="text-danger">*</span>
            </label>
            <br />
            <span className="ruppe-div">&#8377; </span>
            <input
              onChange={inputChange}
              type="number"
              id="purchase-price"
              className="purchase-price"
              name="purchasePrice"
              value={purchaseData.purchasePrice}
            />
          </div>

          <div>
            <label className="lable-txt" htmlFor="sale-price">
              Sale Price
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
              disabled={purchaseData.invoiceType === "NoGST"}
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
              value={ amount?amount:purchaseData.amount }
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
                <th scope="col">Qunatity</th>
                <th scope="col">Unit</th>
                <th scope="col">Rate</th>
                <th scope="col">Discount %</th>
                <th scope="col">Tax %</th>
                <th scope="col">Total Amount</th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item, index) => (
                <tr className="position-relative" key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.purchasePrice}</td>
                  <td>{item.disc === "" ? "0" : item.disc} %</td>
                  <td>{item.gst === "" ? "0" : item.gst} %</td>
                  <td>{item.amount}</td>
                  <td>
                    {/* Add the delete button (X) and call handleDeleteItem with the item's index */}
                    <button className="border border-light bg-danger text-light" onClick={() => handleDeleteItem(index)}>X</button>
                  </td>
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
                <option value="Cash">Cash</option>
                <option value="UPI">UPI (Online Payment)</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card Payment</option>
                <option value="Bank">Bank Transfer</option>
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

            <div>
              <input onChange={inputChange} type="number" name="totalDiscount" placeholder="Total Discount %" className="mt-4" />
              <input onChange={inputChange} type="number" name="totalGST" placeholder="Total GST %" className="mt-2" disabled={purchaseData.invoiceType === "NoGST"} />
            </div>

          </div>

          <div className="print-save">
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>Sub-Total</div>
              <div>{total ? total : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> Total Disc({purchaseData.totalDiscount}%)</div>
              <div>{discountAmount ? discountAmount : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> Total GST({purchaseData.totalGST}%)</div>
              <div>{gstAmount ? Math.round(gstAmount) : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> Rounded Price: </div>
              <div>{fractionalPart.toFixed(1)}</div>
            </div>
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>GRAND TOTAL</div>
              <div>{grandTotal ? grandTotal : "0.00"}</div>
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
