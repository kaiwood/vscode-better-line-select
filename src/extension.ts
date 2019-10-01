"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let downward = vscode.commands.registerCommand(
    "better-line-select.downward",
    () => {
      let editor = vscode.window.activeTextEditor;

      let newSelections = [];

      for (let selection of editor.selections) {
        let startOfSelection;
        let endOfSelection;

        startOfSelection = new vscode.Position(selection.start.line, 0);

        if (hasSelection(selection)) {
          endOfSelection = new vscode.Position(selection.end.line + 1, 0);
        } else {
          endOfSelection = new vscode.Position(selection.start.line + 1, 0);
        }

        newSelections.push(
          new vscode.Selection(startOfSelection, endOfSelection)
        );
      }

      editor.selections = newSelections;

      revealCursorDownwards(editor); // TODO: Check wich cursor should be revealed
    }
  );

  let upward = vscode.commands.registerCommand(
    "better-line-select.upward",
    () => {
      let editor = vscode.window.activeTextEditor;

      // If we are already at the line, do nothing to doge an exception
      if (
        editor.selection.start.line === 0 &&
        editor.selection.start.character === 0
      ) {
        return;
      }

      let newSelections = [];

      for (let selection of editor.selections) {
        let startOfSelection;
        let endOfSelection;

        if (hasSelection(selection)) {
          // Those 2 guys needs to be swapped each keypress to keep the blinking cursor at the top.
          endOfSelection = new vscode.Position(selection.start.line - 1, 0);
          startOfSelection = new vscode.Position(selection.end.line, 0);
        } else {
          let currentLine = selection.start.line;

          startOfSelection = new vscode.Position(currentLine + 1, 0);
          endOfSelection = new vscode.Position(currentLine, 0);
        }

        newSelections.push(
          new vscode.Selection(startOfSelection, endOfSelection)
        );
      }

      editor.selections = newSelections;

      revealCursorUpwards(editor);
    }
  );

  context.subscriptions.push(downward);
  context.subscriptions.push(upward);
}

export function deactivate() {}

function hasSelection(selection) {
  if (
    selection.start.character === selection.end.character &&
    selection.start.line === selection.end.line
  ) {
    return false;
  } else {
    return true;
  }
}

function revealCursorDownwards(editor) {
  let position = editor.selection.active;
  let newPosition = position.with(
    editor.selection.end.line,
    editor.selection.end.character
  );
  editor.revealRange(new vscode.Range(editor.selection.end, newPosition));
}

function revealCursorUpwards(editor) {
  let position = editor.selection.active;
  let newPosition = position.with(
    editor.selection.start.line,
    editor.selection.start.character
  );
  editor.revealRange(new vscode.Range(editor.selection.start, newPosition));
}
