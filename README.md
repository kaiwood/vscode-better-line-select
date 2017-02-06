# Better Line Select

Line selection on steroids.

## Features

This extension does the following:

- Select whole lines, **including** the next newline symbol (`\n`)
- Expand the line selection downwards (`cmd+l` / `ctrl+l`)
- Expand the line selection upwards (`cmd+shift+l` / `ctrl+shift+l`)
- Most important: **Keep** already selected text when switching directions!

## Extension Settings

If you don't like the opinionated shortcuts of this extension, you can unbind them via (substitute `cmd` / `ctrl` depending on your platform):

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
