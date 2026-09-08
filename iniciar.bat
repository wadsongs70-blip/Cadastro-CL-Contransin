@echo off
title CL Parts Manager
cd /d "%~dp0"
echo ===================================================
echo             CL PARTS MANAGER - CATALAGO TECNICO
echo ===================================================
echo.
echo Iniciando servidor e abrindo o navegador...
echo.
set PATH=C:\Program Files\nodejs;%PATH%

start http://localhost:5173
npm run dev
pause
