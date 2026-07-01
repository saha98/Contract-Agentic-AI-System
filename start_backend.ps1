$root = $PSScriptRoot
$python = Join-Path $root ".venv\Scripts\python.exe"
$bindHost = if ($env:APP_HOST) { $env:APP_HOST } else { "127.0.0.1" }
$bindPort = if ($env:APP_PORT) { [int]$env:APP_PORT } else { 8000 }

if (-not (Test-Path $python)) {
    Write-Host "Python virtual environment not found at '$python'."
    exit 1
}

$client = New-Object System.Net.Sockets.TcpClient
try {
    $result = $client.BeginConnect($bindHost, $bindPort, $null, $null)
    if ($result.AsyncWaitHandle.WaitOne(750) -and $client.Connected) {
        Write-Host "Port $bindPort on $bindHost is already in use."
        Write-Host "Stop the existing backend or change APP_PORT before starting it again."
        exit 1
    }
}
catch {
    # No listener on the target port, so it is safe to continue.
}
finally {
    $client.Close()
}

& $python -m uvicorn app.main:app --reload --host $bindHost --port $bindPort --app-dir $root --reload-dir (Join-Path $root "app")
