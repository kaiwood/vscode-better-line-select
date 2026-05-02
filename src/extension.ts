import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext): void {
  const downward = vscode.commands.registerCommand(
    "better-line-select.downward",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const newSelections: vscode.Selection[] = [];

      for (const selection of editor.selections) {
        const startOfSelection = new vscode.Position(selection.start.line, 0);
        let endOfSelection: vscode.Position;

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

      revealCursorDownwards(editor); // TODO: Check which cursor should be revealed
    }
  );

  const upward = vscode.commands.registerCommand(
    "better-line-select.upward",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      // If any cursor is already at the first line, do nothing to dodge an exception.
      if (editor.selections.some((selection) => selection.start.line === 0)) {
        return;
      }

      const newSelections: vscode.Selection[] = [];

      for (const selection of editor.selections) {
        let startOfSelection: vscode.Position;
        let endOfSelection: vscode.Position;

        if (hasSelection(selection)) {
          // These positions are swapped on each keypress to keep the blinking cursor at the top.
          endOfSelection = new vscode.Position(selection.start.line - 1, 0);
          startOfSelection = new vscode.Position(selection.end.line, 0);
        } else {
          const currentLine = selection.start.line;

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

export function deactivate(): void {}

function hasSelection(selection: vscode.Selection): boolean {
  return !selection.isEmpty;
}

function revealCursorDownwards(editor: vscode.TextEditor): void {
  const position = editor.selection.active;
  const newPosition = position.with(
    editor.selection.end.line,
    editor.selection.end.character
  );
  editor.revealRange(new vscode.Range(editor.selection.end, newPosition));
}

function revealCursorUpwards(editor: vscode.TextEditor): void {
  const position = editor.selection.active;
  const newPosition = position.with(
    editor.selection.start.line,
    editor.selection.start.character
  );
  editor.revealRange(new vscode.Range(editor.selection.start, newPosition));
}
