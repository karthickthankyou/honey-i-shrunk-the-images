const { app, BrowserWindow } = require('electron');

// Set development:
process.env.DOT_ENV = 'development';

const isDev = process.env.DOT_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;
console.log('Platform: ', process.platform);

let mainWindow;
const createMainWindow = () => {
  mainwindow = new BrowserWindow({
    title: 'Honey I shrunk the images',
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
  })
  // mainwindow.loadURL(`file://${__dirname}/app/index.html`)
  mainwindow.loadFile('./app/index.html')
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.on('ready', createMainWindow);
