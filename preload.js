
const { ipcRenderer, contextBridge } = require('electron');
const os = require('os'); // Import the 'os' module

// contextBridge.exposeInMainWorld('electron', {
//   notificationApi: {
//     sendNotification(message) {
//       ipcRenderer.send('notify', message);
//     }
//   },
//   batteryApi: {

//   },
//   filesApi: {

//   }
// });


contextBridge.exposeInMainWorld('os', os);



