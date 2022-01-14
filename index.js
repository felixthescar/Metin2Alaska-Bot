const time = require("timers");
const { execSync,exec } = require("child_process");
const robot = require("robotjs");
const readline = require("readline");

const accounts = require("./accounts.json");
const { runMain } = require("module");
const { getMaxListeners } = require("process");
const { get } = require("http");

var slavesNumber = 4;

var children = [];
var gameWindowsIds = [];
const windowIds = [];

run();
function run(){
    
    initWindows();

    logIntoAccounts();

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

    var child = execSync('xdotool search --sync --name 2011');
    var id = -1;         // ms
    
    child = child.toString().split("\n");
    child.forEach(element => {
        if(windowIds.indexOf(element)==-1&&element!='') {
            id = element;
        }
    });
    return id;
}

function logIntoAccounts() {
    for(var i = 0; i < slavesNumber; i ++) {
        var windowId = gameWindowsIds[i];
        console.log("ID: "+windowId);
        var cmd="xdotool windowactivate --sync ".concat(windowId);
        var child = execSync(cmd);
        robot.typeString(accounts.usernames[i]);
        robot.keyTap("tab");
        robot.typeString(accounts.passwords[i]);
        robot.keyTap("enter");
        wait(4000);
        robot.keyTap("enter");
        wait(2000);
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
    var child = exec("./metin2");
    children.push(child);
}

function initWindows() {
    for(var i = 0; i < slavesNumber; i ++) {
        
        createGameWindow();
        wait(8000);
        var id = getNewWindow();
        gameWindowsIds.push(id);
    }
}

function wait(ms) {
    var start = Date.now(),                                      
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}