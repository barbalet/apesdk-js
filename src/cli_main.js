import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { SimEngineJS } from "./engine_js.js";

/**
 * simape-js
 *
 * Idioms used:
 * - ESM modules (type=module)
 * - Small single-purpose modules
 * - Explicit dependency injection (output, input)
 * - Async/await for process + interactive flows
 */

function parseArgs(args) {
  const out = {
    native: false,
    engine: "js", // "js" | "native" | "native-lib"
    seed: null,
    output: "realtime.txt",
    cycles: null,
    interactive: true,
    passThrough: []
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];

    if (a === "--native") { out.native = true; out.engine = "native"; continue; }
    if (a === "--engine") { out.engine = (args[++i] ?? "js"); out.native = out.engine === "native"; continue; }
    if (a === "--native-lib") { out.engine = "native-lib"; continue; }

    if (a === "--seed") { out.seed = Number(args[++i]); continue; }
    if (a === "--output") { out.output = String(args[++i] ?? out.output); continue; }
    if (a === "--cycles") { out.cycles = Number(args[++i]); out.interactive = false; continue; }
    if (a === "--no-interactive") { out.interactive = false; continue; }
    if (a === "-h" || a === "--help") { out.help = true; continue; }

    // Anything unknown we pass to native simape (keeps compatibility while we port).
    out.passThrough.push(a);
  }

  // Keep a stable default seed in JS mode if none provided.
  if (out.seed == null || Number.isNaN(out.seed)) out.seed = Date.now() >>> 0;

  return out;
}

function printHelp() {
  console.log(`simape-js

Usage:
  simape-js [--engine js|native] [--native] [--seed N] [--output FILE] [--cycles N]

  simape-js --native-lib

Modes:
  --engine js       Run the incremental JS port scaffold (default)
  --engine native   Run the original C simape binary via Node wrapper
  --engine native-lib  Run the C core via a Node native addon (lib_* API)
  --native          Alias for --engine native
  --native-lib      Alias for --engine native-lib

Options:
  --seed N          RNG seed (default: time-based)
  --output FILE     Output filename (default: realtime.txt)
  --cycles N        Run N cycles non-interactively (JS engine only for now)
  --no-interactive  Disable interactive REPL (JS engine only)
  -h, --help        Show this help

Notes:
  - Unknown flags are forwarded to the native simape when using --engine native.
  - JS engine currently ports the CLI/control flow in clean JS idioms; simulation internals can be migrated module-by-module.
  - native-lib requires: npm run build:native-lib
`);
}

async function runNativeLib() {
  // ESM-friendly require of the compiled addon.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);

  let addon;
  try {
    addon = require("../dist/native/longtermbrief.node");
  } catch (e) {
    throw new Error(
      "Native addon not found. Build it with: npm run build:native-lib\n" +
      "Underlying error: " + (e?.message ?? String(e))
    );
  }

  addon.init();

  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const prompt = () => rl.prompt(true);
  rl.setPrompt("> ");
  prompt();

  rl.on("line", (line) => {
    const input = line.trimEnd();
    addon.checkString(input + "\n");
    if (!addon.quitCheck()) {
      addon.close();
      rl.close();
      return;
    }
    prompt();
  });

  rl.on("close", () => {
    try { addon.close(); } catch {}
  });
}

async function runNative(passThrough) {
  const bin = resolve("dist/native/simape");
  if (!existsSync(bin)) {
    throw new Error(`Native simape not found at ${bin}. Run: npm run build:native`);
  }

  // Pipe stdio so the native interactive console (if enabled) works as-is.
  const child = spawn(bin, passThrough, { stdio: "inherit" });
  const code = await new Promise((res) => child.on("exit", res));
  process.exitCode = code ?? 0;
}

async function runJs(opts) {
  const engine = new SimEngineJS({ seed: opts.seed, outputFile: opts.output });

  if (opts.cycles != null && Number.isFinite(opts.cycles)) {
    engine.init();
    for (let i = 0; i < opts.cycles; i++) engine.tick();
    engine.flush();
    return;
  }

  engine.init();

  if (!opts.interactive) {
    // Default: run a small number of cycles so "non-interactive" isn't a no-op.
    for (let i = 0; i < 1024; i++) engine.tick();
    engine.flush();
    return;
  }

  console.log("simape-js (JS engine) interactive console. Type 'help' for commands; 'quit' to exit.");
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

  const prompt = () => rl.prompt(true);
  rl.setPrompt("> ");
  prompt();

  rl.on("line", (line) => {
    const input = line.trim();
    if (!input) return prompt();

    const [cmd, ...rest] = input.split(/\s+/);

    switch (cmd.toLowerCase()) {
      case "help":
        console.log("Commands: help, step [n], status, seed, output, quit");
        break;
      case "step": {
        const n = Number(rest[0] ?? 1);
        const steps = Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1;
        for (let i = 0; i < steps; i++) engine.tick();
        console.log(`Stepped ${steps} cycles.`);
        break;
      }
      case "status":
        console.log(engine.status());
        break;
      case "seed":
        console.log(`seed=${engine.seed}`);
        break;
      case "output":
        console.log(`output=${engine.outputFile}`);
        break;
      case "quit":
      case "exit":
        engine.flush();
        rl.close();
        return;
      default:
        console.log(`Unknown command: ${cmd}`);
        break;
    }

    prompt();
  });

  rl.on("close", () => {
    console.log("bye");
  });
}

export async function runCli(args) {
  const opts = parseArgs(args);
  if (opts.help) return printHelp();

  if (opts.engine === "native" || opts.native) {
    // Forward everything we didn't parse so it behaves like simape while porting.
    return runNative(opts.passThrough.length ? opts.passThrough : ["-c"]);
  }

  if (opts.engine === "native-lib") {
    return runNativeLib();
  }

  return runJs(opts);
}
