# Guía de Configuración del Pipeline

Esta guía explica cómo configurar tu Azure Pipeline para publicar reportes K6 HTML.

## Opción 1: Usando la tarea personalizada (Recomendado)

Si tienes instalada la extensión K6 Report Viewer con la tarea incluida:

```yaml
steps:
  # 1. Ejecutar tus pruebas K6 y generar el reporte HTML
  - script: |
      k6 run --out json=k6-results/results.json scripts/test.js
      k6-html-reporter k6-results/results.json --output k6-results/summary.html
    displayName: 'Ejecutar pruebas K6'

  # 2. Publicar el reporte usando la tarea personalizada
  - task: PublishK6Report@1
    displayName: 'Publicar Reporte K6'
    inputs:
      reportPath: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
      artifactName: 'k6-report'
    condition: always()
```

## Opción 2: Usando la tarea estándar de Azure Pipelines

Si prefieres no usar la tarea personalizada:

```yaml
steps:
  # 1. Ejecutar tus pruebas K6 y generar el reporte HTML
  - script: |
      k6 run --out json=k6-results/results.json scripts/test.js
      k6-html-reporter k6-results/results.json --output k6-results/summary.html
    displayName: 'Ejecutar pruebas K6'

  # 2. Publicar el reporte usando la tarea estándar
  - task: PublishBuildArtifacts@1
    displayName: 'Publicar Reporte K6'
    inputs:
      pathToPublish: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
      artifactName: 'k6-report'
      publishLocation: 'Container'
    condition: always()
```

## Requisitos importantes

### ✅ Nombre del artifact
El artifact **DEBE** llamarse exactamente `k6-report` para que la extensión lo encuentre.

### ✅ Nombre del archivo
Dentro del artifact, el archivo HTML **DEBE** llamarse `summary.html`.

### ✅ Condición always()
Usa `condition: always()` para publicar el reporte incluso si las pruebas fallan.

## Estructura esperada del artifact

```
k6-report/
└── summary.html
```

## Ejemplo completo con K6

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  # Instalar K6
  - script: |
      sudo gpg -k
      sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
      echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
      sudo apt-get update
      sudo apt-get install k6
    displayName: 'Instalar K6'

  # Instalar generador de reportes HTML
  - script: npm install -g k6-html-reporter
    displayName: 'Instalar k6-html-reporter'

  # Ejecutar pruebas
  - script: |
      mkdir -p k6-results
      k6 run --out json=k6-results/results.json scripts/load-test.js
    displayName: 'Ejecutar pruebas K6'
    continueOnError: true

  # Generar reporte HTML
  - script: |
      k6-html-reporter k6-results/results.json --output k6-results/summary.html
    displayName: 'Generar reporte HTML'

  # Publicar reporte
  - task: PublishBuildArtifacts@1
    displayName: 'Publicar Reporte K6'
    inputs:
      pathToPublish: '$(System.DefaultWorkingDirectory)/k6-results/summary.html'
      artifactName: 'k6-report'
      publishLocation: 'Container'
    condition: always()
```

## Troubleshooting

### El tab no muestra el reporte

1. **Verifica el nombre del artifact**: Debe ser exactamente `k6-report`
2. **Verifica el nombre del archivo**: Debe ser `summary.html`
3. **Verifica que el artifact se publicó**: Ve a la sección Artifacts del build
4. **Revisa los logs del pipeline**: Busca errores en la publicación

### El archivo no existe

Si obtienes error "El archivo de reporte no existe":
- Verifica que la ruta es correcta
- Verifica que el paso anterior generó el archivo
- Usa `ls` para listar los archivos generados

```yaml
- script: ls -la k6-results/
  displayName: 'Listar archivos generados'
```

## Otras opciones de reportes HTML para K6

### k6-reporter
```bash
npm install -g k6-reporter
k6 run --out json=results.json script.js
k6-reporter results.json
```

### k6-html-reporter
```bash
npm install -g k6-html-reporter
k6 run --out json=results.json script.js
k6-html-reporter results.json --output summary.html
```

### htmlReport (extensión de k6)
```javascript
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
```
