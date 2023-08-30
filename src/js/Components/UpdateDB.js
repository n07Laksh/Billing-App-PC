import React, { useState, useEffect } from "react";
// import isOnline from "is-online";
// import Dexie from 'dexie';

// const Store = window.require("electron-store")

// const { ipcRenderer } = window.require("electron");

const UpdateDB = () => {
  const [online, setOnline] = useState(false);
  const [synced, setSynced] = useState(false);

  // const store = new Store();

  // useEffect(() => {
  //   // Check online status when component mounts
  //   isOnline().then((onlineStatus) => {
  //     setOnline(onlineStatus);
  //   });

  //   // Listen for online status changes from IPC
  //   ipcRenderer.send("online-status-changed", (_, onlineStatus) => {
  //     setOnline(onlineStatus);
  //   });

  //   // Clean up listener when component unmounts
  //   return () => {
  //     ipcRenderer.removeAllListeners("online-status-changed");
  //   };
  // }, []); // Empty dependency array ensures the effect runs once on mount

  // useEffect(() => {
  //   fetchDataAndSync();
  // }, []);

  // async function fetchDataAndSync() {
  //   console.log("click")
  //   try {
  //     const db = new Dexie('items');
  //     db.version(2).stores({
  //       itemData: 'productName',
  //     });

  //     const items = await db.itemData.toArray();
  //     console.log("Fetched data from IndexedDB:", items);
  //     store.set("dataToSync", items);

  //     ipcRenderer.invoke('mongodb')
  //       .then(result => {
  //         console.log('Data synced to MongoDB:', result);
  //         setSynced(true);
  //       })
  //       .catch(error => {
  //         console.error('Error syncing data to MongoDB:', error);
  //       });

  //     // Now you can send the items to your Electron app using IPC
  //     // ipcRenderer.send("sync-data-to-mongodb", items);

  //   } catch (error) {
  //     console.error('Error fetching and syncing data:', error);
  //   }
  // }

  return (
    <div>
      <div>
        <p>User is {online ? "online" : "offline"}</p>
        {synced ? <p>Data synced to MongoDB</p> : null}
      </div>
      <button
        // onClick={fetchDataAndSync}
        className="btn btn-primary btn-sm w-25 mt-4"
      >
        Sync
      </button>
    </div>
  );
}
export default UpdateDB;
