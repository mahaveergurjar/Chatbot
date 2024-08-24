const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getBotResponse: (prompt) => ipcRenderer.invoke("get-bot-response", prompt),
});
