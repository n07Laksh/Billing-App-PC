import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dexie from 'dexie'
import TextField from '@mui/material/TextField';

import { ToastContainer, toast } from 'react-toastify';

import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import RightArrow from "../images/arrow.png"
import Add from "../images/add.png"
import SaveIcon from '@mui/icons-material/Save';

import 'react-toastify/dist/ReactToastify.css';

function PurchaseInvoice() {
  const navigate = useNavigate();
  const tableDiv = useRef(); // table parent div
  const user = JSON.parse(localStorage.getItem("userData"));
  const GSTIN = localStorage.getItem("GSTIN");

  const [total, setTotal] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(null);
  const [isZero, setIsZero] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(null);
  const [gstAmount, setGstAmount] = useState(null);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [totalOriginalAmount, setTotalOriginalAmount] = useState(0);
  const [totalOriginalGSTAmount, setTotalGSTOriginalAmount] = useState(0);
  const [fractionalPart, setFractionalPart] = useState(0);


  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;


  const [purchaseData, setPurchaseData] = useState({
    invoiceType: "GST",
    supplierName: "",
    billNum: "",
    payMode: "Cash",
    today: formattedDate,
    purchaseItem: []
  });

  const [addedItems, setAddedItems] = useState({
    name: "",
    unit: "KG",
    quantity: "",
    purchasePrice: "",
    salePrice: "",
    disc: "",
    gst: GSTIN ? 18 : 0,
    amount: "",
    date: "",
  });

  useEffect(() => {
    // Calculate total based on updated addedItems
    const newTotal = purchaseData.purchaseItem.reduce((sub, item) => {
      return sub + Number(item.amount);
    }, 0);

    setTotal(newTotal);
    setGrandTotal(newTotal);

    tableDiv.current.scrollTop = tableDiv.current.scrollHeight;
  }, [addedItems]);

  // calculate discount and auto fill for sale amount
  useEffect(() => {
    const itemAmount = addedItems.quantity * addedItems.purchasePrice;
    if (addedItems.disc) {
      const discountedAmt = itemAmount - (itemAmount * addedItems.disc) / 100;
      addedItems.disc == "100" || discountedAmt <= 0 ? addedItems.amount = 0 : addedItems.amount = Math.round(discountedAmt);
      addedItems.amount = Math.round(discountedAmt);
      setIsZero(true);
      setOriginalAmount(Math.round(discountedAmt))
    } else {
      setOriginalAmount(itemAmount);
      addedItems.amount = itemAmount;
      setIsZero(true);
    }

  }, [addedItems.purchasePrice, addedItems.quantity, addedItems.disc, purchaseData.invoiceType]);


  useEffect(() => {
    // Ensure addedItems.gst is a valid number
    const gstPercentage = parseFloat(addedItems.gst);
    if (purchaseData.invoiceType === "GST") {

      // Check if gstPercentage is a valid number between 0 and 100 (inclusive)
      if (!isNaN(gstPercentage) && gstPercentage >= 0 && gstPercentage <= 100) {
        const gstAmount = (originalAmount * gstPercentage) / 100;
        const newAmount = originalAmount + gstAmount;

        // Update addedItems.amount and the state
        addedItems.amount = Math.round(newAmount);
      } else {

        addedItems.amount = Math.round(originalAmount);
      }
    } else {
      addedItems.gst = 0;
    }
  }, [addedItems.gst, originalAmount, purchaseData.invoiceType]);


  // const storeDB = new Dexie(`store_${user.name}`);
  const storeDB = new Dexie(`store`);
  storeDB.version(4).stores({
    items: "name", // collection with keyPath name and
  })

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
    ); searchItemName
    setFilteredStore(filteredItems);
  };


  const saleItemChange = (event) => {
    if (event.target.name === "name") {
      setAddedItems({
        ...addedItems,
        [event.target.name]: event.target.value,
      })
      searchItemName(event.target.value);
    } else {
      setAddedItems({
        ...addedItems,
        [event.target.name]: event.target.value,
      })
    }
  }

  const inputChange = (event) => {
    setPurchaseData({
      ...purchaseData,
      [event.target.name]: event.target.value,
    });
  };



  const addSaleItem = () => {

    if (addedItems.name && addedItems.quantity && addedItems.purchasePrice && isZero && purchaseData.supplierName) {
      // setAddedItems([...addedItems, purchaseData]);
      const updatedSaleItem = [...purchaseData.purchaseItem];
      updatedSaleItem.push(addedItems);

      setPurchaseData(prevData => ({
        ...prevData,
        purchaseItem: updatedSaleItem
      }));

      setAddedItems(prevData => ({
        ...prevData,
        name: "",
        quantity: "",
        purchasePrice: "",
        salePrice: "",
        disc: "",
        amount: ""
      }));

    } else {
      toast.error("require fields are not empty");
    }
  };



  // const db = new Dexie(`purchase_${user.name}`);
  const db = new Dexie(`purchase`);

  // Define the schema including the new collection
  db.version(4).stores({
    // itemData: 'productName', // Existing collection
    purchaseData: '++id,billNum,supplierName,date', // New collection
  });


  // const dailyPurchase = new Dexie(`dailyPurchase_${user.name}`);
  const dailyPurchase = new Dexie(`dailyPurchase`);
  dailyPurchase.version(5).stores({
    purchases: '++id,supplierName', //'++id' is an auto-incremented unique identifier
  });



  const savePurchase = async () => {
    if (purchaseData.purchaseItem.length > 0) {
      try {
        // Add entire purchaseData to db.purchaseData and dailyPurchase.purchases
        await db.purchaseData.add(purchaseData);
        await dailyPurchase.purchases.add(purchaseData);

        // Map and add all objects from purchaseData.purchaseItem to storeDB
        await Promise.all(purchaseData.purchaseItem.map(async item => {
          try {
            if (item.name && item.quantity && item.purchasePrice) {
              const itemNameLowerCase = item.name.toLowerCase();
              const existingItem = await storeDB.items.get(itemNameLowerCase);
              if (existingItem) {
                // If the item exists, update its quantity by adding the new quantity
                existingItem.quantity = Number(existingItem.quantity) + Number(item.quantity);
                existingItem.purchasePrice = item.purchasePrice;
                existingItem.salePrice = item.salePrice;
                existingItem.unit = item.unit;
                await storeDB.items.put(existingItem);
              } else {
                // If the item doesn't exist, create a new record
                const storeData = {
                  name: itemNameLowerCase,
                  quantity: item.quantity,
                  salePrice: item.salePrice,
                  purchasePrice: item.purchasePrice,
                  unit: item.unit,
                };
                await storeDB.items.put(storeData);
              }
            } else {
              toast.warn('Please fill in all required fields for the purchase item.');
            }
          } catch (error) {
            console.error('Error adding/updating item in storeDB:', error);
            toast.error('Error adding/updating item in storeDB: ' + error.message);
          }
        }));

        // Clear purchaseData after successful addition
        setPurchaseData(prevPurchaseData => ({
          ...prevPurchaseData,
          purchaseItem: []
        }));

        toast.success('Purchase data Saved successfully');
      } catch (error) {
        console.error('Error adding purchase data:', error);
        toast.error('Error adding purchase data: ' + error.message);
      }
    } else {
      toast.warn('Add Sale Details');
    }
  };


  const handleDeleteItem = (index) => {
    const updatedItems = [...purchaseData.purchaseItem];
    updatedItems.splice(index, 1); // Remove the item at the specified index
    setPurchaseData(prevData => ({
      ...prevData,
      purchaseItem: updatedItems // Update purchaseItem without wrapping in an extra array
    }));
  };



  // const nameHandle = (event) => {
  //   const { name, value } = event.target;
  //   const lowercaseValue = ['name'].includes(name) ? value.toLowerCase() : value;

  //   setPurchaseData((prevData) => ({
  //     ...prevData,
  //     [name]: lowercaseValue,
  //   }));

  //   searchItemName(value);

  // };

  // Function to handle item selection
  const handleItemClick = (item) => {
    setAddedItems({ ...addedItems, name: item.name, purchasePrice: item.purchasePrice, salePrice: item.salePrice });
    setFilteredStore([])
  };

  const handleNewInvoice = () => {
    setPurchaseData(prevData => ({
      ...prevData,
      supplierName: "",
      billNum: "",
      purchaseItem: []

    }));
    setAddedItems(prevData => ({
      ...prevData,
      name: "",
      quantity: "",
      salePrice: "",
      purchasePrice: "",
      disc: "",
      amount: "",
      date: "",
    }))
  }

  console.log("PURCHASE DATA", purchaseData);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
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

        <Paper
          sx={{
            padding: "11px",
          }}
          className='nav-paper'
        >
          <div className="user-paper">
            <span className="back" onClick={() => navigate(-1)}>
              <img src={RightArrow} width="100%" alt="" />
            </span>
            <span className="">Purchase</span>
            <div onClick={handleNewInvoice} style={{ width: "25px" }}>
              <img width="100%" src={Add} alt="New Invoice" />
            </div>
          </div>
        </Paper>

        <div className="user-info">
          {GSTIN &&
            <div>
              <select
                onChange={inputChange}
                id="invoice-type"
                name="invoiceType"
                value={purchaseData.invoiceType}
                className="w-100"
              >
                <option value="NoGST">No GST</option>
                <option value="GST">GST</option>
              </select>
            </div>
          }

          <div>
            <TextField
              id="standard-basic"
              label="Supplier Name*"
              variant="standard"
              name="supplierName"
              onChange={inputChange}
              className="w-100"
              InputLabelProps={{
                style: { paddingLeft: '10px' } // Adjust the padding value as needed
              }}
            />
            {/* <input type="text" name="supplierName" id="supplierName" value={purchaseData.supplierName} onChange={nameSuppHandle} /> */}
          </div>

          <div className="d-flex justify-content-between gap-1">
            <div>
              <input
                onChange={inputChange}
                type="date"
                value={addedItems.date ? addedItems.date : formattedDate}
                name="date"
                className="date"
                style={{ width: "120px" }}
              // max={currentDate}
              />
            </div>

            <div>
              <input type="number" name="billNum" className="billNum" value={purchaseData.billNum} onChange={inputChange} placeholder="Bill no." />
            </div>

          </div>

        </div>



        <div className="item-section mb-5">
          <div className="position-relative">
            <TextField
              id="standard-basic"
              label="Product Name*"
              variant="standard"
              className="w-100"
              name="name"
              value={addedItems.name}
              onChange={saleItemChange}
              InputLabelProps={{
                style: { paddingLeft: '10px' } // Adjust the padding value as needed
              }}
            />
            <div className="result_item">
              {/* Display the filtered results as a list of names */}
              <ul className="list-group">
                {filteredStore.map((item) => (
                  <li className="list-group-item" style={{ padding: "12px", textTransform: "capitalize" }} key={item.name} onClick={() => handleItemClick(item)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fields-inp">
            <div className="input-fileds">
              <select
                onChange={saleItemChange}
                id="unit"
                name="unit"
                value={addedItems.unit}
                className="unit-select"
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
            <div className="input-fileds">
              <input
                onChange={saleItemChange}
                type="number"
                id="quantity"
                className="quantity"
                name="quantity"
                value={addedItems.quantity}
                placeholder="Quantity*"
              />
            </div>
          </div>

          <div className="fields-inp" >
            <div className="input-fileds">
              <input
                onChange={saleItemChange}
                type="number"
                id="purchase-price"
                className="purchase-price"
                name="purchasePrice"
                value={addedItems.purchasePrice}
                placeholder="Purchase price*"
              />
            </div>

            <div className="input-fileds">
              <input
                onChange={saleItemChange}
                type="number"
                id="sale-price"
                className="sale-price sale-inp"
                name="salePrice"
                value={addedItems.salePrice}
                placeholder="Sale price"
              />
            </div>
          </div>

          <div className="fields-inp">
            <div className="input-fileds">
              <input
                onChange={saleItemChange}
                type="number"
                id="disc"
                className={`disc sale-inp ${GSTIN ? "" : "w-100"}`}
                name="disc"
                value={addedItems.disc}
                placeholder=" Discount %"
              />
            </div>
            {GSTIN &&
              <div className="input-fileds">
                <span className="percent-div"> GST%</span>
                <input
                  onChange={saleItemChange}
                  type="number"
                  id="gst"
                  className="gst"
                  name="gst"
                  value={addedItems.gst}
                  disabled={purchaseData.invoiceType === "NoGST"}
                />
              </div>
            }
          </div>
        </div>
        {addedItems.amount > 0 &&
          <div className="d-flex justify-content-center mb-5">
            <Fab
              sx={{
                width: "90%",
                height: "40px",
                display: "flex",
                justifyContent: "space-between"
              }}
              onClick={addSaleItem}
              variant="extended">
              <div className="ms-4 fw-bold"> {addedItems.amount ? addedItems.amount : ''} </div>
              <div style={{ width: "33px" }}>
                <img className="w-100" src={RightArrow} alt="" />
              </div>

            </Fab>
          </div>
        }

        {/* div for spacing */}
        <div className="d-block space-div "></div>

        {/* add item list */}
        <div ref={tableDiv} className="item-list-parent border">
          <table className="table caption-top text-center ">
            <thead className="table-info">
              <tr>
                <th className="name-head" scope="col">
                  Name
                </th>
                <th scope="col">Qty.</th>
                <th scope="col">Unit</th>
                <th scope="col">Rate</th>
                <th scope="col">Disc.%</th>
                <th scope="col">Tax%</th>
                <th scope="col">Rate</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.purchaseItem.map((item, index) => (
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

        <div className="sale-invoice-footer w-100">
          <div className="w-100 px-3">
            <div className="w-100">
              <select
                onChange={inputChange}
                id="payMode"
                name="payMode"
                value={purchaseData.payMode}
                className="w-100"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI (Online Payment)</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card Payment</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>

          </div>

          <div className="print-save mt-5">
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>Sub-Total</div>
              <div>{total ? total : "0.00"}</div>
            </div>
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>GRAND TOTAL</div>
              <div>{grandTotal ? grandTotal : "0.00"}</div>
            </div>


          </div>
          <div className="text-center my-3">
            <Fab
              sx={{
                height: "40px",
                margin: "10px 0",
                width: "50%",
                zIndex: "1",

              }}
              onClick={savePurchase}
              variant="extended">
              <SaveIcon sx={{ mr: 2 }} />
              Save
            </Fab>
          </div>
        </div>


      </div>
    </>
  );
}

export default PurchaseInvoice;
