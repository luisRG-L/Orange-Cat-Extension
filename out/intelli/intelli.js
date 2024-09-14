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
exports.completionItems = completionItems;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function completionItems() {
    return vscode.languages.registerCompletionItemProvider('orangecat', {
        provideCompletionItems(document, position, token, context) {
            const completionItems = [];
            completionItems.push(tdocument(document));
            completionItems.push(print());
            return completionItems;
        }
    }, '.');
}
function tdocument(txtdocument) {
    const document = new vscode.CompletionItem('document');
    document.insertText = new vscode.SnippetString('/* file ' + path.basename(txtdocument.fileName) + '!\n' + //
        ' * @author ${1:your_name}\n' + //
        ' */\n' + //
        '\n' + //
        'print ( "Hello,%World" )\n' + //
        '');
    document.documentation = new vscode.MarkdownString('Define a function');
    return document;
}
function print() {
    const document = new vscode.CompletionItem('print', vscode.CompletionItemKind.Function);
    document.insertText = new vscode.SnippetString('print ( "${1:date}" )');
    document.documentation = new vscode.MarkdownString('Define a function');
    return document;
}
