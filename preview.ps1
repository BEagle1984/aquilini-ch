[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int] $Port = 8080,
    [switch] $Stop
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker is not installed or not on PATH. Install and start Docker Desktop first.'
}

$composeFile = Join-Path $PSScriptRoot 'compose.yaml'
$composeArguments = @('compose', '--project-name', 'aquilini-ch-preview', '--file', $composeFile)
$previousPort = $env:PREVIEW_PORT

try {
    $env:PREVIEW_PORT = [string] $Port

    if ($Stop) {
        & docker @composeArguments down
        if ($LASTEXITCODE -ne 0) { throw 'Could not stop the preview. See the Docker error above.' }
        Write-Host 'Preview stopped.'
        return
    }

    & docker @composeArguments up --detach --wait
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not start the preview. Check that Docker Desktop is running and the port is available.'
    }

    $previewUrl = "http://localhost:$Port/"
    $ready = $false
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) { $ready = $true; break }
        } catch {
            Start-Sleep -Milliseconds 250
        }
    }
    if (-not $ready) { throw "The container started, but nginx did not respond at $previewUrl" }

    Write-Host ''
    Write-Host "Home:   $previewUrl"
    Write-Host "Resume: ${previewUrl}resume.html"
    Write-Host 'Files are mounted read-only. Edit locally, then refresh your browser.'
    Write-Host 'Stop with: .\preview.ps1 -Stop'
} finally {
    $env:PREVIEW_PORT = $previousPort
}
