param(
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

# 切换到脚本所在目录，确保相对路径正确
Set-Location $PSScriptRoot

Write-Host "启动本地服务器: http://localhost:$Port" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务器..." -ForegroundColor Yellow

try {
    python -m http.server $Port
}
catch {
    Write-Host "启动失败: $_" -ForegroundColor Red
    exit 1
}
