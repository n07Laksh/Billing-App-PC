import Dexie from 'dexie';
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import RightArrow from "../images/arrow.png"
import Bag from "../images/bag.png"
import Filter from "../images/filter.png"
import Search from "../images/search.png"
import All from "../images/all.png"

import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "94%",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  margin: "0 auto",
  borderRadius: "15px",
};

const Records = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState(null);
  const [totalSale, setTotalSale] = useState([]);
  const [originalCopy, setOriginalCopy] = useState([]);
  const user = JSON.parse(localStorage.getItem("userData"));

  // Create Dexie database
  // const saleDB = new Dexie(`sale_${user.name}`);
  const saleDB = new Dexie(`sale`);
  // Define the schema including the new collection
  saleDB.version(4).stores({
    saleItems: '++id,today,clientName', // Include necessary properties
  });

  useEffect(() => {
    // Function to retrieve items for the grand Total till now and calculate
    async function retrieveAllItems() {
      try {
        const items = await saleDB.saleItems.toArray();
        return items;
      } catch (error) {
        return [];
      }
    }
    // Example usage
    retrieveAllItems()
      .then(items => {
        if (items.length > 0) {
          // Calculate total amount
          setTotalSale(items.reverse());
          setOriginalCopy(items);
        } else {
          setTotalSale([]);
        }
      });

  }, []);

  function calculateDaysPassed(saleDate) {
    const today = new Date();
    const saleDateTime = new Date(saleDate);
    const timeDifference = today - saleDateTime;
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysPassed <= 0 ? "Today" : daysPassed + " day ago";
  }

  const [open, setOpen] = React.useState(false);
  const [openSearch, setopenSearch] = React.useState(false);
  const [item, setItem] = useState(null)
  const handleOpen = (item) => {
    setItem(item)
    setOpen(true);
  }
  const handleSearchBtn = () => {
    setopenSearch(true);
  }
  const handleClose = () => {
    setOpen(false);
    setopenSearch(false)
  }

  const handleFilter = () => {
    // Create a new copy of the array, reverse it, and update the state
    setTotalSale([...totalSale].reverse());
  }

  const inputRef = useRef(null);
  const [keyToForceUpdate, setKeyToForceUpdate] = useState(0);

  useEffect(() => {
    if (openSearch && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current.focus();
      }, 300); // Adjust this delay to accommodate the transition duration

      return () => clearTimeout(timeout);
    }
  }, [openSearch, keyToForceUpdate]); // Include keyToForceUpdate in the dependencies

  // Function to toggle the key and force useEffect to re-trigger
  const toggleKey = () => {
    setKeyToForceUpdate(prevKey => prevKey + 1);
  };

  const handleSearch = (key) => {
    const filteredData = originalCopy.filter(
      (item) =>
        item.invoiceNum.includes(key) || item.clientName.toLowerCase().includes(key.toLowerCase()) ||
        item.clientContact.includes(key) || item.clientAddress.includes(key) || item.clientAddress.includes(key)
    );
    setopenSearch(false)
    setTotalSale(filteredData)
  }

  const refreshAll = () => {
    setTotalSale(originalCopy)
  }

  return (
    <>
      <div>
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
            {item &&
              <Box sx={style}>
                <Typography className='border-bottom pb-2' id="transition-modal-title" variant="h6" component="h2">
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className='w-100'>
                      <div className="clent-name clent-names">
                        {item.clientName}
                      </div>
                      <div className='clent-contact'>{item.clientContact}</div>
                      <div className='clent-address'>{item.clientAddress}</div>
                    </div>
                  </div>
                </Typography>

                <Typography id="transition-modal-description" sx={{ mt: 2, lineHeight: "1" }}>
                  <div>
                    <div className='clent-product'>{item.name}</div>

                    <div className="clent-pare mt-2">
                      <div className='clent-tag'>Price:</div>
                      <div className='clent-quote'>{item.salePrice} ₹</div>
                    </div>
                    <div className="clent-pare">
                      <div className='clent-tag'>Quantity:</div>
                      <div className='quote'>{`${item.quantity} ${item.unit}`}</div>
                    </div>
                    <div className="clent-pare">
                      <div className='clent-tag'>Discount:</div>
                      <div className='quote'>{item.disc ? item.disc : "0"}%</div>
                    </div>
                    <div className="clent-pare">
                      <div className='clent-tag'>GST:</div>
                      <div className='quote'>{item.gst ? item.gst : "0"}%</div>
                    </div>
                    <div className="clent-pare">
                      <div className='clent-tag'>Payment Mode:</div>
                      <div className='quote'>{item.payMode}</div>
                    </div>

                    <div className="clent-pare tot-price">
                      <div>Total:</div>
                      <div>{`${item.amount + ".0 ₹"}`}</div>
                    </div>
                  </div>
                </Typography>
              </Box>
            }

          </Fade>
        </Modal>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openSearch}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openSearch} onEnter={toggleKey}>
            <Box sx={style}>
              <Typography className='border-bottom pb-3' id="transition-modal-title" variant="h6" component="h2">
                <div className="hero">
                  <div className='active' id="searchBox">
                    <input ref={inputRef} onChange={(event) => setSearchKey(event.target.value)} type="text" className='search-inp' placeholder="Search Google or type URL" />
                    <div onClick={() => handleSearch(searchKey)} className='search-img'>
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                </div>
              </Typography>

              <Typography id="transition-modal-description" sx={{ mt: 2, lineHeight: "1" }}>
                <div className='ms-4' style={{ color: "rgba(0,0,0,0.3)", fontSize: "14px" }}>Ex. Name, Contact, invoice...</div>
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>

      <div className='w-100'>
        <Paper
          sx={{
            padding: "11px",
          }}
          className='nav-paper'
        >
          <div className="">
            <span className="back" onClick={() => navigate(-1)}>
              <img src={RightArrow} width="100%" alt="" />
            </span>
            <span className="mx-5 h6">Records</span>
          </div>
        </Paper>
        <div className="main-content main-content-mobile">
          <div className="main-content-child main-content-child1">
            <div className="filter-history">
              <div onClick={refreshAll} style={{ width: "27px", marginRight: "20px" }}>
                <img width="100%" src={All} alt="" />
              </div>
              <div className='d-flex'>
                <div onClick={handleFilter} style={{ width: "27px", marginRight: "20px" }}>
                  <img width="100%" src={Filter} alt="" />
                </div>
                <div onClick={handleSearchBtn} style={{ width: "27px", marginRight: "0px" }}>
                  <img width="100%" src={Search} alt="" />
                </div>
              </div>

            </div>

            <div className="list-group gap-2">
              {totalSale.length > 0 ? (
                totalSale.map((item, index) => (
                  <a onClick={() => handleOpen(item)} key={index} className="list-group-item list-group-item-action " aria-current="true">
                    <div className="d-flex w-100 justify-content-between">

                      <div className='section-left'>
                        <div>
                          <div className="clent-name">
                            {item.clientName}
                          </div>
                        </div>
                        <div className='clent-price'>{`${item.amount}.00 ₹`}</div>
                        <div>
                          <small className='clent-qyt'>{calculateDaysPassed(item.today)}</small>
                        </div>
                      </div>

                      <div className='section-right'>
                        <img width="90%" src={Bag} alt="" />
                      </div>

                    </div>
                  </a>
                ))
              ) : (
                <div className='text-center my-5'>
                  <div>
                    Nothing to show just add sale invoice to show here
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
export default Records