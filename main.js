const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

// Set development:
process.env.DOT_ENV = 'development';

const isDev = process.env.DOT_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;
console.log('Platform: ', process.platform);

let mainWindow;
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Honey I shrunk the images',
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
  })
  // mainwindow.loadURL(`file://${__dirname}/app/index.html`)
  mainWindow.loadFile('./app/index.html')
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

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    label: 'file',
    submenu: [
      {
        label: 'Quit',
        // accelerator: isMac ? 'Command+W' : 'Ctrl+W',
        accelerator: 'CmdOrCtrl+W',
        click: () => app.quit()
      }
    ]
  }

]

app.on('ready', () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu);

  globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
  globalShortcut.register(isMac ? 'Command+Alt+i' : 'Ctrl+Shift+i', () => mainWindow.toggleDevTools());

  mainWindow.on('closed', () => mainWindow = null)
});
