const { Menu, screen } = require('electron');

function createMenu(mainWindow) {
  // Define your menu template
  const template = [
    {
      label: 'File', // Default file menu
      role: 'fileMenu',
    },
    {
      label: 'Edit', // Default edit menu
      role: 'editMenu',
    },
    {
      label: 'View', // Default view menu
      role: 'viewMenu',
    },
    {
      label: 'Window', // Combined window menu
      submenu: [
        {
          label: 'Position',
          submenu: [
            {
              label: 'Left',
              click: () => positionWindow(mainWindow, 'left', 'center'),
            },
            {
              label: 'Right',
              click: () => positionWindow(mainWindow, 'right', 'center'),
            },
            {
              label: 'Top',
              click: () => positionWindow(mainWindow, 'center', 'top'),
            },
            {
              label: 'Bottom',
              click: () => positionWindow(mainWindow, 'center', 'bottom'),
            },
            {
              label: 'Center',
              click: () => positionWindow(mainWindow, 'center', 'center'),
            },
          ],
        },
        { type: 'separator' }, // Optional: add a separator line
        {
          label: 'Minimize',
          role: 'minimize',
        },
        {
          label: 'Close',
          role: 'close',
        },
      ],
    },
    {
      label: 'Help', // Default help menu
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            require('electron').shell.openExternal('https://electronjs.org');
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

    // Calculate horizontal position
    if (horizontal === 'center') {
      x = (workAreaSize.width - width) / 2;
    } else if (horizontal === 'left') {
      x = 0;
    } else if (horizontal === 'right') {
      x = workAreaSize.width - width;
    }

    // Calculate vertical position
    if (vertical === 'center') {
      y = (workAreaSize.height - height) / 2;
    } else if (vertical === 'top') {
      y = 0;
    } else if (vertical === 'bottom') {
      y = workAreaSize.height - height;
    }

    // Set new window position
    mainWindow.setPosition(Math.floor(x), Math.floor(y));
  } catch (error) {
    console.error('Error while positioning the window:', error);
    mainWindow.webContents.executeJavaScript(`alert('Failed to position the window: ${error.message}');`);
  }
}

module.exports = { createMenu };
