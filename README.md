# K6 Report Viewer - Extensión Azure DevOps

Esta extensión permite visualizar reportes HTML de K6 directamente en los resultados del pipeline de Azure DevOps.

## Flujo de funcionamiento

1. Tu pipeline ejecuta pruebas K6
2. El pipeline publica un artifact llamado `k6-report` que contiene un archivo `summary.html`
3. Al visualizar los resultados del pipeline, aparece un nuevo tab "K6 Report" que muestra el reporte

## Instalación

1. Sube el archivo `JonathanLopez.k6-report-viewer-1.0.4.vsix` a tu organización de Azure DevOps
2. Ve a Organization Settings → Extensions → Manage Extensions
3. Haz clic en "Upload extension" y selecciona el archivo .vsix
4. Instala la extensión en tu organización

## Configuración del Pipeline

Para que la extensión funcione, tu pipeline debe:

1. **Generar el reporte K6 en formato HTML**
2. **Publicar el artifact con el nombre exacto `k6-report`**
3. **El archivo HTML debe llamarse `summary.html`**

### 📋 Ver guía completa: [PIPELINE_SETUP.md](PIPELINE_SETUP.md)

### Opción 1: Usando la tarea personalizada (incluida en la extensión)

```yaml
- task: PublishK6Report@1
  displayName: 'Publicar Reporte K6'
  inputs:
    reportPath: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
    artifactName: 'k6-report'
  condition: always()
```

### Opción 2: Usando la tarea estándar de Azure Pipelines

```yaml
- task: PublishBuildArtifacts@1
  displayName: 'Publish K6 Report'
  inputs:
    pathToPublish: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
    artifactName: 'k6-report'
    publishLocation: 'Container'
```

O si tienes una carpeta completa:

```yaml
- task: PublishBuildArtifacts@1
  displayName: 'Publish K6 Report'
  inputs:
    pathToPublish: '$(System.DefaultWorkingDirectory)/k6-results'
    artifactName: 'k6-report'
    publishLocation: 'Container'
```

## Troubleshooting

### El tab no aparece

1. **Verifica que la extensión esté instalada**: Ve a Organization Settings → Extensions
2. **Verifica el nombre del artifact**: Debe ser exactamente `k6-report`
3. **Verifica el archivo**: Debe existir `summary.html` dentro del artifact
4. **Revisa los permisos**: La extensión necesita permisos para leer builds y artifacts

### El tab aparece pero no carga el contenido

1. **Abre las herramientas de desarrollador** del navegador (F12)
2. **Ve a la pestaña Console** para ver los logs de debug
3. **Busca mensajes que empiecen con** el prefijo de la extensión
4. **Verifica que el artifact `k6-report` contiene el archivo `summary.html`**

### Mensajes de error comunes

- **"No se encontró el artifact k6-report"**: El pipeline no está publicando el artifact con el nombre correcto
- **"No se pudo obtener el ID del build"**: Problema de configuración de la extensión
- **"Error al cargar el reporte"**: El archivo HTML puede estar corrupto o no existir

## Estructura esperada del artifact

```
k6-report/
└── summary.html
```

## Versiones

- **1.0.4**: Versión actual con mejoras en debugging y manejo de errores
- **1.0.3**: Correcciones en el build
- **1.0.2**: Primera versión funcional

## Desarrollo

Para desarrollo local:

```bash
npm install
npm run build
npm run package
```

## Permisos requeridos

La extensión requiere los siguientes permisos:
- `vso.build`: Para leer información de builds
- `vso.build_execute`: Para acceder a builds en ejecución
- `vso.artifacts`: Para leer artifacts de los builds

## Soporte

Si tienes problemas:
1. Verifica que tu pipeline publique el artifact correctamente
2. Revisa los logs en la consola del navegador
3. Asegúrate de que el archivo `summary.html` sea un HTML válido