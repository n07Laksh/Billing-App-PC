import React, { useEffect, useState } from "react";
import Dexie from 'dexie';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const Balance = () => {

  const user = JSON.parse(localStorage.getItem("userData"));

  const [todaySale, setTodaySale] = useState("000")
  const [totalSale, setTotalySale] = useState("000")
  const [previousSale, setPreviousSale] = useState("00")

  // Create Dexie database
  // const saleDB = new Dexie(`sale_${user.name}`);
  const saleDB = new Dexie(`sale`);

  // Define the schema including the new collection
  saleDB.version(4).stores({
    saleItems: '++id,today,clientName', // Include necessary properties
  });

  useEffect(() => {

    // Function to retrieve items for the current date (today total sale) and calculate
    async function retrieveItemsForCurrentDate() {
      const currentDate = new Date().toISOString().substr(0, 10); // Get current date in YYYY-MM-DD format
      try {
        const items = await saleDB.saleItems.where('today').equals(currentDate).toArray();
        return items;
      } catch (error) {
        return [];
      }
    }
    // Example usage
    retrieveItemsForCurrentDate()
      .then(items => {
        if (items.length > 0) {
          // Calculate total amount
          const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
          setTodaySale(totalAmount)
        } else {
          setTodaySale("000")
        }
      });




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
          const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
          setTotalySale(totalAmount)
        } else {
          setTotalySale("000");
        }
      });



    //calculate previous month sale 
    async function retrievePreviousMonthItems() {
      const currentDate = new Date();
      const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);

      const startOfMonth = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), 1);
      const endOfMonth = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth() + 1, 0);

      try {
        const items = await saleDB.saleItems
          .where('today')
          .between(startOfMonth.toISOString().substr(0, 10), endOfMonth.toISOString().substr(0, 10))
          .toArray();
        return items;
      } catch (error) {
        console.error('Error retrieving items:', error);
        return [];
      }
    }

    // Example usage
    retrievePreviousMonthItems()
      .then(items => {
        if (items.length > 0) {

          // Calculate total amount
          const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
          setPreviousSale(totalAmount);
        } else {
          setPreviousSale("00")
        }
      });


  }, []);


  return (
    <>
      <Box
        sx={{
          // margin: "5px"
          width:"100%"
        }}
      >
        <Paper
          sx={{
            padding: "10px",
            borderRadius: "40px 40px 0 0",
            boxShadow: "0px 0.5px 170px transparent",
            background:"transparent",
          }} 
          elevation={2}>

          <div className="d-flex justify-content-around mt-3">
            <div className="today">
              <div>
                <div className="today-title fw-bold">Today Sale</div>
                <div className="today-amount">{todaySale}</div>
              </div>
            </div>

            <div className="total">
              <div>
                <div className="total-title fw-bold">Total Sale</div>
                <div className="total-amount">{totalSale}</div>
              </div>
            </div>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Balance; 
