import * as vscode from 'vscode';
import { lintDocument } from './linter/linter';
import { exec } from 'child_process';
import { completionItems } from './intelli/intelli';
import { renderOdocToHtml, getWebviewContent } from './compilators/odoc';
import { completeItems } from './detection/detection';
import { searchDocuments } from './advanced/search';
import { createProject } from './advanced/project';
import { treeDataProvider } from './activity/bar'

export function activate(context: vscode.ExtensionContext) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('orangecat');
    context.subscriptions.push(diagnosticCollection);

    if (true) { 
        if (vscode.window.activeTextEditor) {
            lintDocumentAndUpdateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
        }

        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                lintDocumentAndUpdateDiagnostics(editor.document, diagnosticCollection);
            }
        }));

        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
            lintDocumentAndUpdateDiagnostics(e.document, diagnosticCollection);
        }));

        context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
            lintDocumentAndUpdateDiagnostics(document, diagnosticCollection);
        }));

        // Comando para ejecutar el archivo Orange Cat
        const runCommand = vscode.commands.registerCommand('orangecat.run', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const filePath = document.fileName;

                if (filePath.endsWith('.ocat') || filePath.endsWith('.oc')) {
                    vscode.window.showInformationMessage(`Running ${filePath}`);

                    exec(`ocat ${filePath}`, (err, stdout, stderr) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Error running Orange Cat: ${stderr}`);
                            return;
                        }
                        vscode.window.showInformationMessage(`Output: ${stdout}`);
                    });
                } else {
                    vscode.window.showErrorMessage('Not an Orange Cat file.');
                }
            }
        });

        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        statusBarItem.text = '$(play) Run Orange Cat'; // Aquí se usa el ícono de "play"
        statusBarItem.command = 'orangecat.run';
        statusBarItem.show();

        treeDataProvider( context );

        context.subscriptions.push(runCommand, statusBarItem);
    }

    // Comando para previsualizar ODoc
    const renderOdocCommand = vscode.commands.registerCommand('orangecat.render', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();

            // Convertir el texto ODoc a HTML
            const htmlContent = renderOdocToHtml(text);

            // Crear un panel de vista previa
            const panel = vscode.window.createWebviewPanel(
                'odocPreview', // Identificador interno
                'Previsualización ODoc', // Título del panel
                vscode.ViewColumn.Beside, // Mostrar al lado del editor actual
                {
                    enableScripts: true
                }
            );

            // Asignar el contenido HTML al Webview
            panel.webview.html = getWebviewContent(htmlContent);
        } else {
            vscode.window.showInformationMessage('No hay ningún editor activo.');
        }
    });

    // Comando para crear un proyecto
    const createProjectCommand = vscode.commands.registerCommand('orangecat.createProject', (uri: vscode.Uri) => {
        createProject(uri);
    });

    context.subscriptions.push(createProjectCommand);
    context.subscriptions.push(renderOdocCommand);
    context.subscriptions.push(completionItems());
    context.subscriptions.push(completeItems());
    searchDocuments(); // Asegúrate de que esta función esté correctamente implementada
}

// Función para actualizar los diagnósticos del documento
function lintDocumentAndUpdateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
    const diagnostics = lintDocument(document);
    collection.set(document.uri, diagnostics);
}
