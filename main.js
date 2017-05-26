const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow(){
  // Create Browser Window
  win = new BrowserWindow({width: 1200, height: 700, resizable: true, frame: false, icon:__dirname + '/img/icon.png'});
  win.setMenu(null);

  // Load index.html
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open Devtool
  win.webContents.openDevTools();

  win.on('closed', () =>{
    win = null;
  });
}

// Run createWindow function
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () =>{
  if (process.platform !== 'darwin'){
    app.quit();
  }
});
