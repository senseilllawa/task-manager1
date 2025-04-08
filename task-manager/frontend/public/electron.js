const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged; // ⬅️ Проверка: dev или продакшн

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000'); // ⬅️ при разработке
  } else {
    win.loadFile(path.join(__dirname, '../build/index.html')); // ⬅️ при сборке .exe
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
