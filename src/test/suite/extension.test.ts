import * as assert from "assert";
import * as vscode from "vscode";

const DOWNWARD_COMMAND = "better-line-select.downward";
const UPWARD_COMMAND = "better-line-select.upward";

suite("Better Line Select", () => {
  teardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  });

  test("downward command on an empty selection selects the current line including newline", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selection = cursorAt(1, 3);

    await vscode.commands.executeCommand(DOWNWARD_COMMAND);

    assertSelections(editor, [selectionFrom(1, 0, 2, 0)]);
  });

  test("repeated downward command expands the selection downward", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selection = cursorAt(0, 2);

    await vscode.commands.executeCommand(DOWNWARD_COMMAND);
    await vscode.commands.executeCommand(DOWNWARD_COMMAND);

    assertSelections(editor, [selectionFrom(0, 0, 2, 0)]);
  });

  test("downward command from the final line selects that line", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selection = cursorAt(2, 3);

    await vscode.commands.executeCommand(DOWNWARD_COMMAND);

    assertSelections(editor, [selectionFrom(2, 0, 2, 5)]);
  });

  test("upward command on an empty selection selects the current line upward with the cursor at the top", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selection = cursorAt(1, 3);

    await vscode.commands.executeCommand(UPWARD_COMMAND);

    assertSelections(editor, [selectionFrom(2, 0, 1, 0)]);
  });

  test("upward command from the final line selects that line before expanding further", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selection = cursorAt(2, 3);

    await vscode.commands.executeCommand(UPWARD_COMMAND);

    assertSelections(editor, [selectionFrom(2, 5, 2, 0)]);

    await vscode.commands.executeCommand(UPWARD_COMMAND);

    assertSelections(editor, [selectionFrom(2, 5, 1, 0)]);
  });

  test("switching directions keeps already selected text", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selection = cursorAt(1, 3);

    await vscode.commands.executeCommand(DOWNWARD_COMMAND);
    await vscode.commands.executeCommand(UPWARD_COMMAND);

    assertSelections(editor, [selectionFrom(2, 0, 0, 0)]);
  });

  test("multiple cursors produce multiple downward selections", async () => {
    const editor = await openEditor("first\nsecond\nthird");
    editor.selections = [cursorAt(0, 1), cursorAt(2, 2)];

    await vscode.commands.executeCommand(DOWNWARD_COMMAND);

    assertSelections(editor, [
      selectionFrom(0, 0, 1, 0),
      selectionFrom(2, 0, 2, 5)
    ]);
  });

  test("upward command at document start does not throw", async () => {
    const editor = await openEditor("first\nsecond");
    editor.selection = cursorAt(0, 0);

    await vscode.commands.executeCommand(UPWARD_COMMAND);

    assertSelections(editor, [cursorAt(0, 0)]);
  });

  test("commands do nothing safely when no active text editor exists", async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");

    await vscode.commands.executeCommand(DOWNWARD_COMMAND);
    await vscode.commands.executeCommand(UPWARD_COMMAND);
  });
});

async function openEditor(content: string): Promise<vscode.TextEditor> {
  const document = await vscode.workspace.openTextDocument({
    content,
    language: "plaintext"
  });

  return vscode.window.showTextDocument(document);
}

function cursorAt(line: number, character: number): vscode.Selection {
  return selectionFrom(line, character, line, character);
}

function selectionFrom(
  anchorLine: number,
  anchorCharacter: number,
  activeLine: number,
  activeCharacter: number
): vscode.Selection {
  return new vscode.Selection(
    new vscode.Position(anchorLine, anchorCharacter),
    new vscode.Position(activeLine, activeCharacter)
  );
}

function assertSelections(
  editor: vscode.TextEditor,
  expectedSelections: vscode.Selection[]
): void {
  assert.deepStrictEqual(
    editor.selections.map(selectionToPlainObject),
    expectedSelections.map(selectionToPlainObject)
  );
}

function selectionToPlainObject(selection: vscode.Selection): object {
  return {
    anchor: {
      line: selection.anchor.line,
      character: selection.anchor.character
    },
    active: {
      line: selection.active.line,
      character: selection.active.character
    }
  };
}
