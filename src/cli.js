#!/usr/bin/env node
import { runCli } from "./cli_main.js";

runCli(process.argv.slice(2)).catch((err) => {
  console.error(err?.stack ?? String(err));
  process.exitCode = 1;
});
