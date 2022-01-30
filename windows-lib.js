const { execSync, exec } = require("child_process");
const Shell = require('node-powershell');
const ps = new Shell.PowerShell
({
    debug: true,
    executableOptions:
    {
        '-ExecutionPolicy': 'Bypass',
        '-NoProfile': true
    }
});

module.exports.wait = function wait(ms) {
    var start = Date.now(),                                      
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

module.exports.syncFocusWindow = function syncFocusWindow(pid)
{
    var cmd = '(New-Object -ComObject WScript.Shell).AppActivate("' + pid + '")';
    return ps.invoke(cmd);
}

module.exports.sendKeys = function sendKeys(pid, keys)
{
    module.exports.syncFocusWindow(pid)
    .then(() => {console.log("focused")});
    module.exports.wait(500);
    var cmd = '(New-Object -ComObject wscript.shell)' + '.SendKeys("' + keys + '")';
    return ps.invoke(cmd);
}

module.exports.getAllAlaskaProcesses = function getAllAlaskaProcesses()
{
    var cmd = '(Get-Process | findstr "Alaska")';
    return ps.invoke(cmd);
}