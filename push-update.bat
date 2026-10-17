@echo off
setlocal
title PS Optical - GitHub Sync
cls
echo ======================================================
echo           PS OPTICAL - GITHUB SYNC TOOL
echo ======================================================
echo.

set /p COMMIT_MSG="Enter commit message (or press ENTER for automatic timestamp): "

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0push-update.ps1" -Message "%COMMIT_MSG%"

echo.
echo Press any key to close this window...
pause >nul
