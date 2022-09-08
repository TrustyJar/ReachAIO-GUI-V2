const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');
const express = require('express');
const port = process.env.port || 4430;
const backendApp = express();
const fs = require('fs');
const cookieParser = require("cookie-parser");
const {runCronLoop} = require("../Backend/cron.js");
const { application } = require('express');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

/*
Creating the initial electron window. This is the launch of the UI.
The size of the window is set to the values below.
*/
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
      width: 1200,
      height: 600,
      webPreferences: {
          nodeIntegration: true,
      },
  });

  // and load the index.html of the app.
  /*
  This html file will include the main page which has the form
  to start the tasks. Submitting the form will send a request to the backend
  with the data.
  */
  mainWindow.loadFile(path.join(__dirname.slice(0, -4), 'Frontend/index.html'));

  //Using basic express json
  backendApp.use(express.json());
  backendApp.use(express.urlencoded({
      extended: false
  }));

  /*
  This is the backend request which will accept the form data passed
  through the original form. It will call the function which will work
  as the main functionality of the program.
  */
  backendApp.post('/post', (req, res) => {
      runPost();
      async function runPost() {

          const email = req.body.email;
          const password = req.body.pass;
          const time = req.body.appt;

          runReachAIO(email, password, time);

          mainWindow.loadFile(path.join(__dirname.slice(0, -4), 'Frontend/index2.html'));
        }
  });

  /*
  This backend request will be sent if the user wants to stop their tasks. it will void
  the currently running function. 
  */
  backendApp.get('/get', (req, res) => {
    app.quit();
    app.relaunch();
  });

  //Listening to port
  backendApp.listen(port, () => {
      console.log(`Successfully connected to the server ${port}`);
  });


  /*
  This is the main functionality part of the program. It includes all 
  of the backend requests to log in and SISO. It also has the cron and pm2
  to keep the program alive.
  */
  async function runReachAIO(email, password, time) {
  
      /*
      Just a bundled version of the post input. It is put into a JSON so it can
      be more readable as a param.
      */
      const theContent = {
          email: email,
          password: password,
          time: time
      }

      /*
      Passing the content JSON as a parameter for the task. This info is being sent to the backend
      and will be used when the script is ran. This is because there are only 2 pages. No need for a
      config page.
      */
      runCronLoop(theContent);
    } 

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.