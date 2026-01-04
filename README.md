# simape-js

This repo provides:

1) **A Node.js CLI** (`simape-js`) that behaves like a typical command-line tool.
2) A **native bridge mode** (`--native`) that runs the original `simape` binary produced by the provided `longtermbrief/longtermbrief/build.sh`.
3) A **native addon mode** (`--native-lib`) that builds `longtermbrief` as a `MAIN_LIBRARY` and loads it directly from Node via a small N-API addon (calls `lib_*` functions).
4) An **incremental JavaScript port** scaffold (idiomatic JS modules), so you can migrate subsystems over time without keeping the C build in the loop.

## Quick start

```npm install```

```npm run build:native```   # builds native simape from ./longtermbrief/longtermbrief and copies it into ./dist/native/

```npm run start:native```   # runs the native simape via Node wrapper

Or, to run the C core as a Node addon:

```npm run build:native-lib```  # builds liblongtermbrief + dist/native/longtermbrief.node

```npm run start:native-lib```  # runs the native addon via Node wrapper

If you want to run the JS-only scaffold:

```bash
npm run start
```

## Notes

- The upstream C codebase is large (toolkit/, entity/, sim/, universe/, script/, etc.). A faithful full-port is substantial.
- This project intentionally starts by porting the **CLI & control flow** in clean JS idioms, while optionally delegating simulation internals to the native binary.
- As you port modules to JS, you can flip `--engine js` (default) vs `--engine native` (`--native`) without changing user workflows.
