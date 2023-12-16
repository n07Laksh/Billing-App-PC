import Dexie from "dexie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Add from "../images/add.png";
import Edit from "../images/edit.png";
import Del from "../images/delete.png";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  margin: "0 auto",
  borderRadius: "15px",
  maxHeight: "500px",
  overflow: "auto",
};

const Stock = () => {
  const [originalStore, setOriginalStore] = useState([]);
  const [store, setStore] = useState([]);
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");

  const user = JSON.parse(localStorage.getItem("userData"));

  const db = new Dexie(`store_${user.name}`);
  db.version(4).stores({
    items: "name", // collection with keyPath name and
  });

  // function for get all data from indexeddb store collection
  async function getStore() {
    const storeData = await db.items.toArray();
    if (storeData.length > 0) {
      setOriginalStore(storeData);
      setStore(storeData);
    } else {
      setOriginalStore([]);
      setStore([]);
    }
  }
  useEffect(() => {
    getStore();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    try {
      if (searchKey.length !== 0) {
        const filter = originalStore.filter((item) => {
          return item.name === searchKey;
        });
        setStore(filter);
      } else {
        // If searchKey is empty, return the original data
        setStore(originalStore);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [updateDetails, setUpdateDetails] = useState({
    name: "",
    salePrice: "",
    purchasePrice: "",
    unit: "KG",
    quantity: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = useState(null);

  const handleOpen = (item) => {
    setItem(item);
    setUpdateDetails(item);
    setOpen(true);
  };

  const stockUpdate = (i) => {
    setEditOpen(true);
    setItem(i);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setOpenAddModal(false);
    setUpdateDetails({
      name: "",
      salePrice: "",
      purchasePrice: "",
      unit: "KG",
      quantity: "",
    });
    setItem(null);
  };

  const inputChange = (e) => {
    setUpdateDetails({ ...updateDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (item && item.name) {
      const itemToUpdate = await db.items.get(item.name);
      if (itemToUpdate) {
        const updatedItem = { ...itemToUpdate, ...updateDetails };
        await db.items.put(updatedItem);
        setUpdateDetails({
          name: "",
          salePrice: "",
          purchasePrice: "",
          unit: "KG",
          quantity: "",
        });
        setOpen(false);
        setEditOpen(false);
        toast.success(`Product updated successfully`);
        setItem(null);
      }
    } else {
      if (
        updateDetails.name &&
        updateDetails.purchasePrice &&
        updateDetails.salePrice &&
        updateDetails.quantity &&
        updateDetails.unit
      ) {
        try {
          const newUpdatedDetails = {
            ...updateDetails,
            name: updateDetails.name.toLocaleLowerCase().trim(),
          };
          await db.items.put(newUpdatedDetails);
          setUpdateDetails({
            name: "",
            salePrice: "",
            purchasePrice: "",
            unit: "KG",
            quantity: "",
          });
          setItem(null);
          setOpenAddModal(false);
          toast.success(`Product added successfully`);
        } catch (error) {
          toast.error(`Error while adding product`, error);
        }
      } else {
        toast.warning("Please fill all fields");
      }
    }

    getStore();
  };



  const [openAddModal, setOpenAddModal] = React.useState(false);

  const addStock = () => {
    setOpenAddModal(true);
  };


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const id = openPop ? "simple-popover" : undefined;

  const stockDel = async (itemName) => {
    try {
      await db.items.where("name").equalsIgnoreCase(itemName).delete();
      handleClose(false);
      getStore();
      setItem(null);
      toast.success(`'${itemName}' deleted successfully.`);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Stock not deleted try again");
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          {item && !editOpen ? (
            <Box sx={style}>
              <Typography
                sx={{
                  padding: "0 50px",
                }}
                className="border-bottom pb-2"
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="w-100 "
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="clent-name clent-names">{item.name}</div>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <span
                        onClick={() => stockUpdate(item)}
                        style={{
                          display: "inline-block",
                          width: "20px",
                          cursor: "pointer",
                        }}
                      >
                        <img title="Edit" src={Edit} width="100%" alt="" />
                      </span>
                      <div
                        aria-describedby={id}
                        variant="contained"
                        onClick={handlePopClick}
                        style={{
                          display: "inline-block",
                          width: "20px",
                          cursor: "pointer",
                        }}
                      >
                        <img src={Del} title="Delete" width="100%" alt="" />
                      </div>
                      <div>
                        <Popover
                          id={id}
                          open={openPop}
                          anchorEl={anchorEl}
                          onClose={handlePopClose}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <Typography sx={{ p: 2 }}>
                            <div>Are you sure you want to delete</div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: "10px",
                                margin: "10px 5px",
                                width: "100%",
                              }}
                            >
                              <div
                                className="text-light bg-danger"
                                style={{
                                  padding: "2px",
                                  float: "right",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                }}
                                onClick={() => stockDel(item.name)}
                              >
                                Delete
                              </div>
                            </div>
                          </Typography>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </Typography>

              <Typography
                id="transition-modal-description"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "21px",
                  mt: 2,
                  padding: "0 50px",
                  lineHeight: "1",
                }}
              >
                <div className="stock-item">
                  <div className="clent-tag fw-bolder">Sale Price</div>
                  <div className="clent-quote">
                    {item.salePrice ? item.salePrice : "00"}.00 ₹
                  </div>
                </div>
                <div className="stock-item">
                  <div className="clent-tag">Quantity</div>
                  <div className="quote">{item.quantity}</div>
                </div>
                <div className="stock-item">
                  <div className="clent-tag">Unit</div>
                  <div className="quote">{item.unit}</div>
                </div>
                <div className="stock-item">
                  <div className="clent-tag fw-bold">Purchase Price</div>
                  <div className="clent-quote ">{item.purchasePrice}.00 ₹</div>
                </div>
              </Typography>
            </Box>
          ) : (
            <Box sx={style}>
              {item && (
                <div className="edit-stock">
                  <label htmlFor="purchasePrice">Purchase Price</label>
                  <input
                    onChange={inputChange}
                    type="number"
                    name="purchasePrice"
                    id="purchasePrice"
                    placeholder="Purchase Price"
                    value={updateDetails.purchasePrice}
                  />
                  <label htmlFor="salePrice">Sale Price</label>
                  <input
                    onChange={inputChange}
                    type="number"
                    name="salePrice"
                    id="salePrice"
                    placeholder="Sale Price"
                    value={updateDetails.salePrice}
                  />
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    onChange={inputChange}
                    type="number"
                    name="quantity"
                    id="quantity"
                    placeholder="Quantity"
                    value={updateDetails.quantity}
                  />
                  <div className="input-fields">
                    <select
                      className="unit-select"
                      onChange={inputChange}
                      id="unit"
                      name="unit"
                      value={updateDetails.unit}
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
                  <button
                    onClick={handleUpdate}
                    className="btn w-100 btn-dark"
                    style={{ cursor: "pointer" }}
                  >
                    Save & Update
                  </button>
                </div>
              )}
            </Box>
          )}
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAddModal}>
          <Box sx={style}>
            <div className="edit-stock">
              <div className="text-center">
                <h4>Add Product</h4>
              </div>
              <label htmlFor="name">Name</label>
              <input
                onChange={inputChange}
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={updateDetails.name}
              />
              <label htmlFor="purchasePrice">Purchase Price</label>
              <input
                onChange={inputChange}
                type="number"
                name="purchasePrice"
                id="purchasePrice"
                placeholder="Purchase Price"
                value={updateDetails.purchasePrice}
              />
              <label htmlFor="salePrice">Sale Price</label>
              <input
                onChange={inputChange}
                type="number"
                name="salePrice"
                id="salePrice"
                placeholder="Sale Price"
                value={updateDetails.salePrice}
              />
              <label htmlFor="quantity">Quantity</label>
              <input
                onChange={inputChange}
                type="number"
                name="quantity"
                id="quantity"
                placeholder="Quantity"
                value={updateDetails.quantity}
              />
              <div className="input-fields">
                <label htmlFor=""></label>
                <select
                  className="unit-select"
                  onChange={inputChange}
                  id="unit"
                  name="unit"
                  value={updateDetails.unit}
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
              <button onClick={handleUpdate} style={{cursor:"pointer"}} className="btn w-100 btn-dark">
                Save & Update
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>

      <div className="sale-content-parentdiv p-3">
        <div className="back-div">
          <span className="back" onClick={() => navigate(-1)}>
            &larr;
          </span>
          <span className="mx-5 h6">Store</span>

          <div
            className="float-end"
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <span
              onClick={addStock}
              style={{
                display: "inline-block",
                width: "25px",
                cursor:"pointer"
              }}
            >
              <img src={Add} title="Add New Stock"width="100%" alt="" />
            </span>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                onChange={(e) => setSearchKey(e.target.value)}
                value={searchKey}
                placeholder="Enter Name"
                className="me-1 mt-2 store_search"
              />
              <button
                type="submit"
                className="store_searchbtn btn btn-primary btn-sm"
                style={{ cursor: "pointer" }}
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">S. No.</th>
                <th scope="col">Name</th>
                <th scope="col">Purchase Price</th>
                <th scope="col">Sale Price</th>
                <th scope="col">Available Stock</th>
                <th scope="col">Unit</th>
              </tr>
            </thead>
            <tbody>
              {store.length > 0 ? (
                store.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleOpen(item)}
                    style={{ cursor: "pointer" }}
                    title="Click for Update & delete"
                  >
                    <td scope="row">{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.purchasePrice}</td>
                    <td>{item.salePrice ? item.salePrice : purchasePrice}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-danger" colSpan="4">
                    Nothing to show
                  </th>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Stock;
