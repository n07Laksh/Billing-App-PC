import Dexie from 'dexie';
import React, { useEffect, useState } from 'react'
import Slideshow from './Slideshow';


const HomeContent = () => {
  const [totalSale, setTotalySale] = useState([]);

  //style for names 
  let nameStyle = {
    fontSize: "0.7rem",
  }


  // Create Dexie database
  const saleDB = new Dexie('sale');

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
          setTotalySale(items)
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
    
     
    return daysPassed=="0"?"Today":daysPassed+" day ago";
  }

  return (
    <div>
      <div className="main-content">
      
        <div className="main-content-child main-content-child1">

        <div className="history-text p-2">Sale History ...</div>

          <div className="list-group">
            {
              totalSale.reverse().map((item, index) => (
                <a key={index} className="list-group-item list-group-item-action mb-3 " aria-current="true">
                  <div className="d-flex w-100 justify-content-between">
                   <h6 className="mb-1 text-success"> {item.clientName + " | " + item.clientAddress + " | " + item.clientContact}</h6>
                    <small>{calculateDaysPassed(item.today)}</small>
                  </div>
                  <small ><span style={nameStyle}>Name-</span> <span className="text-danger history-text-size">{item.name},</span> <span style={nameStyle}>Disc-</span> <span className="text-danger history-text-size">{item.disc?item.disc:"0"}%,</span> <span style={nameStyle}>Price-</span> <span className="text-danger history-text-size">{item.amount},</span> <span style={nameStyle}>Date-</span> <span className="text-danger history-text-size">{item.date?item.date:item.today},</span> <span style={nameStyle}>Pay-Mode-</span> <span className="text-danger history-text-size">{item.payMode}</span></small>
                </a>
              ))
            }



          </div>

        </div>

        <div className="main-content-child ms-2 main-content-child2">
        
        <Slideshow />
        
        </div>
      </div>
    </div>
  )
}

export default HomeContent