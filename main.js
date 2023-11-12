const { app, BrowserWindow, ipcMain, Tray, nativeImage, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const Valorant = require('./games/Valorant');
const { backgroundEngineFolder, videosFolder } = require('./common/paths');
const Database = require("./database/Database");
const Downloader = require("./common/downloader");

let tray;
let mainWindow;


async function isProcessRunning(processName) {
  try {
    // Using dynamic import to import psList as an ES module
    const { default: psList } = await import('ps-list');
    
    const processes = await psList();
    return processes.some(process => process.name === processName);
  } catch (error) {
    console.error('Error checking process:', error);
    return false;
  }
}



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    menu: null,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'resources', 'icon', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
  //mainWindow.webContents.openDevTools();

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  setInterval(() => {
    let valorant = new Valorant();
    let db = new Database();

    isProcessRunning("VALORANT-Win64-Shipping.exe")
      .then(result => {
        if (result && !valorant.wasReplaced() && !!db.get("valorant_selected_video_path")) {
          console.log("Replacing background in running process");
          valorant.setBackground(db.get("valorant_selected_video_path"));
        }
      });

  }, 5000);
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(path.join(__dirname, 'resources', 'icon', 'icon.png'));
  tray = new Tray(trayIcon);
  tray.setToolTip('Background Engine');

  tray.on('click', () => {
    mainWindow.show();
  });

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow.show();
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.popUpContextMenu(contextMenu);
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('getBackgrounds', () => {
  return fs.readdirSync(videosFolder());
});

ipcMain.handle('backgroundEngineFolder', () => {
  return backgroundEngineFolder();
});

ipcMain.handle('videosFolder', () => {
  return videosFolder();
});

ipcMain.handle('fileExists', (event, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle('deleteFile', (event, filePath) => {
  return fs.unlinkSync(filePath);
});

ipcMain.handle('setDatabase', (event, key, value) => {
  let db = new Database();
  db.set(key, value);
});

ipcMain.handle('getDatabase', (event, key) => {
  let db = new Database();
  return db.get(key);
});

ipcMain.handle('downloadFile', (event, url) => {
  let dwn = new Downloader();
  dwn.download(url);
  return true;
});

ipcMain.handle('setGameBackground', (event, game, video_path) => {
  if (game == 'valorant') {
    let valorant = new Valorant();
    valorant.setBackground(video_path);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  app.isQuiting = true;
});
