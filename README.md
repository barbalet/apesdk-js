# commandline (JavaScript)

Console-only Node.js port of the `commandline.zip` (C implementation of minimalist ApeSDK).

## Run

```bash
npm install
npm run build
./bin/commandline
```

Type `help` to see available commands. Use `quit` (or Ctrl+C) to exit.

## Non-interactive / bounded runs

```bash
./bin/commandline --run 10 --no-prompt
```

## Save / load

```bash
save realtime.json
load realtime.json
```

## Note

This JS port stores a JSON snapshot for portability.

## Description

This holds the reduced version of the ApeSDK primarily designed to produce a command line version with minimal additional processing.

Simulated Ape (formerly known as *Nervana* and *Noble Ape*) has been in development since 1996.

It features a number of autonomous simulation components including:

* landscape simulation, 
* biological simulation,
* weather simulation,
* sentient creature simulation (including a number of internal biological simulations), and,
* a simple intelligent-agent scripting language (ApeScript).

Build instructions can be found in /apesdk/BUILD.md

## Contents

This project contains a concise version of the ApeSDK specially for other language ports. It has currently been used for providing a Python interface for the ApeSDK.
