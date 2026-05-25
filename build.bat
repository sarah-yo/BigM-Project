@echo off
REM Build script for Windows

echo Building vulnerable test application...

REM Build the Docker image
docker build -t vulnerable-app:latest .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker image built successfully!
    echo Image: vulnerable-app:latest
    echo.
    echo Next steps:
    echo 1. Run the container: docker run -p 3000:3000 vulnerable-app:latest
    echo 2. Scan with Trivy: trivy image vulnerable-app:latest
) else (
    echo ❌ Docker build failed!
    exit /b 1
)
