@echo off
C:\ProgramData\anaconda3\python.exe -m uvicorn app.main:app --reload --app-dir "%~dp0" --reload-dir "%~dp0app"
