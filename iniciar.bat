@echo off
title CL Parts Manager
cd /d "%~dp0"
echo ===================================================
echo             CL PARTS MANAGER - CATALOGO TECNICO
echo ===================================================
echo.
set PATH=C:\Program Files\nodejs;%PATH%
if not exist "node_modules\" (
    echo [1/2] Instalando pacotes e dependencias...
    call npm install
)
echo [2/2] Iniciando servidor e abrindo o navegador...
call npm run dev -- --open
pause
