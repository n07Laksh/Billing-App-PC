const { BrowserWindow, app, ipcMain, Notification, screen } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

// const isDev = true;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().size;
  const win = new BrowserWindow({
    width: width,
    height: height,
    maximizable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

   // Specify the path to ffmpeg.dll
   const ffmpegPath = path.join(__dirname, 'ffmpeg.dll'); // Highlighted line

   // Set the path to ffmpeg for your Electron app
   win.webContents.setVisualZoomLevelLimits(1, 1);
   win.webContents.setAudioMuted(true);

  //  console.log(ffmpegPath)

  win.removeMenu();
  win.loadFile("index.html");
  win.webContents.openDevTools();
}

// if(isDev){
//   require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
//   })
      
// }

ipcMain.on('notify', (_, message) => {
  new Notification({title: 'Notifiation', body: message}).show();
})

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});



// unique identifier for only one pc

const uniqueIdentifierFilePath = path.join(__dirname, 'uniqueIdentifier.txt');
const backupFilePath = path.join(__dirname, 'backup', 'uniqueIdentifierBackup.txt');

function createBackup() {
  // Check if backup directory exists, and create it if not
  const backupDirectory = path.join(__dirname, 'backup');
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }

  // Copy the current uniqueIdentifier.txt to the backup directory
  if (fs.existsSync(uniqueIdentifierFilePath)) {
    fs.copyFileSync(uniqueIdentifierFilePath, backupFilePath);
    console.log('Backup created.');
  }
}

function restoreFromBackup() {
  // Check if backup file exists
  if (fs.existsSync(backupFilePath)) {
    // Restore the backup to uniqueIdentifier.txt
    fs.copyFileSync(backupFilePath, uniqueIdentifierFilePath);
    console.log('Restored from backup.');
  } else {
    console.log('No backup found.');
  }
}

if (fs.existsSync(uniqueIdentifierFilePath)) {
  // Read the stored identifier
  const storedIdentifier = fs.readFileSync(uniqueIdentifierFilePath, 'utf-8');

  // Get the current system's model name
  const currentModelName = os.cpus()[0].model;

  if (storedIdentifier === currentModelName) {
    console.log('Software is allowed to run.');
    // Perform any actions you want for running the software
  } else {
    console.log('Software is already in use on another system.');
    // Implement a message or action indicating that the software is in use
  }
} else {
  // Generate a new unique identifier (system model name) for the first time
  const systemModelName = os.cpus()[0].model;
  
  // Store the new identifier in the file
  fs.writeFileSync(uniqueIdentifierFilePath, systemModelName, 'utf-8');
  
  console.log('Unique identifier stored for this system.');
  
  // Create a backup after storing the new identifier
  createBackup();
}

// Uncomment the following line to test restoring from backup
restoreFromBackup();