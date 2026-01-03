import { appendFileSync } from "node:fs";
import { XorShift32 } from "./rng.js";

/**
 * SimEngineJS
 *
 * This is a **clean-room, incremental** JS port scaffold.
 * It focuses on *control flow* + *observability* first, so you can port internals
 * module-by-module while keeping the CLI stable.
 *
 * Current behavior:
 * - Deterministic RNG
 * - "Group" placeholder with population + cycle count
 * - Output stream mirroring the original `realtime.txt` idea (simple line log)
 */
export class SimEngineJS {
  constructor({ seed, outputFile, renderer }) {
    this.seed = seed >>> 0;
    this.outputFile = outputFile ?? "realtime.txt";
    this.rng = new XorShift32(this.seed);
    this._cycle = 0;
    this._population = 0;
    this._logBuffer = [];
    this.renderer = renderer ?? null;
    this._renderEvery = 256; // throttle console rendering
  }

  init() {
    // Placeholder for sim_init()/sim_console() initialization.
    // In the full port, this becomes:
    // - parse config
    // - allocate group/world
    // - seed random
    this._population = 128 + (this.rng.nextInt() % 128); // 128..255
    this._log(`init seed=${this.seed} population=${this._population}`);
    if (this.renderer) {
      this.renderer.beginFrame(this._cycle);
      // Represent the whole group as a single entity for now.
      this.renderer.drawEntity("group", 0, 0, { population: this._population, seed: this.seed });
      this.renderer.endFrame();
    }
  }

  tick() {
    // Placeholder for sim_cycle()
    this._cycle++;

    // Toy dynamics: small drift to demonstrate determinism + logging.
    const drift = (this.rng.nextInt() % 3) - 1; // -1,0,1
    this._population = Math.max(0, this._population + drift);

    if ((this._cycle & 2047) === 0) this._log(`count is ${this._cycle}`);
    if (this.renderer && (this._cycle % this._renderEvery) === 0) {
      this.renderer.beginFrame(this._cycle);
      this.renderer.drawEntity("group", 0, 0, { population: this._population, seed: this.seed });
      this.renderer.endFrame();
    }
    if (this._population === 0) {
      this._log(`new run at ${this._cycle}`);
      // reset
      this.seed = this.rng.nextInt() >>> 0;
      this.rng = new XorShift32(this.seed);
      this._population = 128 + (this.rng.nextInt() % 128);
      this._log(`reinit seed=${this.seed} population=${this._population}`);
    }
  }

  status() {
    return {
      cycle: this._cycle,
      population: this._population,
      seed: this.seed,
      outputFile: this.outputFile
    };
  }

  flush() {
    if (!this._logBuffer.length) return;
    appendFileSync(this.outputFile, this._logBuffer.join("\n") + "\n");
    this._logBuffer.length = 0;
  }

  _log(line) {
    this._logBuffer.push(line);
    // Keep the buffer bounded in interactive mode.
    if (this._logBuffer.length >= 256) this.flush();
  }
}
