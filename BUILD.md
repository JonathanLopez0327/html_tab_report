# Build Task Script

Este directorio contiene scripts para construir la tarea de Azure Pipelines.

## build-task.ps1

Script de PowerShell que:
1. Navega al directorio de la tarea `PublishK6Report`
2. Instala las dependencias necesarias (`azure-pipelines-task-lib`)
3. Prepara la tarea para ser incluida en la extensión

## Uso

### Desde la raíz del proyecto:
```powershell
npm run build-task
```

O directamente:
```powershell
pwsh -File build-task.ps1
```

### Para construir todo (tab + tarea):
```powershell
npm run build
```

### Para empaquetar la extensión completa:
```powershell
npm run package
```

Esto creará un archivo `.vsix` que incluye:
- El tab de visualización del reporte
- La tarea personalizada `PublishK6Report`
