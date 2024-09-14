import * as vscode from 'vscode';
import * as path from 'path';

export function completionItems () {
    return vscode.languages.registerCompletionItemProvider(
        'orangecat',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, 
                token: vscode.CancellationToken, context: vscode.CompletionContext) {
                const completionItems: vscode.CompletionItem[] = [];
                
                completionItems.push(tdocument(document));
                completionItems.push(print());
                return completionItems;
            }
        },
        '.'
    );
}

function tdocument ( txtdocument: vscode.TextDocument ) {
    const document = new vscode.CompletionItem('document');
    document.insertText = new vscode.SnippetString(
        '/* file '+path.basename(txtdocument.fileName)+'!\n' + //
        ' * @author ${1:your_name}\n' + //
        ' */\n' + //
        '\n' + //
        'print ( "Hello,%World" )\n' + //
        ''
    );
    document.documentation = new vscode.MarkdownString('Define a function');
    return document;
}

function print () {
    const document = new vscode.CompletionItem('print', vscode.CompletionItemKind.Function);
    document.insertText = new vscode.SnippetString(
        'print ( "${1:date}" )'
    );
    document.documentation = new vscode.MarkdownString('Define a function');
    return document;
}
