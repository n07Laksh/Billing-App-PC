import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dexie from "dexie";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function PurchaseInvoice() {
  const navigate = useNavigate();
  const tableDiv = useRef(); // table parent div
  const user = JSON.parse(localStorage.getItem("userData"));
  const GSTIN = localStorage.getItem("GSTIN");

  const [total, setTotal] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isZero, setIsZero] = useState(false);
  const [originalAmount, setOriginalAmount] = useState(0);

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const [purchaseData, setPurchaseData] = useState({
    invoiceType: GSTIN?"GST":"NoGST",
    supplierName: "",
    billNum: "",
    payMode: "Cash",
    today: formattedDate,
    totalDiscount: "",
    totalGST: "",
    purchaseItem: [],
  });

  const [addedItems, setAddedItems] = useState({
    name: "",
    unit: "KG",
    quantity: "",
    purchasePrice: "",
    salePrice: "",
    disc: "",
    gst: purchaseData.invoiceType==="GST"?18:0,
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

  // calculate the paid amount from clent (return or give)
  const checkPaid = (event) => {
    const val = event.target.value;

    if (val.length) {
      setBalance(total - val);
    } else {
      setBalance(0);
    }
  };

  useEffect(() => {
    const itemAmount = addedItems.quantity * addedItems.purchasePrice;
    if (addedItems.disc) {
      const discountedAmt = itemAmount - (itemAmount * addedItems.disc) / 100;
      addedItems.disc == "100" || discountedAmt <= 0
        ? setAmount(0)
        : setAmount(Math.round(discountedAmt));
      addedItems.amount = Math.round(discountedAmt);
      setIsZero(true);
      setOriginalAmount(Math.round(discountedAmt));
    } else {
      setOriginalAmount(itemAmount);
      setAmount(itemAmount);
      addedItems.amount = itemAmount;
      setIsZero(true);
    }
  }, [
    addedItems.purchasePrice,
    addedItems.quantity,
    addedItems.disc,
    purchaseData.invoiceType,
  ]);

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
        setAmount(newAmount);
      } else {
        addedItems.amount = Math.round(originalAmount);
        setAmount(originalAmount);
      }
    } else {
      addedItems.gst = 0;
    }
  }, [addedItems.gst, originalAmount, purchaseData.invoiceType]);


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
    searchItemName;
    setFilteredStore(filteredItems);
  };

  const saleItemChange = (event) => {
    if (event.target.name === "name") {
      setAddedItems({
        ...addedItems,
        [event.target.name]: event.target.value,
      });
      searchItemName(event.target.value);
    } else {
      setAddedItems({
        ...addedItems,
        [event.target.name]: event.target.value,
      });
    }
  };

  const inputChange = (event) => {
    setPurchaseData({
      ...purchaseData,
      [event.target.name]: event.target.value,
    });
  };

  const addSaleItem = () => {
    if (
      addedItems.name &&
      addedItems.quantity &&
      addedItems.purchasePrice &&
      isZero &&
      purchaseData.supplierName
    ) {
      const existingItemIndex = purchaseData.purchaseItem.findIndex(
        (item) => item.name === addedItems.name
      );

      if (existingItemIndex !== -1) {
        const updatedPurchaseItem = purchaseData.purchaseItem.map((item) => {
          if (item.name === addedItems.name) {
            return {
              ...item,
              quantity:
                parseFloat(item.quantity) + parseFloat(addedItems.quantity),
              // Update other properties if needed
            };
          }
          return item;
        });

        setPurchaseData((prevData) => ({
          ...prevData,
          purchaseItem: updatedPurchaseItem,
        }));
      } else {
        // If the item doesn't exist, add it to the purchaseItem array
        setPurchaseData((prevData) => ({
          ...prevData,
          purchaseItem: [...prevData.purchaseItem, addedItems],
        }));
      }

      // Reset addedItems fields
      setAddedItems((prevData) => ({
        ...prevData,
        name: "",
        quantity: "",
        purchasePrice: "",
        salePrice: "",
        disc: "",
        amount: "",
      }));
    } else {
      toast.error("Required fields are not filled");
    }
  };

  const db = new Dexie(`purchase_${user.name}`);

  // Define the schema including the new collection
  db.version(4).stores({
    purchaseData: "++id,billNum,today,supplierName,date", // New collection
  });

  const storeDB = new Dexie(`store_${user.name}`);
  storeDB.version(4).stores({
    items: "name", // collection with keyPath name and
  });

  const dailyPurchase = new Dexie(`dailyPurchase_${user.name}`);
  dailyPurchase.version(5).stores({
    purchases: "++id,today,supplierName", //'++id' is an auto-incremented unique identifier
  });

  const savePurchase = async () => {
    if (purchaseData.purchaseItem.length > 0) {
      try {
        // Add entire purchaseData to db.purchaseData and dailyPurchase.purchases
        await db.purchaseData.add(purchaseData);
        await dailyPurchase.purchases.add(purchaseData);

        // Map and add all objects from purchaseData.purchaseItem to storeDB
        await Promise.all(
          purchaseData.purchaseItem.map(async (item) => {
            try {
              if (item.name && item.quantity && item.purchasePrice) {
                const itemNameLowerCase = item.name.toLowerCase();
                const existingItem = await storeDB.items.get(itemNameLowerCase);
                if (existingItem) {
                  // If the item exists, update its quantity by adding the new quantity
                  existingItem.quantity =
                    Number(existingItem.quantity) + Number(item.quantity);
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
                toast.warn(
                  "Please fill in all required fields for the purchase item."
                );
              }
            } catch (error) {
              console.error("Error adding/updating item in storeDB:", error);
              toast.error(
                "Error adding/updating item in storeDB: " + error.message
              );
            }
          })
        );

        // Clear purchaseData after successful addition
        setPurchaseData((prevPurchaseData) => ({
          ...prevPurchaseData,
          purchaseItem: [],
        }));

        toast.success("Purchase data Saved successfully");
      } catch (error) {
        console.error("Error adding purchase data:", error);
        toast.error("Error adding purchase data: " + error.message);
      }
    } else {
      toast.warn("Add Sale Details");
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...purchaseData.purchaseItem];
    updatedItems.splice(index, 1); // Remove the item at the specified index
    setPurchaseData((prevData) => ({
      ...prevData,
      purchaseItem: updatedItems, // Update purchaseItem without wrapping in an extra array
    }));
  };

  // Function to handle item selection
  const handleItemClick = (item) => {
    setAddedItems({
      ...addedItems,
      name: item.name,
      purchasePrice: item.purchasePrice,
      salePrice: item.salePrice,
    });
    setFilteredStore([]);
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
          <span className="back" onClick={() => navigate(-1)}>
            &larr;
          </span>
          <span className="mx-5 h6">Purchase Item</span>
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
              disabled={!GSTIN}
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
            <input
              type="text"
              name="supplierName"
              id="supplierName"
              value={purchaseData.supplierName}
              onChange={inputChange}
            />
          </div>

          <div>
            <label htmlFor="billDate" className="lable-txt">
              Bill Date
            </label>
            <br />
            <input
              onChange={inputChange}
              type="date"
              value={purchaseData.date ? purchaseData.date : formattedDate}
              name="date"
              className="date"
            />
          </div>

          <div>
            <label htmlFor="billNum" className="lable-txt">
              Purchase Bill No.
            </label>
            <br />

            <input
              type="number"
              name="billNum"
              className="billNum"
              value={purchaseData.billNum}
              onChange={inputChange}
            />
          </div>
        </div>

        <div className="item-section mt-4 mx-4">
          <div>
            <label className="lable-txt" htmlFor="name">
              Name <span className="text-danger">*</span>
            </label>
            <br />
            <input
              onChange={saleItemChange}
              type="text"
              id="name"
              className="name"
              name="name"
              value={addedItems.name}
            />
            <div className="result_item">
              {/* Display the filtered results as a list of names */}
              <ul className="list-group">
                {filteredStore.map((item) => (
                  <li
                    className="list-group-item"
                    key={item.name}
                    onClick={() => handleItemClick(item)}
                  >
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
              onChange={saleItemChange}
              id="unit"
              name="unit"
              value={addedItems.unit}
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
              onChange={saleItemChange}
              type="number"
              id="quantity"
              className="quantity"
              name="quantity"
              value={addedItems.quantity}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="purchase-price">
              Purchase Price <span className="text-danger">*</span>
            </label>
            <br />
            <span className="ruppe-div">&#8377; </span>
            <input
              onChange={saleItemChange}
              type="number"
              id="purchase-price"
              className="purchase-price"
              name="purchasePrice"
              value={addedItems.purchasePrice}
            />
          </div>

          <div>
            <label className="lable-txt" htmlFor="sale-price">
              Sale Price
            </label>
            <br />
            <span className="ruppe-div">&#8377; </span>
            <input
              onChange={saleItemChange}
              type="number"
              id="sale-price"
              className="sale-price"
              name="salePrice"
              value={addedItems.salePrice}
            />
          </div>

          <div>
            <label className="lable-txt" htmlFor="disc">
              Disc %
            </label>
            <br />
            <span className="percent-div"> % </span>
            <input
              onChange={saleItemChange}
              type="number"
              id="disc"
              className="disc"
              name="disc"
              value={addedItems.disc}
            />
          </div>
          <div>
            <label className="lable-txt" htmlFor="gst">
              GST %
            </label>
            <br />
            <span className="percent-div"> % </span>
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

          <div>
            <label className="lable-txt" htmlFor="amount">
              Amount <span className="text-danger">*</span>
            </label>
            <br />
            <span className="ruppe-div"> &#8377; </span>
            <input
              onChange={saleItemChange}
              type="number"
              id="amount"
              className="amount"
              name="amount"
              value={amount ? amount : addedItems.amount}
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
                    <button
                      className="border border-light bg-danger text-light"
                      onClick={() => handleDeleteItem(index)}
                    >
                      X
                    </button>
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
                <label
                  className="lable-txt calc-amount-txt"
                  htmlFor="paidAmount"
                >
                  Amount Paid
                </label>
                <input onChange={checkPaid} type="number" name="paidAmount" />
              </div>
              <div>
                <label className="lable-txt calc-amount-txt" htmlFor="bal">
                  Balance
                </label>
                <input type="text" name="bal" disabled value={balance} />
              </div>
            </div>
          </div>

          <div className="print-save">
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>Sub-Total</div>
              <div>{total ? total : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> Rounded Price: </div>
              <div>
              {/* {fractionalPart.toFixed(1)} */}
              0</div>
            </div>
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>GRAND TOTAL</div>
              <div>{grandTotal ? grandTotal : "0.00"}</div>
            </div>

            <button
              onClick={savePurchase}
              className="btn btn-sm btn-primary mt-2 w-75"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchaseInvoice;
