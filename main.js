const { app, BrowserWindow, screen } = require('electron');
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
      // nodeIntegration: false,
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      // contextIsolation: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js')
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

  win.webContents.on('will-attach-webview', (event, webPreferences, params) => {
    webPreferences.preload = path.join(__dirname, 'preload.js');
  });
}


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

// ...here