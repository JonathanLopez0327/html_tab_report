# 📋 Resumen de Cambios - Tarea de Azure Pipelines

## ✅ Archivos Creados

### Tarea Personalizada (tasks/PublishK6Report/)
- **task.json**: Definición de la tarea para Azure Pipelines
- **index.js**: Lógica de ejecución de la tarea
- **package.json**: Dependencias de la tarea
- **README.md**: Documentación de la tarea

### Documentación
- **PIPELINE_SETUP.md**: Guía completa de configuración del pipeline
- **BUILD.md**: Instrucciones de construcción
- **azure-pipelines-example.yml**: Ejemplo completo de pipeline YAML

### Scripts
- **build-task.ps1**: Script para construir la tarea

### Otros
- **.gitignore**: Exclusiones de Git

## 📝 Archivos Modificados

- **vss-extension.json**: 
  - Añadida la tarea a los `files`
  - Añadida la contribución `publish-k6-report-task`
  
- **README.md**: 
  - Actualizada sección de configuración del pipeline
  - Añadida referencia a PIPELINE_SETUP.md

- **package.json**: 
  - Añadido script `build-task`
  - Actualizado script `build`
  - Actualizado script `package`

## 🚀 Cómo Usar

### Opción 1: Construir y empaquetar todo

```powershell
# 1. Instalar dependencias principales
npm install

# 2. Construir (tab + tarea)
npm run build

# 3. Empaquetar extensión
npm run package
```

### Opción 2: Solo construir la tarea

```powershell
npm run build-task
```

## 📦 Qué incluye la extensión ahora

1. **Tab de visualización** (`K6 Report`): Muestra el reporte HTML en los resultados del build
2. **Tarea personalizada** (`PublishK6Report@1`): Facilita la publicación del reporte

## 💡 Dos formas de publicar reportes

### Con la tarea personalizada (Recomendado)
```yaml
- task: PublishK6Report@1
  inputs:
    reportPath: 'k6-results/summary.html'
    artifactName: 'k6-report'
  condition: always()
```

### Con la tarea estándar
```yaml
- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: 'k6-results/summary.html'
    artifactName: 'k6-report'
  condition: always()
```

Ambas opciones funcionan perfectamente. La tarea personalizada añade validaciones y mensajes más claros.

## 🎯 Próximos Pasos

1. Ejecutar `npm install` para instalar dependencias
2. Ejecutar `npm run build` para construir todo
3. Ejecutar `npm run package` para crear el archivo .vsix
4. Subir el archivo .vsix a Azure DevOps
5. Usar la tarea en tus pipelines

## ⚠️ Requisitos Importantes

- El artifact **DEBE** llamarse `k6-report`
- El archivo HTML **DEBE** llamarse `summary.html`
- Usa `condition: always()` para publicar incluso si las pruebas fallan

## 📚 Documentación Adicional

- Ver [PIPELINE_SETUP.md](PIPELINE_SETUP.md) para guía completa de configuración
- Ver [BUILD.md](BUILD.md) para instrucciones de construcción
- Ver [tasks/PublishK6Report/README.md](tasks/PublishK6Report/README.md) para detalles de la tarea
