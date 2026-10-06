@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  start "" "http://localhost:8765/"
  py -m http.server 8765
) else (
  where python >nul 2>&1
  if %ERRORLEVEL% EQU 0 (
    start "" "http://localhost:8765/"
    python -m http.server 8765
  ) else (
    echo Python is not installed. Opening the static homepage in your browser.
    start "" "%~dp0index.html"
  )
)
