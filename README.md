# Better Line Select

<p align="left">
  <img src="assets/icon.png" width="128" height="128" alt="Better Line Select icon">
</p>

Better Line Select lets you expand a line selection in both directions.

## Commands

| Command                       | Default shortcut | macOS shortcut |
| ----------------------------- | ---------------- | -------------- |
| `better-line-select.downward` | `ctrl+l`         | `cmd+l`        |
| `better-line-select.upward`   | `ctrl+shift+l`   | `cmd+shift+l`  |

You can also run both commands from the Command Palette:

- `Select Line (downward)`
- `Select Line (upward)`

## Example

Put the cursor on a line and press `cmd+l` or `ctrl+l`.

The extension selects the whole line, including its newline.

Press it again.

The selection grows by one line.

Press `cmd+shift+l` or `ctrl+shift+l`.

The selection grows upward. The lines you already selected stay selected.

## Changing The Shortcuts

If the default shortcuts conflict with your setup, remove them in your VS Code keybindings.

Use `cmd` on macOS. Use `ctrl` on Windows and Linux.

```json
{
  "key": "cmd+l",
  "command": "-better-line-select.downward"
},
{
  "key": "cmd+shift+l",
  "command": "-better-line-select.upward"
}
```

Then add your own bindings for:

- `better-line-select.downward`
- `better-line-select.upward`
