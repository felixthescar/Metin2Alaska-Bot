const time = require("timers");
const { execSync,exec } = require("child_process");
const robot = require("robotjs");
const readline = require("readline");
const {sendKeys} = require('window-control');
const accounts = require("./accounts.json");
const { syncFocusWindow, getAllAlaskaProcesses } = require('./windows-lib.js');

var slavesNumber = 1; //was 4

var children = [];
var gameWindowIds = [];
//var gameWindowsIds = [];
//const windowIds = [];

run();
function run(){
    
    getAllAlaskaProcesses()
    .then((data) =>
    {
        console.log(data);
    });
    //initWindows();

    //logIntoAccounts();

    //prepareBot();

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

function logIntoAccounts() {
    for(var i = 0; i < slavesNumber; i ++) {
        var windowId = children[i].pid;
        console.log(windowId);
        var username = accounts.usernames[i];
        var password = accounts.passwords[i];
        sendKeys(windowId, username, {resetFocus: true, pressEnterOnceDone: true})
            .catch((error) =>
            {
                //console.log(error);
            })
            .finally(() =>
            {
                sendKeys(windowId, password, {resetFocus: true, pressEnterOnceDone: true})
                    .catch((error) =>
                    {
                        //console.log(error);
                    })
                    .finally(() =>
                    {
                        //console.log("!!!!");
                    });
            });
    }
}

function prepareBot() {
    for(var i = 0; i < slavesNumber; i ++) {
        var windowId = gameWindowsIds[i];
        console.log("ID: "+windowId);
        var cmd="xdotool windowactivate --sync ".concat(windowId);
        var child = execSync(cmd);
        wait(2000);
        robot.keyTap("f1");
        wait(4000);
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

function createGameWindow() {
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
    wait(5000);
    //save cmd pid
    children.push(child);
    //save alaska2 pid
    //get all 
}

function initWindows() {
    for(var i = 0; i < slavesNumber; i++) {
        createGameWindow();
    }
}

function wait(ms) {
    var start = Date.now(),                                      
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}