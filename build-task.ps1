#!/usr/bin/env pwsh

Write-Host "🔨 Construyendo la tarea Publish K6 Report..." -ForegroundColor Cyan

# Ir al directorio de la tarea
Set-Location tasks\PublishK6Report

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Volver al directorio raíz
Set-Location ..\..

Write-Host "✅ Tarea construida exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso: Ejecuta 'npm run package' para crear el archivo .vsix" -ForegroundColor Cyan
