@echo off
title AGMS Main Website
cd /d "%~dp0"
echo ========================================================
echo    AG Multi Services - Main Website (agmultiservices.online)
echo ========================================================
echo.
echo Starting local web server...
echo Website will open at: http://localhost:5173
echo.
call npm run dev
pause

