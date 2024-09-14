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
exports.completeItems = completeItems;
const vscode = __importStar(require("vscode"));
function completeItems() {
    return vscode.languages.registerCompletionItemProvider('orangecat', {
        provideCompletionItems(document, position, token, context) {
            const completionItems = [];
            completeFor(/\b(int|string|bool|decimal)\s+(\w+)\b/g, document).forEach((e, i) => {
                completionItems.push(e);
            });
            return completionItems;
        }
    }, '.');
}
function completeFor(pattern, document) {
    const completionItems = [];
    let match;
    while ((match = pattern.exec(document.getText())) !== null) {
        const variableName = match[2];
        const variableCompletion = new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Variable);
        variableCompletion.insertText = variableName;
        variableCompletion.documentation = new vscode.MarkdownString(`Detected variable: ${variableName}`);
    }
    return completionItems;
}
