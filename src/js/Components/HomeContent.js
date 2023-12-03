import Dexie from "dexie";
import React, { useEffect, useState } from "react";
import Slideshow from "./Slideshow";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight:"600px",
  overflow:"auto",
};
import LocationOnIcon from "@mui/icons-material/LocationOn";

const HomeContent = () => {
  const [totalSale, setTotalySale] = useState([]);

  const user = JSON.parse(localStorage.getItem("userData"));

  //style for names
  let nameStyle = {
    fontSize: "0.7rem",
  };

  // Create Dexie database
  const saleDB = new Dexie(`sale_${user.name}`);

  // Define the schema including the new collection
  saleDB.version(4).stores({
    saleItems: "++id,today,clientName", // Include necessary properties
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
    retrieveAllItems().then((items) => {
      if (items.length > 0) {
        setTotalySale(items);
      } else {
        setTotalySale([]);
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

  const totalMoney = (saleData) => {
    return saleData.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);
  };

  const [openItem, setOpenItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (item) => {
    setOpenItem(item);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {openItem && (
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
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                <div className="d-flex justify-content-between mx-3">
                  <div>
                    <div
                      style={{ textTransform: "capitalize" }}
                      className="md-name"
                    >
                      <span>
                        <PersonIcon fontSize="small" className="me-2" />
                      </span>
                      {openItem.clientName}
                    </div>
                    <div className="md-contact mt-1">
                      <span>
                        <PhoneIcon fontSize="small" className="me-2" />
                      </span>
                      {openItem.clientContact ? openItem.clientContact :"..."}
                    </div>

                    <div className="md-address mt-1">
                      <span>
                        <LocationOnIcon fontSize="small" className="me-2" />
                      </span>
                      {openItem.clientAddress? openItem.clientAddress:"..."}
                    </div>
                  </div>
                  <div>
                    <div className="md-date">
                    <span><CalendarMonthIcon fontSize="small" className="me-2"/></span>
                    {openItem.today}
                    </div>
                    <div className="md-invnum mt-1">inv no. - {openItem.invoiceNum}</div>
                    <div className="md-invnum mt-1">Payment Mode - {openItem.payMode}</div>
                  </div>
                </div>
              </Typography>

              <Typography id="transition-modal-description" sx={{ mt: 3 }}>
                {openItem.saleItem.map((item, index) => (
                  <Accordion
                    sx={{
                      mt: 1,
                    }}
                    expanded={expanded === `panel${index + 1}`}
                    onChange={handleChange(`panel${index + 1}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index + 1}bh-content`}
                      id={`panel${index + 1}bh-header`}
                    >
                      <Typography
                        sx={{
                          width: "33%",
                          flexShrink: 0,
                          textTransform: "capitalize",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontWeight:"bolder" }}>
                        {item.amount}₹
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography className="mt-4">
                       <div className="w-50 d-flex flex-column gap-3">
                        <div className="md-a">
                          <div>Sale Price</div>
                          <div>{item.salePrice}₹</div>
                        </div>
                        <div className="md-a">
                          <div>Quantity</div>
                          <div>{item.quantity} {item.unit}</div>
                        </div>
                        <div className="md-a">
                          <div>Discount</div>
                          <div>{item.disc?item.disc+"%":"0%"}</div>
                        </div>
                        <div className="md-a">
                          <div>GST</div>
                          <div>{item.gst?item.gst+"%":"0%"}</div>
                        </div>
                       </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}

              </Typography>
              <Typography sx={{
                mt:3,
                background:"rgba(0,0,0,0.7)",
                color:"white",
                padding:"10px",
              }}>
                Total Amount : {"   " + totalMoney(openItem.saleItem)}₹
              </Typography>
            </Box>
          </Fade>
        </Modal>
      )}

      <div>
        <div className="main-content">
          <div className="main-content-child main-content-child1">
            <div className="history-text p-2">Sale History ...</div>

            <div className="list-group">
              {totalSale.reverse().map((item, index) => (
                <a
                  onClick={() => handleOpen(item)}
                  key={index}
                  className="list-group-item list-group-item-action mb-3 "
                  aria-current="true"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex w-100 justify-content-between p-2">
                    <h5 className="mb-1 text-success text-capitalize">
                      {item.clientName}
                    </h5>
                    <h5>{totalMoney(item.saleItem)}₹</h5>
                    <small>{calculateDaysPassed(item.today)}</small>
                  </div>
                  <small>
                    <span style={nameStyle}></span>
                    <span className="text-danger history-text-size">
                      <LocationOnIcon fontSize="small" /> {item.clientAddress}
                    </span>
                  </small>
                </a>
              ))}
            </div>
          </div>

          <div className="main-content-child ms-2 main-content-child2">
            <Slideshow />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContent;
