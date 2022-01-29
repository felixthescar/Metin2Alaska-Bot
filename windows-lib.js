const { execSync, exec } = require("child_process");
const Shell = require('node-powershell');
const ps = new Shell.PowerShell
({
    executionPolicy: 'Bypass',
    noProfile: true
});

module.exports.syncFocusWindow = function syncFocusWindow(pid)
{
    var cmd = '(New-Object -ComObject WScript.Shell).AppActivate("' + toString(pid) + '")';
    ps.invoke(cmd);
}

module.exports.getAllAlaskaProcesses = function getAllAlaskaProcesses()
{
    var cmd = '(Get-Process | findstr "Alaska")';
    return ps.invoke(cmd);
}