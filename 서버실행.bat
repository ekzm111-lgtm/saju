@echo off
chcp 65001 > nul
title AI Fortune - 개발 서버

echo ================================
echo   AI Fortune 서버 시작 중...
echo   주소: http://localhost:3001
echo ================================
echo.

cd /d "d:\01-작업\ai fortune"

:: node_modules 확인
if not exist "node_modules" (
    echo [설치 중] node_modules가 없습니다. npm install 실행 중...
    npm install
    echo.
)

echo [실행] npm run dev 시작...
echo.
npm run dev

pause
