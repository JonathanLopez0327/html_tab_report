# Tarea: Publish K6 Report

Esta es una tarea personalizada de Azure Pipelines que facilita la publicación de reportes HTML de K6.

## Uso

```yaml
- task: PublishK6Report@1
  displayName: 'Publicar Reporte K6'
  inputs:
    reportPath: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
    artifactName: 'k6-report'
  condition: always()
```

## Parámetros

- **reportPath** (requerido): Ruta completa al archivo HTML del reporte K6
  - Valor por defecto: `$(System.DefaultWorkingDirectory)/k6-results/summary.html`
  
- **artifactName** (requerido): Nombre del artifact que contendrá el reporte
  - Valor por defecto: `k6-report`
  - **IMPORTANTE**: Debe ser exactamente `k6-report` para que funcione con la extensión K6 Report Viewer

## ¿Qué hace esta tarea?

1. Valida que el archivo de reporte existe
2. Copia el archivo HTML a un directorio temporal con el nombre `summary.html`
3. Publica el artifact con el nombre especificado
4. Muestra mensajes informativos durante el proceso

## Instalación

Para instalar las dependencias de la tarea:

```bash
cd tasks/PublishK6Report
npm install
```

## Desarrollo

La tarea está construida con:
- Node.js
- azure-pipelines-task-lib

Archivos principales:
- `task.json`: Definición de la tarea
- `index.js`: Lógica de ejecución
- `package.json`: Dependencias

## Alternativa

Si no quieres usar esta tarea personalizada, puedes usar la tarea estándar de Azure Pipelines:

```yaml
- task: PublishBuildArtifacts@1
  displayName: 'Publicar Reporte K6'
  inputs:
    pathToPublish: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
    artifactName: 'k6-report'
    publishLocation: 'Container'
  condition: always()
```

Ambas opciones funcionan igual, la tarea personalizada solo añade validaciones y mensajes más claros.
