@echo off
setlocal enabledelayedexpansion
cls

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

echo I-checheck muna po sir kung installed na dependencies ng system. Wait lang po.
timeout /t 5 /nobreak >nul

if not exist "%SCRIPT_DIR%\server\node_modules\" (
  cls
  echo Wait lang po sir, mag-iinstall lang po ng dependencies ng server, salamat po.
  cd "%SCRIPT_DIR%\server"
  npm install

  if not exist "%SCRIPT_DIR%\client\node_modules\" (
    cls
    echo Wait lang po sir, mag-iinstall lang po ng dependencies ng client, salamat po.
    cd "%SCRIPT_DIR%\client"
    npm install
    cd "%SCRIPT_DIR%"
    system_runner.bat
  )
)

wt ^
  new-tab -p "Command Prompt" cmd /k "title Database Server && cd /d \"%SCRIPT_DIR%\server\database\" && pocketbase serve" ^
; new-tab -p "Command Prompt" cmd /k "title Server && timeout /t 2 /nobreak >nul && cd /d \"%SCRIPT_DIR%\server\" && npm run dev" ^
; new-tab -p "Command Prompt" cmd /k "title Client && timeout /t 3 /nobreak >nul && cd /d \"%SCRIPT_DIR%\client\" && npm run dev -- --host=0.0.0.0"

timeout /t 5 /nobreak >nul

set "wifiFound=false"

for /f "delims=" %%A in ('ipconfig') do (
   set "line=%%A"

   echo !line! | findstr /c:"Wi-Fi" >nul
   
   if !errorlevel! == 0 (
      set "wifiFound=true"
   )

   if "!wifiFound!" == "true" (
      echo !line! | findstr /c:"IPv4" >nul
      
      if !errorlevel! == 0 (
         for /f "tokens=1,2 delims=:" %%A in ("!line!") do (
            set "wifiIp=%%B"
            goto :gotIp
         )
      )
   )
)

:gotIp

set "hostname=%wifiIp: =%"

start "" "http://%hostname%:5173"