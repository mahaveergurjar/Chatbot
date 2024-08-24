// main.js
const { app, BrowserWindow, screen } = require("electron");
const settings = require("./config");

function createWindow() {
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: settings.width,
    height: settings.height,
    x: settings.horizontalPosition==='left'? settings.horizontalGap : screenWidth - settings.horizontalGap,
    y: settings.horizontalPosition==='top'? settings.verticalGap : screenWidth - settings.verticalGap,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
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

