import * as vscode from 'vscode';

export function completeItems () {
    return vscode.languages.registerCompletionItemProvider(
        'orangecat',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, 
                token: vscode.CancellationToken, context: vscode.CompletionContext) {

                const completionItems: vscode.CompletionItem[] = [];
                completeFor(/\b(int|string|bool|decimal)\s+(\w+)\b/g, document).forEach((e, i) => {
                    completionItems.push(e);
                });
                return completionItems;
            }
        },
        '.'
    )
}

function completeFor(pattern: RegExp, document: vscode.TextDocument) {
    const completionItems: vscode.CompletionItem[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(document.getText())) !== null) {
        const variableName = match[2];
        const variableCompletion = new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Variable);
        variableCompletion.insertText = variableName;
        variableCompletion.documentation = new vscode.MarkdownString(`Detected variable: ${variableName}`);
    }
    return completionItems;
}