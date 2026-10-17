@echo off
setlocal
title PS Optical - First Push to GitHub
cls
echo ======================================================
echo           PS OPTICAL - UPLOAD TO GITHUB
echo ======================================================
echo.
echo Target Repository: https://github.com/varunthakare21/-PS-optical.git
echo.
echo If a window pops up asking you to sign in:
echo   Click "Sign in with your browser" to authorize Git.
echo.
echo Uploading local project to GitHub...
echo.

git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================
    echo   SUCCESS! All project code is now on GitHub!
    echo   Visit: https://github.com/varunthakare21/-PS-optical
    echo ======================================================
) else (
    echo ======================================================
    echo   Upload failed. Check the error message above.
    echo ======================================================
)

echo.
echo Press any key to close this window...
pause >nul
