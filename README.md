# simape-js

This repo provides:

1) **A Node.js CLI** (`simape-js`) that behaves like a typical command-line tool.
2) A **native bridge mode** (`--native`) that runs the original `simape` binary produced by the provided `simcode/build.sh`.
3) An **incremental JavaScript port** scaffold (idiomatic JS modules), so you can migrate subsystems over time without keeping the C build in the loop.

## Quick start

```npm install```

```npm run build:native```   # builds native simape from ./simcode and copies it into ./dist/native/

```npm run start:native```   # runs the native simape via Node wrapper

If you want to run the JS-only scaffold:

```bash
npm run start
```

## Notes

- The upstream C codebase is large (toolkit/, entity/, sim/, universe/, script/, etc.). A faithful full-port is substantial.
- This project intentionally starts by porting the **CLI & control flow** in clean JS idioms, while optionally delegating simulation internals to the native binary.
- As you port modules to JS, you can flip `--engine js` (default) vs `--engine native` (`--native`) without changing user workflows.
