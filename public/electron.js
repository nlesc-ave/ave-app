const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1200, 
    height: 900
  });

  // diable menu bar
  // win.setMenu(null);

  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

  //win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})