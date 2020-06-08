const os = require('os');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');

// Set development:
process.env.DOT_ENV = 'development';

const isDev = process.env.DOT_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;
console.log('Platform: ', process.platform);

let mainWindow;
let aboutWindow;
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Honey I shrunk the images',
    width: isDev ? 800 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
    }
  })

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  // mainwindow.loadURL(`file://${__dirname}/app/index.html`)
  mainWindow.loadFile('./app/index.html')
}
const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    title: 'About',
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
  })
  // aboutwindow.loadURL(`file://${__dirname}/app/index.html`)
  aboutWindow.loadFile('./app/about.html')
}

ipcMain.on('image:minimize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageShrink');
  shrinkImage(options)
  console.log('ipcMain, ', options);
})

async function shrinkImage({ dest, imgPath, quality }) {
  console.log("shrink image called.");

  const pngquality = quality / 100;
  try {
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({ quality: [pngquality, pngquality] })
      ]
    });

    console.log(files);

    shell.openPath(dest);

  } catch (err) {
    console.log(err)
  }
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
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {
        label: 'About',
        click: createAboutWindow
      }
    ]
  }] : []),
  {
    role: 'fileMenu'
  },
  ...(isDev
    ? [
      {
        label: 'Developer',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { type: 'separator' },
          { role: 'toggledevtools' },
        ],
      },
    ]
    : []),



]

app.on('ready', () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu);

  // globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
  // globalShortcut.register(isMac ? 'Command+Alt+i' : 'Ctrl+Shift+i', () => mainWindow.toggleDevTools());

  mainWindow.on('closed', () => mainWindow = null)
});
