'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let downward = vscode.commands.registerCommand('better-line-select.downward', () => {
        let editor = vscode.window.activeTextEditor;

        let startOfSelection;
        let endOfSelection;

        startOfSelection = new vscode.Position(editor.selection.start.line, 0);
        if (hasSelection(editor)) {
            endOfSelection = new vscode.Position(editor.selection.end.line + 1, 0);
        } else {
            endOfSelection = new vscode.Position(editor.selection.start.line + 1, 0);
        }

        editor.selection = new vscode.Selection(startOfSelection, endOfSelection);
        revealCursorDownwards(editor);
    });

    let upward = vscode.commands.registerCommand('better-line-select.upward', () => {
        let editor = vscode.window.activeTextEditor;

        // If we are already at the line, do nothing to doge an exception
        if (editor.selection.start.line === 0 && editor.selection.start.character === 0) {
            return;
        }

        let startOfSelection;
        let endOfSelection;

        if (hasSelection(editor)) {
            // Those 2 guys needs to be swapped each keypress to keep the blinking cursor at the top.
            endOfSelection = new vscode.Position(editor.selection.start.line -1, 0);
            startOfSelection = new vscode.Position(editor.selection.end.line, 0);
        } else {
            let currentLine = editor.selection.start.line

            startOfSelection = new vscode.Position(currentLine+1, 0);
            endOfSelection = new vscode.Position(currentLine, 0);
        }

        editor.selection = new vscode.Selection(startOfSelection, endOfSelection);
        revealCursorUpwards(editor);
    });

    context.subscriptions.push(downward);
    context.subscriptions.push(upward);
}

export function deactivate() {
}

function hasSelection(editor) {
    if (editor.selection.start.character === editor.selection.end.character &&
            editor.selection.start.line === editor.selection.end.line) {
        return false;
    } else {
        return true;
    }
}

function revealCursorDownwards(editor) {
    let position = editor.selection.active;
    let newPosition = position.with(editor.selection.end.line, editor.selection.end.character);
    editor.revealRange(new vscode.Range(editor.selection.end, newPosition));
}

function revealCursorUpwards(editor) {
    let position = editor.selection.active;
    let newPosition = position.with(editor.selection.start.line, editor.selection.start.character);
    editor.revealRange(new vscode.Range(editor.selection.start, newPosition));
}