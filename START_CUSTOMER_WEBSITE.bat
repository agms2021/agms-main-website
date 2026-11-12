@echo off
title AGMS Customer & Citizen Website
color 0E
cls
echo ====================================================================
echo         AG Multi Services - Citizen & Business Website
echo ====================================================================
echo.
echo Starting Customer Website on http://localhost:5173 ...
echo.
cd /d "%~dp0"
npm.cmd run dev
pause

