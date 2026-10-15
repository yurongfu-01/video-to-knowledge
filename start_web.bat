@echo off
chcp 65001 >nul
echo ======================================================================
echo   Video2Knowledge Studio - 视频分析与知识库工作台
echo ======================================================================
echo.
cd /d "%~dp0web"

if not exist "node_modules" (
    echo [INFO] 首次启动，正在安装依赖...
    call npm install
)

if not exist "dist" (
    echo [INFO] 正在编译前端生产资产...
    call npm run build
)

echo.
echo [SUCCESS] 服务启动成功！
echo          访问地址: http://localhost:3001
echo.

start http://localhost:3001
node server/index.js
