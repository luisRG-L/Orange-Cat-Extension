import * as vscode from 'vscode';

let save: Boolean = false;

// Orange Cat Tokens
const tokens = [
    "if", "print", "test", "else", "func", "int", "decimal", "string", "boolean", "import", "using", "/*", "/**", "*/", "*",
    ";", "(", ")", "{", "}", "[", "]"
];

const save_tokens = ["/*"];
const nsave_tokens = ["*/"]

// Verifiy Orange Cat Token
function verifyToken(token: string) {
    if (save_tokens.includes(token)) {
        save = true;
    }
    if(nsave_tokens.includes(token)) {
        save = false;
    }
    return tokens.includes(token) ||
    token.startsWith("\"") || save;
}

function tkcontains(token: string) {
    let includes: Boolean;
    for (let tk of tokens) {
        if (token.includes(tk)) {
            includes = true;
            break;
        }
    };
    return includes;
}

// Linter function to analyze a document and provide diagnostics
export function lintDocument(document: vscode.TextDocument): vscode.Diagnostic[] {
    // Diagnostic list
    const diagnostics: vscode.Diagnostic[] = [];
    // document text
    const text = document.getText();
    // get the list of the lines detecting EOL
    const lines = text.split(/\r?\n/);

    // Get the file name
    const filename = document.fileName;
    // Get the extension matchs
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    // Get the extension
    const extension = match ? match[1] : '';
    // If the extension is .ocat
    if(extension === 'ocat') {
        lines.forEach((line, i) => {
            // Check for semicolons and provide a breakpoint diagnostic
            const semicolonIndex = line.indexOf(';');
            if (semicolonIndex !== -1) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(i, semicolonIndex, i, semicolonIndex + 1),
                    "Breakpoint detected (semicolon found)",
                    vscode.DiagnosticSeverity.Information
                );
                diagnostics.push(diagnostic);
            }

            // Check for 'using' keyword and suggest 'import'
            const usingIndex = line.indexOf('using');
            if (usingIndex !== -1) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(i, usingIndex, i, usingIndex + 5),
                    "Avoid using 'using'; consider 'import' for local libraries",
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostics.push(diagnostic);
            }

            const todoIndex = line.indexOf("@todo");
            if(todoIndex !== -1 ) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(i, todoIndex, i, line.length),
                    `TODO: ${line.substring(todoIndex + 5, line.length)}`,
                    vscode.DiagnosticSeverity.Information
                );
                diagnostics.push(diagnostic);
            }

            // Check initial token
            const tokens = line.split(" ");

            
            tokens.forEach((token, j) => {
                let start = 0;
                for (let x = 0; x < j; x ++) {
                    start+= tokens[x].length + 1;
                }

                const end = start + token.length;
                if (!verifyToken(token) &&  token.length != 0) {
                    if (tkcontains(token)) {
                        const diagnostic = new vscode.Diagnostic(
                            new vscode.Range(i, start, i, end),
                            "Split by spaces the tokens: "+token,
                            vscode.DiagnosticSeverity.Error
                        );
                        diagnostics.push(diagnostic);
                    } else {
                        const diagnostic = new vscode.Diagnostic(
                            new vscode.Range(i, start, i, end),
                                "Undefined token: "+token,
                                vscode.DiagnosticSeverity.Error
                        );
                        diagnostics.push(diagnostic);
                    }
                }
                
            });
        });
    } else if (extension === "ocmn") {
        let tags: {tag: string; line: number }[] = [];
        lines.forEach((line, i) => {
            line = line.trim();
            if(line.startsWith("<") && line.endsWith(">")) {
                if(line.endsWith("/>")) {
                    const lastTag = tags.pop();
                    if (!lastTag || lastTag.tag !== line.substring(1, line.length-2)) {
                        const diagnostic = new vscode.Diagnostic(
                            new vscode.Range(i, 0, i, line.length),
                            `Unordered closed list: </${line.substring(1, line.length-2)}>`
                        );
                        diagnostics.push(diagnostic);
                    }
                } else {
                    const tagName = line.substring(1, line.length-1);
                    tags.push({tag: tagName, line: i});
                }
            }
        });
        tags.forEach((tag, i) => {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(tag.line, 0, tag.line, tag.tag.length),
                "Unclosed Object, close It"
            );
            diagnostics.push(diagnostic);
        });
    }
    

    

    return diagnostics;
}