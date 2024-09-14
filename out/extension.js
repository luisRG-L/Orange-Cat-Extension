"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const linter_1 = require("./linter/linter");
const child_process_1 = require("child_process");
const intelli_1 = require("./intelli/intelli");
const odoc_1 = require("./compilators/odoc");
const detection_1 = require("./detection/detection");
const search_1 = require("./advanced/search");
const project_1 = require("./advanced/project");
const bar_1 = require("./activity/bar");
function activate(context) {
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
                    (0, child_process_1.exec)(`ocat ${filePath}`, (err, stdout, stderr) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Error running Orange Cat: ${stderr}`);
                            return;
                        }
                        vscode.window.showInformationMessage(`Output: ${stdout}`);
                    });
                }
                else {
                    vscode.window.showErrorMessage('Not an Orange Cat file.');
                }
            }
        });
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        statusBarItem.text = '$(play) Run Orange Cat'; // Aquí se usa el ícono de "play"
        statusBarItem.command = 'orangecat.run';
        statusBarItem.show();
        (0, bar_1.treeDataProvider)(context);
        context.subscriptions.push(runCommand, statusBarItem);
    }
    // Comando para previsualizar ODoc
    const renderOdocCommand = vscode.commands.registerCommand('orangecat.render', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            // Convertir el texto ODoc a HTML
            const htmlContent = (0, odoc_1.renderOdocToHtml)(text);
            // Crear un panel de vista previa
            const panel = vscode.window.createWebviewPanel('odocPreview', // Identificador interno
            'Previsualización ODoc', // Título del panel
            vscode.ViewColumn.Beside, // Mostrar al lado del editor actual
            {
                enableScripts: true
            });
            // Asignar el contenido HTML al Webview
            panel.webview.html = (0, odoc_1.getWebviewContent)(htmlContent);
        }
        else {
            vscode.window.showInformationMessage('No hay ningún editor activo.');
        }
    });
    // Comando para crear un proyecto
    const createProjectCommand = vscode.commands.registerCommand('orangecat.createProject', (uri) => {
        (0, project_1.createProject)(uri);
    });
    context.subscriptions.push(createProjectCommand);
    context.subscriptions.push(renderOdocCommand);
    context.subscriptions.push((0, intelli_1.completionItems)());
    context.subscriptions.push((0, detection_1.completeItems)());
    (0, search_1.searchDocuments)(); // Asegúrate de que esta función esté correctamente implementada
}
// Función para actualizar los diagnósticos del documento
function lintDocumentAndUpdateDiagnostics(document, collection) {
    const diagnostics = (0, linter_1.lintDocument)(document);
    collection.set(document.uri, diagnostics);
}
