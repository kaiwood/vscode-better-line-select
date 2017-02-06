'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let downward = vscode.commands.registerCommand('better-line-select.downward', () => {
        // TODO: Implement
    });

    let upward = vscode.commands.registerCommand('better-line-select.upward', () => {
        // TODO: Implement
    });

    context.subscriptions.push(downward);
    context.subscriptions.push(upward);
}

export function deactivate() {
}