const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', () => {
  if(process.platform != 'darwin') app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    frame: true,
    height: 320*3,
    width: 460*3,
  });

  mainWindow.loadURL('http://localhost:1338');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
app.commandLine.appendSwitch('--ignore-gpu-blacklist');
