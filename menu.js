const { Menu, screen, dialog } = require("electron");

function createMenu(mainWindow) {
  // Menu template with better comments and organization
  const template = [
    {
      label: "File",
      role: "fileMenu", // Standard Electron role for file menu
    },
    {
      label: "Edit",
      role: "editMenu", // Standard role for edit menu with basic operations
    },
    {
      label: "View",
      role: "viewMenu", // View-related operations such as toggling full screen
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Position",
          submenu: [
            // Improved structure for window position options
            {
              label: "Left",
              submenu: [
                {
                  label: "Top Left",
                  click: () => positionWindow(mainWindow, "left", "top"),
                },
                {
                  label: "Center Left",
                  click: () => positionWindow(mainWindow, "left", "center"),
                },
                {
                  label: "Bottom Left",
                  click: () => positionWindow(mainWindow, "left", "bottom"),
                },
              ],
            },
            {
              label: "Center",
              submenu: [
                {
                  label: "Top Center",
                  click: () => positionWindow(mainWindow, "center", "top"),
                },
                {
                  label: "Center",
                  click: () => positionWindow(mainWindow, "center", "center"),
                },
                {
                  label: "Bottom Center",
                  click: () => positionWindow(mainWindow, "center", "bottom"),
                },
              ],
            },
            {
              label: "Right",
              submenu: [
                {
                  label: "Top Right",
                  click: () => positionWindow(mainWindow, "right", "top"),
                },
                {
                  label: "Center Right",
                  click: () => positionWindow(mainWindow, "right", "center"),
                },
                {
                  label: "Bottom Right",
                  click: () => positionWindow(mainWindow, "right", "bottom"),
                },
              ],
            },
            { type: "separator" }, // Visual separator for better menu organization
            {
              label: "Custom Offset",
              click: () => editOffset(mainWindow),
            },
          ],
        },
        { type: "separator" },
        {
          label: "Minimize",
          role: "minimize", // Standard role for minimizing the window
        },
        {
          label: "Close",
          role: "close", // Standard role for closing the window
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Learn More",
          click: () => {
            require("electron").shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  // Create the menu from the template
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function positionWindow(mainWindow, horizontal, vertical) {
  try {
    const { width, height } = mainWindow.getBounds();
    const { workAreaSize } = screen.getPrimaryDisplay();

    let x = 0;
    let y = 0;

    // Calculate horizontal position with comments for clarity
    if (horizontal === "center") {
      x = (workAreaSize.width - width) / 2;
    } else if (horizontal === "left") {
      x = 0;
    } else if (horizontal === "right") {
      x = workAreaSize.width - width;
    }

    // Calculate vertical position
    if (vertical === "center") {
      y = (workAreaSize.height - height) / 2;
    } else if (vertical === "top") {
      y = 0;
    } else if (vertical === "bottom") {
      y = workAreaSize.height - height;
    }

    // Ensure window is positioned within screen bounds
    mainWindow.setPosition(Math.floor(x), Math.floor(y));
  } catch (error) {
    // Enhanced error handling with user-friendly message
    console.error("Error while positioning the window:", error);
    mainWindow.webContents.executeJavaScript(
      `alert('Failed to position the window: ${error.message}');`
    );
  }
}

function editOffset(mainWindow) {
  try {
    const offsetDialogOptions = {
      type: "question",
      buttons: ["OK"],
      title: "Custom Offset",
      message: "Enter X and Y offsets (e.g., 100, 150)",
      detail: "Use the format: x,y",
      defaultId: 0,
      noLink: true,
    };

    // Show a dialog to get the offset values
    dialog.showMessageBox(mainWindow, offsetDialogOptions).then((response) => {
      if (response.response === 0) {
        mainWindow.webContents
          .executeJavaScript(
            "prompt('Enter custom X and Y offsets (format: x,y):')"
          )
          .then((input) => {
            const [x, y] = input.split(",").map(Number);
            if (!isNaN(x) && !isNaN(y)) {
              mainWindow.setPosition(x, y); // Apply custom offset
            } else {
              mainWindow.webContents.executeJavaScript(
                `alert('Invalid offset values. Please enter numbers in the format: x,y.');`
              );
            }
          });
      }
    });
  } catch (error) {
    console.error("Error while editing offset:", error);
    mainWindow.webContents.executeJavaScript(
      `alert('Failed to edit the offset: ${error.message}');`
    );
  }
}

module.exports = { createMenu };
