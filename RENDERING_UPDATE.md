# 🎨 Actualización: Renderización del Reporte K6

## ✅ Cambios Realizados

El archivo `report-tab.html` ha sido actualizado para **renderizar el reporte HTML de K6 en un iframe** en lugar de solo mostrar mensajes de debug.

### Cambios principales:

1. **Nuevo diseño visual**:
   - Iframe a pantalla completa para mostrar el reporte
   - Mensajes de carga mientras se obtiene el reporte
   - Mejor manejo de errores

2. **Funcionalidad de renderización**:
   - Se busca el archivo `summary.html` o `index.html` en el artifact `k6-report`
   - Se carga el reporte en un iframe a pantalla completa
   - Se oculta el mensaje de carga cuando el reporte está listo

3. **Mejoras técnicas**:
   - Función `showReport(url)` que muestra el iframe con el reporte
   - Función `hideLoading()` que oculta el contenedor de carga
   - Función `hideIframe()` que oculta el iframe en caso de error
   - Verificación de existencia de archivos con `fetch HEAD`

## 🔧 Cómo funciona:

1. El tab se carga y muestra un mensaje "Cargando K6 Report..."
2. Se conecta a la API de Azure DevOps para obtener el artifact `k6-report`
3. Construye la URL directa al archivo `summary.html` o `index.html`
4. Verifica que el archivo existe
5. Carga el reporte en un iframe a pantalla completa
6. Oculta el mensaje de carga

## 🎯 Estructura del HTML:

```html
<body>
    <!-- Contenedor de carga (se oculta cuando el reporte está listo) -->
    <div id="loading-container">
        <div class="loading">
            Cargando K6 Report...
        </div>
    </div>
    
    <!-- Iframe donde se renderiza el reporte (inicialmente oculto) -->
    <iframe id="report-iframe"></iframe>
</body>
```

## 📦 Archivos actualizados:

- ✅ `report-tab.html` - Archivo principal
- ✅ `dist/report-tab.html` - Versión de distribución
- ✅ `dist/report-tab-debug.html` - Versión de debug

## 🚀 Próximos pasos:

1. Ejecuta `npm run package` para crear el nuevo .vsix
2. Sube el archivo .vsix a Azure DevOps
3. Ejecuta tu pipeline que usa `PublishK6Report@1`
4. Ve a los resultados del build
5. Haz clic en el tab "K6 Report"
6. ¡Deberías ver el reporte HTML renderizado!

## 🐛 Si hay problemas:

- Abre las herramientas de desarrollador (F12)
- Ve a la consola
- Busca mensajes que empiecen con "🎯 K6 Extension:"
- Los logs te dirán exactamente qué está pasando
