const time = require("timers");
const { execSync,exec } = require("child_process");
const robot = require("robotjs");
const readline = require("readline");
const accounts = require("./accounts.json");
const { syncFocusWindow, getAllAlaskaProcesses, sendKeys } = require('./windows-lib.js');
const { focusWindow } = require("window-control");

var slavesNumber = 2; //was 4

var children = [];
var gameWindowIds = [];
//var gameWindowsIds = [];
//const windowIds = [];

run();
async function run(){
    await initWindows();
    wait(2000);
    await logIntoAccounts();

    await prepareBot();

    //getAllActiveWindowsInAList();
    
    //collectItemsAndAttack();
    
}

function getAllActiveWindowsInAList(){
    var child = execSync('xdotool search --sync --name 2011');
    var id = -1;         // ms
    var count = 0;
    child = child.toString().split("\n");
    child.forEach(element => {
        if(windowIds.indexOf(element)==-1&&element!='') {
            id = element;
        }
        gameWindowsIds.push(id);
        count++;
    });
    gameWindowsIds.pop(count);
}

function getNewWindow() {

    //var child = execSync('xdotool search --sync --name 2011');
    var id = -1;         // ms
    
    /*child = child.toString().split("\n");
    child.forEach(element => {
        if(windowIds.indexOf(element)==-1&&element!='') {
            id = element;
        }
    });*/
    //console.log(id);
    return id;
}

async function logIntoAccount(windowId, username, password)
{
    console.log("Username: " + username);
    await sendKeys(windowId, username + "{ENTER}");
    await sendKeys(windowId, password + "{ENTER}");
    wait(5000);
    //sendKeys(windowId, "%{F4}");
    await sendKeys(windowId, "{ENTER}");
    wait(100);
    await sendKeys(windowId, "{ENTER}");
    wait(100);
    robot.moveMouse(700, 700);
    wait(100);
    robot.mouseClick();
}

async function logIntoAccounts() {
    for(var i = 0; i < slavesNumber; i ++) {
        await logIntoAccount(gameWindowIds[i], accounts.usernames[i], accounts.passwords[i]);
        wait(1000);
    }
}

async function prepareBot() {
    for(var i = 0; i < slavesNumber; i ++) {
        var windowId = gameWindowIds[i];
        console.log("ID: "+windowId);
        focusWindow(windowId);
        wait(100);
        robot.keyTap("f1");
        wait(1000);
    }
}

function collectItemsAndAttack() {
    while(true) {
        for(var i = 0; i < slavesNumber; i ++) {
            var windowId = gameWindowsIds[i];
            console.log("ID: "+windowId);
            var cmd="xdotool windowactivate --sync ".concat(windowId);
            var child = execSync(cmd);
            robot.keyTap("z");
            robot.keyToggle("space", "down");
            wait(8000);
            //robot.keyToggle("space", "up");
        }
    }
}

async function createGameWindow() {
    //create game instance
    var child = exec("metin2.lnk", (error, stdout, stderr) =>
    {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) 
        {
            console.log('exec error: ' + error);
        }
    });
    wait(1000);
    var data = await getAllAlaskaProcesses();
    var processed = data.raw.replace("\r\n", "").split(" ");
    processed = processed.filter(n => n);
    for(var i = 5; i < processed.length; i += 8)
    {
        //save alaska2 pid
        if(!gameWindowIds.includes(processed[i]))
        {
            gameWindowIds.push(processed[i]);
            console.log("Added new window id: " + processed[i]);
            break;
        }
    }
    /*getAllAlaskaProcesses()
    .then((data) =>
    {
        var processed = data.raw.replace("\r\n", "").split(" ");
        processed = processed.filter(n => n);
        for(var i = 5; i < processed.length; i += 8)
        {
            //save alaska2 pid
            if(!gameWindowIds.includes(processed[i]))
            {
                gameWindowIds.push(processed[i]);
                console.log("Added new window id: " + processed[i]);
                break;
            }
        }
    });*/
    //save cmd pid
    children.push(child);
}

async function initWindows() {
    for(var i = 0; i < slavesNumber; i++) {
        await createGameWindow();
    }
}

function wait(ms) {
    var start = Date.now(),                                      
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}