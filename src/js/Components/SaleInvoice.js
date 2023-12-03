import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopDetails from "./ShopDetails";
import CustomerDetails from "./CustomerDetails";
import SaleDetails from "./SaleDetails";
import Dexie from "dexie";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function SaleInvoice() {
  const navigate = useNavigate();
  const tableDiv = useRef(); // table parent div
  const user = JSON.parse(localStorage.getItem("userData"));

  const [total, setTotal] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(null);
  const [isZero, setIsZero] = useState(false);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(null);
  const [gstAmount, setGstAmount] = useState(null);
  const [totalOriginalAmount, setTotalOriginalAmount] = useState(0);
  const [fractionalPart, setFractionalPart] = useState(0);
  const [soldQuantitie, setSoldQuantitie] = useState({});



  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  // const [saleData, setSaleData] = useState({
  //   invoiceType: "GST",
  //   invoiceNum: "",
  //   clientName: "",
  //   clientContact: "",
  //   clientAddress: "",
  //   name: "",
  //   unit: "KG",
  //   quantity: "",
  //   salePrice: "",
  //   disc: "",
  //   gst: 18,
  //   amount: "",
  //   payMode: "Cash",
  //   date: "",
  //   today: formattedDate,
  //   totalGST: "",
  //   totalDiscount: "",
  // });

  const [saleData, setSaleData] = useState({
    invoiceType: "GST",
    invoiceNum: "",
    clientName: "",
    clientContact: "",
    clientAddress: "",
    payMode: "Cash",
    today: formattedDate,
    saleItem: []
  });

  const [addedItems, setAddedItems] = useState({
    name: "",
    unit: "KG",
    quantity: "",
    salePrice: "",
    disc: "",
    gst: 18,
    // gst: GSTIN ? 18 : 0,
    amount: "",
    date: "",
  });


  useEffect(() => {
    // Calculate total based on updated addedItems
    const newTotal = saleData.saleItem.reduce((sub, item) => {
      return sub + Number(item.amount);
    }, 0);
    setTotal(newTotal);
    setGrandTotal(newTotal);

    tableDiv.current.scrollTop = tableDiv.current.scrollHeight;
  }, [addedItems, saleData]);

  // calculate the paid amount from client (return or give)
  const checkPaid = (event) => {
    const val = event.target.value;

    if (val.length) {
      setBalance(total - val);
    } else {
      setBalance(0);
    }
  };

  // calculate discount and auto fill for sale amount
  // useEffect(() => {
  //   const itemAmount = saleData.quantity * saleData.salePrice;
  //   if (saleData.disc) {
  //     const discountedAmt = itemAmount - (itemAmount * saleData.disc) / 100;
  //     saleData.disc == "100" || discountedAmt <= 0
  //       ? setAmount(0)
  //       : setAmount(Math.round(discountedAmt));
  //     saleData.amount = Math.round(discountedAmt);
  //     setIsZero(true);
  //     setOriginalAmount(Math.round(discountedAmt));
  //   } else {
  //     setOriginalAmount(itemAmount);
  //     setAmount(itemAmount);
  //     saleData.amount = itemAmount;
  //     setIsZero(true);
  //   }
  // }, [
  //   saleData.salePrice,
  //   saleData.quantity,
  //   saleData.disc,
  //   saleData.invoiceType,
  // ]);

    // calculate discount and auto fill for sale amount
    useEffect(() => {
      const itemAmount = addedItems.quantity * addedItems.salePrice;
      if (addedItems.disc) {
        const discountedAmt = itemAmount - (itemAmount * addedItems.disc) / 100;
        addedItems.disc == "100" || discountedAmt <= 0 
                ? setAmount(0)
                : setAmount(Math.round(discountedAmt));
        addedItems.amount = Math.round(discountedAmt);
        setIsZero(true);
        setOriginalAmount(Math.round(discountedAmt))
      } else {
        setOriginalAmount(itemAmount);
        setAmount(itemAmount);
        addedItems.amount = itemAmount;
        setIsZero(true);
      }
    }, [addedItems.salePrice, addedItems.quantity, addedItems.disc, saleData.invoiceType,]);





  // useEffect(() => {
  //   if (saleData.invoiceType === "GST") {
  //     const gstPercentage = parseFloat(saleData.gst);

  //     // Check if gstPercentage is a valid number between 0 and 100 (inclusive)
  //     if (!isNaN(gstPercentage) && gstPercentage >= 0 && gstPercentage <= 100) {
  //       const gstAmount = (originalAmount * gstPercentage) / 100;
  //       const newAmount = originalAmount + gstAmount;

  //       // Update purchaseData.amount and the state
  //       saleData.amount = Math.round(newAmount);
  //       setAmount(saleData.amount);
  //     } else {
  //       saleData.amount = Math.round(originalAmount);
  //       setAmount(originalAmount);
  //     }
  //   } else {
  //     saleData.gst = 0;
  //   }
  // }, [saleData.gst, originalAmount, saleData.invoiceType]);

  useEffect(() => {
    // Ensure purchaseData.gst is a valid number
    const gstPercentage = parseFloat(addedItems.gst);
    if (saleData.invoiceType === "GST") {

      // Check if gstPercentage is a valid number between 0 and 100 (inclusive)
      if (!isNaN(gstPercentage) && gstPercentage >= 0 && gstPercentage <= 100) {
        // Calculate the GST amount
        const gstAmount = (originalAmount * gstPercentage) / 100;

        // Calculate the new total with GST
        const newAmount = originalAmount + gstAmount;

        // Update purchaseData.amount and the state
        addedItems.amount = Math.round(newAmount);
        setAmount(newAmount);
      } else {
        addedItems.amount = Math.round(originalAmount);
        setAmount(originalAmount);
        // Handle the case where the GST percentage is invalid
      }
    } else {
      addedItems.gst = 0;
    }
  }, [addedItems.gst, originalAmount, saleData.invoiceType]);



  const storeDB = new Dexie(`store_${user.name}`);
  storeDB.version(4).stores({
    items: "name", // collection with keyPath name and
  });

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
    setSaleData({
      ...saleData,
      [event.target.name]: event.target.value,
    });
  };

  

    // Function to filter store based on input value
    const searchItemName = (value) => {
      if (value.length > 0) {
        const filteredItems = store.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStore(filteredItems);
      } else {
        setFilteredStore([]);
      }
    };

    const [allItem, setAllItems] = useState(null);
    useEffect(() => {
      const allAvailItems = async () => {
        return await storeDB.items.toArray();
      };
      allAvailItems().then((data) => {
        setAllItems(data);
      });
    }, []);



  useEffect(() => {
    // Ensure purchaseData.totalDiscount is a valid number
    const discountPercentage = parseFloat(saleData.totalDiscount);

    // Check if discountPercentage is a valid number between 1 and 99 (as per your min and max)
    if (
      !isNaN(discountPercentage) &&
      discountPercentage >= 0 &&
      discountPercentage <= 100
    ) {
      const discountAmount = (total * discountPercentage) / 100;
      setDiscountAmount(discountAmount); // Assuming you have state to store the discount amount
      const totalDiscounted = total - discountAmount;
      setGrandTotal(totalDiscounted);
      setTotalOriginalAmount(totalDiscounted);
    } else {
      setTotalOriginalAmount(total);
      // Handle the case where the discount percentage is invalid
      setDiscountAmount(0); // Set discount amount to 0
      setGrandTotal(total); // Set grand total to the original total
    }
  }, [saleData.totalDiscount]);

  useEffect(() => {
    // Ensure purchaseData.totalGST is a valid number
    const gstPercentage = parseFloat(saleData.totalGST);

    if (saleData.totalDiscount) {
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
    } else {
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
  }, [saleData.totalGST]);



  // const addSaleItem = async () => {
  //   if (
  //     saleData.name &&
  //     saleData.quantity &&
  //     saleData.salePrice &&
  //     isZero &&
  //     saleData.clientName
  //   ) {
  //     // Create a map to track the sold quantities for each item
  //     const soldQuantities = {};

  //     const itemName = saleData.name.toLowerCase();
  //     // const existingItem = await storeDB.items.get(itemName);

  //     const existingQuantity =
  //       parseFloat(allItem.find((item) => item.name === itemName)?.quantity) ||
  //       0;
  //     const itemIndex = allItem.findIndex((item) => item.name === itemName);
  //     const soldQuantity = parseFloat(saleData.quantity);

  //     if (existingQuantity > 0) {
  //       if (existingQuantity >= soldQuantity) {
  //         if (itemIndex !== -1) {
  //           allItem[itemIndex].quantity = existingQuantity - soldQuantity;
  //         }
  //         soldQuantities[itemName] = soldQuantity;

  //         const index = addedItems.findIndex(
  //           (item) => item.name === saleData.name
  //         );

  //         if (index !== -1) {
  //           addedItems[index] = { ...addedItems[index], ...saleData };
  //         } else {
  //           setAddedItems((prevAddedItems) => [...prevAddedItems, saleData]);
  //         }

  //         setSaleData({
  //           ...saleData,
  //           name: "",
  //           unit: "KG",
  //           quantity: "",
  //           salePrice: "",
  //           disc: "",
  //           gst: "18",
  //           amount: "",
  //         });
  //       } else {
  //         toast.error(`Error: Not enough ${itemName}(s) in stock.`);
  //         return; // Exit the function if any item is not available
  //       }
  //     } else {
  //       toast.error(`Item ${itemName} has an empty quantity in the store.`);
  //       return false; // Reject promise if item has empty quantity
  //     }

  //     setSoldQuantitie(soldQuantities);
  //   } else {
  //     toast.error("require fields are not empty");
  //   }
  // };




  const addSaleItem = async () => {
    const { name, quantity, salePrice, amount } = addedItems;

    if (name && quantity && salePrice && isZero && saleData.clientName) {
      const itemName = name.toLowerCase();
      const existingQuantity = parseFloat(allItem.find(item => item.name.toLowerCase() === itemName)?.quantity) || 0;
      const itemIndex = allItem.findIndex(item => item.name.toLowerCase() === itemName);
      const soldQuantity = parseFloat(quantity);

      if (existingQuantity > 0) {
        if (existingQuantity >= soldQuantity) {
          if (itemIndex !== -1) {
            allItem[itemIndex].quantity = (existingQuantity - soldQuantity);
            const updatedSaleItem = [...saleData.saleItem];
            const existingItemIndex = updatedSaleItem.findIndex(item => item.name.toLowerCase() === itemName);

            if (existingItemIndex !== -1) {
              // Update the existing item quantity by adding the new quantity
              updatedSaleItem[existingItemIndex].quantity += soldQuantity;
              updatedSaleItem[existingItemIndex].amount += amount;
            } else {
              // Add the new item if not found
              updatedSaleItem.push({
                ...addedItems,
                quantity: soldQuantity // Set the new quantity
              });
            }

            // Update saleData with the modified saleItem array
            setSaleData(prevSaleData => ({
              ...prevSaleData,
              saleItem: updatedSaleItem
            }));
          }

          // Update soldQuantitie with sold quantities for each item
          setSoldQuantitie(prevSoldQuantitie => ({
            ...prevSoldQuantitie,
            [itemName]: (prevSoldQuantitie[itemName] || 0) + soldQuantity
          }));

          // Clear input fields
          setAddedItems(prevData => ({
            ...prevData,
            name: "",
            quantity: "",
            salePrice: "",
            disc: "",
            amount: "",
          }));

        } else {
          toast.error(`Error: Not enough ${itemName}(s) in stock.`);
          return; // Exit the function if any item is not available
        }
      } else {
        toast.error(`Item ${itemName} has an empty quantity in the store.`);
        return false; // Reject promise if item has an empty quantity
      }
    } else {
      toast.error("Required fields are not empty");
    }
  };






  const db = new Dexie(`sale_${user.name}`);

  // Define the schema including the new collection

  db.version(4).stores({
    saleItems: "++id,today,clientName,date", // New collection
  });

  const dailySale = new Dexie(`dailySale_${user.name}`);
  dailySale.version(5).stores({
    sales: "++id,today,clientName", //'++id' is an auto-incremented unique identifier
  });

  // // Define the handleSale function
  // const handleSale = async (salesItems) => {
  //   try {
  //     // Update the store items with the new quantities
  //     await storeDB.transaction("rw", storeDB.items, async () => {
  //       for (const itemName in salesItems) {
  //         const existingItem = await storeDB.items.get(itemName);
  //         existingItem.quantity -= salesItems[itemName];
  //         await storeDB.items.put(existingItem);
  //       }
  //     });

  //     // Display the remaining quantities for all items
  //     for (const itemName in salesItems) {
  //       const remainingQuantity = salesItems[itemName];
  //       toast.success(`Sold ${remainingQuantity} ${itemName}(s).`);
  //     }
  //   } catch (error) {
  //     toast.error("Error handling sale:", error);
  //   }
  // };


  // Define the handleSale function
  const handleSale = async (salesItems) => {
    try {
      // Update the store items with the new quantities
      await storeDB.transaction('rw', storeDB.items, async () => {
        for (const itemName in salesItems) {
          const existingItem = await storeDB.items.get(itemName);
          existingItem.quantity -= salesItems[itemName];
          await storeDB.items.put(existingItem);
        }
      });

      // Display the remaining quantities for all items
      // for (const itemName in salesItems) {
      //   const remainingQuantity = salesItems[itemName];
      //   // toast.success(`Sold ${remainingQuantity} ${itemName}(s).`);
      // }
    } catch (error) {
      toast.error('Error handling sale:', error);
    }
  };


  const updateItemInDB = async (item) => {
    try {
      // Update the item in saleItems database
      await db.saleItems.put(item);
      await dailySale.sales.put(item);
      return true; // Resolve promise if updated successfully
    } catch (error) {
      return false; // Reject promise if error occurred
    }
  };





  // const savePrint = async () => {
  //   if (addedItems.length > 0) {
  //     const promises = addedItems.map(async (item) => {
  //       try {
  //         // Add the item to the saleDB
  //         await db.saleItems.add(item);
  //         await dailySale.sales.add(item);

  //         return true; // Resolve promise if added successfully
  //       } catch (error) {
  //         return false; // Reject promise if error occurred
  //       }
  //     });

  //     const results = await Promise.all(promises);

  //     if (results.every((result) => result)) {
  //       // All promises resolved successfully, now call handleSale with the array of sold items
  //       window.print();
  //       handleSale(soldQuantitie);

  //       toast.success("Items added to collection");
  //       setAddedItems([]);
  //       setFractionalPart(0);
  //       setDiscountAmount(null);
  //       setGstAmount(null);
  //     } else {
  //       toast.error("Error adding item");
  //     }
  //   } else {
  //     toast.warn("Add Sale Details");
  //   }
  // };





  const savePrint = async () => {
    if (saleData.saleItem.length > 0) { // Assuming saleItem is a single object
      const result = await updateItemInDB(saleData);

      if (result) {
        // Update successful, perform actions here
        window.print();
        handleSale(soldQuantitie);

        toast.success('Item Saved Successfully!');
        setAddedItems([]);
        setDiscountAmount(null);
        setSaleData({
          invoiceType: "GST",
          invoiceNum: "",
          clientName: "",
          clientContact: "",
          clientAddress: "",
          today: formattedDate,
          saleItem: []
        });

      } else {
        toast.error('Error adding item');
      }
    } else {
      toast.warn('Add Sale Details');
    }
  };







  // Function to delete an item from addedItems by index
  // const handleDeleteItem = (index) => {
  //   const updatedItems = [...addedItems];
  //   updatedItems.splice(index, 1); // Remove the item at the specified index
  //   setAddedItems(updatedItems); // Update the state to reflect the deleted item
  // };
    // Function to delete an item from saleItem by index
    const handleDeleteItem = (index) => {
      const updatedItems = [...saleData.saleItem];
      updatedItems.splice(index, 1); // Remove the item at the specified index
      setSaleData(prevData => ({
        ...prevData,
        saleItem: updatedItems // Update saleItem without wrapping in an extra array
      }));
    };



  // useEffect(() => {
  //   // Function to get all data from indexeddb store collection
  //   async function getStore() {
  //     const storeData = await storeDB.items.toArray();
  //     storeData.length > 0 ? setStore(storeData) : setStore([]);
  //   }

  //   getStore();
  // }, []);

  // // Function to filter store based on input value
  // const searchItemName = (value) => {
  //   const filteredItems = store.filter((item) =>
  //     item.name.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredStore(filteredItems);
  // };

  // const nameHandle = (event) => {
  //   const { name, value } = event.target;
  //   const lowercaseValue = ["name"].includes(name)
  //     ? value.toLowerCase()
  //     : value;

  //   setSaleData((prevData) => ({
  //     ...prevData,
  //     [name]: lowercaseValue,
  //   }));

  //   searchItemName(value);
  // };















  // Function to handle item selection
  // const handleItemClick = (item) => {
  //   setSaleData({
  //     ...saleData,
  //     name: item.name,
  //     salePrice: item.salePrice,
  //     unit: item.unit,
  //   });
  //   setFilteredStore([]);
  // };


    // Function to handle item selection
    const handleItemClick = (item) => {
      setAddedItems({ ...addedItems, name: item.name, salePrice: item.salePrice ? item.salePrice : item.purchasePrice, unit: item.unit });
      setFilteredStore([])
    };









  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
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
        <div className="print-show">
          <div className="invoice text-center">
            <h6 className="text-center inv-txt mb-3">Invoice</h6>
          </div>
          <div className="d-flex justify-content-between gap-1 border">
            <div className="print-detail">
              <ShopDetails />
            </div>
            <div className="print-detail">
              <CustomerDetails saleData={saleData} />
            </div>
          </div>
        </div>
        <div className="back-div">
          <span className="back" onClick={() => navigate(-1)}>
            &larr;
          </span>
          <span className="mx-5 h6">Sale Invoice</span>
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
              value={saleData.invoiceType}
            >
              <option value="NoGST">No GST</option>
              <option value="GST">GST</option>
            </select>
          </div>

          <div>
            <label htmlFor="invoiceNum" className="lable-txt">
              Invoice No.<span className="text-danger mx-1">*</span>
            </label>
            <br />
            <input
              type="text"
              className="invoice-no"
              name="invoiceNum"
              value={saleData.invoiceNum}
              onChange={inputChange}
            />
          </div>

          <div>
            <label htmlFor="clientName" className="lable-txt">
              Client Name<span className="text-danger mx-1">*</span>
            </label>
            <br />
            <input
              type="text"
              name="clientName"
              id="clientName"
              value={saleData.clientName}
              onChange={inputChange}
            />
          </div>

          <div>
            <label htmlFor="clientContact" className="lable-txt">
              Contact Number
            </label>
            <br />
            <input
              type="text"
              name="clientContact"
              id="clientContact"
              value={saleData.clientContact}
              onChange={inputChange}
            />
          </div>

          <div>
            <label htmlFor="clientAddress" className="lable-txt">
              Client Address
            </label>
            <br />

            <input
              type="text"
              name="clientAddress"
              className="clientAddress"
              value={saleData.clientAddress}
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
              d="unit"
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
            <label className="lable-txt" htmlFor="sale-price">
              Sale Price <span className="text-danger">*</span>
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
              disabled={saleData.invoiceType === "NoGST" ? true : false}
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
        <div className=" space-div "></div>

        {/* add item list */}
        <div ref={tableDiv} className="item-list-parent">
          <table className="table table-bordered caption-top text-center ">
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
                <th className="sale_invoice_cut_item" scope="col">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody className="tbody-txt">
              {saleData.saleItem.map((item, index) => (
                <tr className="position-relative tbody-txt" key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.salePrice}</td>
                  <td>{item.disc === "" ? "0" : item.disc} %</td>
                  <td>{item.gst === "" ? "0" : item.gst} %</td>
                  <td>{item.amount}</td>
                  <td className="sale_invoice_cut_item">
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
              <label className="lable-txt" htmlFor="date">
                Date
              </label>
              <br />
              <input
                onChange={saleItemChange}
                type="date"
                value={addedItems.date ? addedItems.date : formattedDate}
                name="date"
                className="date"
                max={formattedDate}
              />
            </div>
            <div>
              <label className="lable-txt" htmlFor="payMode">
                Payment Mode
              </label>
              <br />
              <select
                onChange={inputChange}
                id="payMode"
                name="payMode"
                value={saleData.payMode}
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
            <div>
              <input
                onChange={inputChange}
                value={saleData.totalDiscount}
                type="number"
                name="totalDiscount"
                placeholder="Total Discount %"
                className="mt-4 sale-bottom-discount-pannel"
              />
              <input
                onChange={inputChange}
                value={saleData.totalGST}
                type="number"
                name="totalGST"
                placeholder="Total GST %"
                className="mt-2 sale-bottom-discount-pannel"
                disabled={saleData.invoiceType === "NoGST"}
              />
            </div>
          </div>

          <div className="print-save">
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>Sub-Total</div>
              <div>{total ? total : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> Total Disc({saleData.totalDiscount}%)</div>
              <div>{discountAmount ? discountAmount : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> SGST({saleData.totalGST}%)</div>
              <div>{gstAmount ? gstAmount : "0.00"}</div>
            </div>
            <div className="sub-total d-flex justify-content-between">
              <div> Rounded Price: </div>
              <div>{fractionalPart.toFixed(1)}</div>
            </div>
            <div className="sub-total-shelter d-flex justify-content-between">
              <div>GRAND TOTAL</div>
              <div>{grandTotal ? grandTotal.toFixed(0) : "0.00"}</div>
            </div>

            <button
              onClick={savePrint}
              className="btn btn-sm btn-primary mt-1 w-75"
            >
              Save & Print
            </button>
          </div>
        </div>

        <div className="sale-details">
          <SaleDetails
            total={total}
            discountAmount={discountAmount}
            gstAmount={gstAmount}
            fractionalPart={fractionalPart.toFixed(1)}
            grandTotal={grandTotal}
          />
        </div>
      </div>
    </>
  );
}

export default SaleInvoice;
