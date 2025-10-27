const tl = require('azure-pipelines-task-lib/task');
const path = require('path');
const fs = require('fs');

async function run() {
    try {
        // Obtener inputs
        const reportPath = tl.getPathInput('reportPath', true, true);
        const artifactName = tl.getInput('artifactName', true);

        console.log(`📦 Publicando reporte K6...`);
        console.log(`   Archivo: ${reportPath}`);
        console.log(`   Artifact: ${artifactName}`);

        // Validar que el archivo existe
        if (!tl.exist(reportPath)) {
            tl.setResult(tl.TaskResult.Failed, `El archivo de reporte no existe: ${reportPath}`);
            return;
        }

        // Validar que el nombre del artifact es correcto
        if (artifactName !== 'k6-report') {
            tl.warning(`⚠️ El nombre del artifact debería ser 'k6-report' para que funcione con la extensión K6 Report Viewer`);
        }

        // Obtener el directorio temporal para copiar el archivo
        const stagingDir = path.join(tl.getVariable('Build.ArtifactStagingDirectory') || '', artifactName);
        
        // Crear el directorio si no existe
        tl.mkdirP(stagingDir);

        // Copiar el archivo al directorio de staging con el nombre correcto
        const destPath = path.join(stagingDir, 'summary.html');
        tl.cp(reportPath, destPath, '-f');

        // Log de tamaño para diagnosticar límites de attachment
        try {
            const sizeBytes = fs.statSync(destPath).size;
            const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
            console.log(`✅ Archivo copiado a: ${destPath} (${sizeMB} MB)`);
            if (sizeBytes > 9 * 1024 * 1024) {
                tl.warning('⚠️ El HTML supera ~9-10 MB; el attachment replacedhtml puede fallar. Considera simplificar/minificar o usa solo artifact.');
            }
        } catch (e) {
            tl.warning(`No se pudo obtener el tamaño del archivo: ${e.message || e}`);
        }

        // Publicar el artifact
        console.log(`🚀 Publicando artifact '${artifactName}'...`);
        tl.command('artifact.upload', {
            'containerfolder': artifactName,
            'artifactname': artifactName
        }, stagingDir);

        console.log(`🎉 Reporte K6 publicado exitosamente!`);
        console.log(`   Podrás verlo en el tab 'K6 Report' de los resultados del pipeline`);

        // Adjuntar también el HTML al timeline para el tab "Published HTML"
        try {
            console.log(`🧩 Adjuntando HTML al timeline (type=replacedhtml)...`);
            tl.command('task.addattachment', { 'type': 'replacedhtml', 'name': 'content' }, destPath);
            console.log(`✅ Adjunto creado: type=replacedhtml, name=content, path=${destPath}`);
        } catch (attachErr) {
            tl.warning(`No se pudo adjuntar el HTML al timeline: ${attachErr.message || attachErr}`);
        }

        tl.setResult(tl.TaskResult.Succeeded, 'Reporte K6 publicado correctamente');
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

