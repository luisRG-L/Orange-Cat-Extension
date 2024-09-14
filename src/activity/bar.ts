import { hasSubscribers } from 'diagnostics_channel';
import * as vscode from 'vscode';

export function treeDataProvider(context: vscode.ExtensionContext) {
    const packageManagerItems = {
        "Examples": [
            { label: "helloWorld", collapsibleState: vscode.TreeItemCollapsibleState.None}
        ]
    }
    const treeDataProvider = {
        getTreeItem: (element: vscode.TreeItem): vscode.TreeItem => element,
        getChildren: (element?: vscode.TreeItem): vscode.TreeItem[] => {
            if (!element) {
                return Object.keys(packageManagerItems).map(label => ({
                    label,
                    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
                } as vscode.TreeItem));
            } else {
                return packageManagerItems[element.label] || [];
            }
        },
        onDidChangeTreeData: new vscode.EventEmitter<void | vscode.TreeItem | null | undefined>().event,
        refresh: function() {
            this.onDidChangeTreeDataEmitter.fire();
        }
    };
    vscode.window.createTreeView('orangeCatPackageManager', { treeDataProvider });

    context.subscriptions.push(
        vscode.commands.registerCommand('orangecat.refresh', () => {
            treeDataProvider.refresh();
        })
    );

}