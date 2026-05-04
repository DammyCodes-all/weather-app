import { app, BrowserWindow, session } from "electron";
import serve from "electron-serve";

const loadURL = serve({ directory: "dist" });

if (process.env.APPIMAGE) {
  app.commandLine.appendSwitch("no-sandbox");
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: "hiddenInset",
  });

  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === "geolocation") {
        return callback(true);
      }
      callback(false);
    },
  );

  if (app.isPackaged) {
    await loadURL(win);
  } else {
    await win.loadURL("http://localhost:8081");
  }
}

app.on("ready", createWindow);
