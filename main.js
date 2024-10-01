const { app, BrowserWindow, screen } = require("electron");
const settings = require("./config");
const { createMenu } = require("./menu");

let mainWindow;

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  // Calculate gaps for initial window positioning from config
  const gaps = {
    x: settings.horizontalPosition === 'left' ? settings.horizontalGap : screenWidth - settings.width - settings.horizontalGap,
    y: settings.verticalPosition === 'top' ? settings.verticalGap : screenHeight - settings.height - settings.verticalGap,
  };

  if (settings.horizontalPosition === 'center') {
    gaps.x = (screenWidth - settings.width) / 2;
  }
  if (settings.verticalPosition === 'center') {
    gaps.y = (screenHeight - settings.height) / 2;
  }

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: settings.width,
    height: settings.height,
    x: Math.floor(gaps.x),
    y: Math.floor(gaps.y),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Create the UI menu for window positioning and other options
  createMenu(mainWindow);
}

// Handle app lifecycle
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.disableHardwareAcceleration();
