const { app, BrowserWindow, screen } = require("electron");
const settings = require("./config");
const { createMenu } = require("./menu");

let mainWindow;

function createWindow() {
  try {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    // Improved positioning calculation for future flexibility
    const gaps = {
      x: settings.horizontalPosition === 'left' ? settings.horizontalGap :
         settings.horizontalPosition === 'center' ? (screenWidth - settings.width) / 2 :
         screenWidth - settings.width - settings.horizontalGap,
      
      y: settings.verticalPosition === 'top' ? settings.verticalGap :
         settings.verticalPosition === 'center' ? (screenHeight - settings.height) / 2 :
         screenHeight - settings.height - settings.verticalGap,
    };

    // Create the browser window with enhanced error handling
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

  } catch (error) {
    console.error("Error creating the window: ", error);
  }
}

// Handle app lifecycle and errors
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

// Disable hardware acceleration for compatibility purposes
app.disableHardwareAcceleration();
