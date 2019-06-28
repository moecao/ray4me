'use strict'

import { app, protocol, BrowserWindow, Tray, ipcMain, Menu, Event, MenuItem } from 'electron'
import { exec, execFile, ChildProcess } from 'child_process'
import fs from 'fs'
import path from 'path'
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'
import { fstat } from 'fs';

let v2rayConfigPath: string


const isDevelopment = process.env.NODE_ENV !== 'production'

declare let __static: string

enum ServiceState {
  ON,
  OFF,
}

enum ProxyMode {
  PAC,
  DIRECT,
}

let appIcon: Tray
let v2rayProcess: ChildProcess

let currentServiceState: ServiceState = ServiceState.OFF
let currentProxyMode: ProxyMode = ProxyMode.DIRECT

let rayOn: MenuItem
let rayOff: MenuItem
let pacMode: MenuItem
let directMode: MenuItem

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: 1002,
    height: 670,
    center: true,
    skipTaskbar: true,
    resizable: false,
    frame: true,
    title: 'traffic',
    titleBarStyle: 'hiddenInset',
    transparent: true,
    icon: path.join(__static, 'assets/icon.png'),
  })



  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) { win.webContents.openDevTools() }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.webContents.on('did-finish-load', (event: Event) => {
    // TODO load config file
    console.log(v2rayConfigPath)
    event.sender.send('v2ray-config-path', v2rayConfigPath)
    if (currentServiceState === ServiceState.ON) {
      event.sender.send('v2ray-state-response', 'done')
    }
  })

  win.on('closed', () => {
    win = null
    app.dock.hide()
  })

  app.dock.show()
}
let v2rayDefaultConfigPath = path.join(__static, 'assets/v2ray/config.json');
if (!isDevelopment) {
  v2rayDefaultConfigPath = path.join(__dirname, './../public/assets/v2ray/config.json')
}

const init = () => {
  v2rayConfigPath = path.join(app.getPath('userData'), 'v2ray-config.json')
  console.log(v2rayDefaultConfigPath)
  // createWindow()
  putTray()
  loadDefaultV2RayConfig()
}


const loadDefaultV2RayConfig = () => {
  const exist = fs.existsSync(v2rayConfigPath)
  if (!exist) {
    fs.readFile(v2rayDefaultConfigPath,
      { encoding: 'UTF-8' },
      (err, data: string) => {
        if (err) {
          throw err
        }
        fs.writeFile(v2rayConfigPath, data, (err) => {
          if (err) {
            throw err
          }
        })
      })
  }
}

const putTray = () => {
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'tray-icon.png';
  const iconPath = path.join(__static, './assets/' + iconName);
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([{
    id: 'rayOn',
    label: 'Turn V2Ray ON',
    type: 'checkbox',
    click: () => {
      startV2ray(function (err: Error | null) {

      })
    },
  }, {
    id: 'rayOff',
    label: 'Turn V2Ray OFF',
    type: 'checkbox',
    click: () => {
      stopV2ray(() => { })
    },
  }, {
    type: 'separator',
  }, {
    id: 'pacMode',
    label: 'PAC Mode',
    type: 'checkbox',
    click: () => {
      switchPacMode()
    },
  }, {
    id: 'directMode',
    label: 'Direct Mode',
    type: 'checkbox',
    click: () => {
      switchDirectMode()
    },
  }, {
    type: 'separator',
  }, {
    type: 'normal',
    label: 'Preferences',
    click: () => {
      if (win != null) {
        win.show();
      } else {
        createWindow()
      }

    },
  }, {
    type: 'separator',
  }, {
    label: 'Exit',
    role: 'quit',
  }])

  rayOn = contextMenu.getMenuItemById('rayOn')
  rayOff = contextMenu.getMenuItemById('rayOff')
  pacMode = contextMenu.getMenuItemById('pacMode')
  directMode = contextMenu.getMenuItemById('directMode')

  appIcon.setToolTip('Free2Ray');
  appIcon.setContextMenu(contextMenu);
}

const startV2ray = (callback: Function) => {
  // mainWindow.webContents.send('ray-state-response', 'ON')
  rayOn.checked = true;
  rayOn.enabled = false;

  rayOff.checked = false;
  rayOff.enabled = true;
  let v2rayPath = path.join(__static, './assets/v2ray/v2ray')
  if (!isDevelopment) {
    v2rayPath = path.join(__dirname, './../public/assets/v2ray/v2ray')
  }
  v2rayProcess = execFile(
    v2rayPath,
    ['--config=', v2rayConfigPath],
    (err, stdout, stderr) => {
      console.log('程序退出了')
      console.log(err)
    })
  v2rayProcess.stdout.once('data', (data) => {
    console.log('数据:', data)
    if (data.indexOf('address') <= 0) {
      callback(null)
      currentServiceState = ServiceState.ON
    } else {
      callback('error')
      currentServiceState = ServiceState.OFF
    }
  })
  v2rayProcess.stderr.on('data', (data) => {
    console.log('cuowu数据:', data)
    callback(data)
  })
}

const stopV2ray = (callback: Function) => {
  // mainWindow.webContents.send('ray-state-response', 'OFF')
  rayOff.checked = true
  rayOff.enabled = false

  rayOn.checked = false
  rayOn.enabled = true
  if (v2rayProcess) {
    try {
      v2rayProcess.kill()
    } catch (error) {
      return
    }
    currentServiceState = ServiceState.OFF
    callback()
  }
}

const restartV2Ray = () => {
  stopV2ray(() => { })
  startV2ray((err: Error | null) => {

  })
}

ipcMain.on('v2ray-state', (event: Event, arg: any) => {
  switch (arg) {
    case 'start':
      console.log('V2Ray starting...')
      startV2ray((err: Error | null) => {
        console.log('进来了')
        console.log(err)
        event.sender.send('v2ray-state-response', err ? err : 'done')
      })
      switchPacMode()
      break;
    case 'restart':
      console.log('V2Ray restarting...')
      restartV2Ray()
      switchPacMode()
      break;
    case 'stop':
      console.log('V2Ray stoping...')
      stopV2ray(() => event.sender.send('v2ray-state-response', 'stop'))
      switchDirectMode()
      break;
    default:
      break;
  }
})

const switchPacMode = () => {
  let setproxyPath = path.join(__static, './assets/shell/setproxy.sh g')
  if (!isDevelopment) {
    setproxyPath = path.join(__dirname, './../public/assets/shell/setproxy.sh g')
  }
  exec( setproxyPath, (err, stdout, stderr) => {
    if (!err) {
      currentProxyMode = ProxyMode.PAC
      pacMode.checked = true
      pacMode.enabled = false

      directMode.checked = false
      directMode.enabled = true
    }
    // console.log(err)
    console.log(stdout)
    console.log(stderr)
  });
}

const switchDirectMode = () => {
  let setproxyPath = path.join(__static, './assets/shell/setproxy.sh n')
  if (!isDevelopment) {
    setproxyPath = path.join(__dirname, './../public/assets/shell/setproxy.sh n')
  }
  exec(setproxyPath, (err, stdout, stderr) => {
    if (!err) {
      currentProxyMode = ProxyMode.DIRECT
      pacMode.checked = false
      pacMode.enabled = true
      directMode.checked = true
      directMode.enabled = false
    }
    console.log(err)
    console.log(stdout)
    console.log(stderr)
  });
}

// app.dock.hide()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', (event: Event) => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (win === null) {
    init()
  }

})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  init()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
