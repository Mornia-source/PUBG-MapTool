param(
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

Write-Host "Trying to free port $Port ..." -ForegroundColor Cyan

try {
    $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
} catch {
    Write-Host "Failed to get port usage info: $_" -ForegroundColor Red
    exit 1
}

if (-not $conns) {
    Write-Host "No process is using port $Port" -ForegroundColor Green
    exit 0
}

$pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($p in $pids) {
    try {
        $proc = Get-Process -Id $p -ErrorAction Stop
        Write-Host "Killing process PID=$p ($($proc.ProcessName))" -ForegroundColor Yellow
        Stop-Process -Id $p -Force -ErrorAction Stop
        Write-Host "Killed PID=$p" -ForegroundColor Green
    } catch {
        Write-Host "Failed to kill PID=$($p): $_" -ForegroundColor Red
    }
}

Write-Host "Port $Port has been freed (or already free)." -ForegroundColor Cyan
