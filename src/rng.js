/**
 * Small deterministic RNG with a familiar C-like feel, but idiomatic JS API.
 * xorshift32 is fast, portable, and good enough for simulation reproducibility.
 */
export class XorShift32 {
  constructor(seed) {
    this.state = (seed >>> 0) || 0x12345678;
  }

  nextInt() {
    // xorshift32
    let x = this.state >>> 0;
    x ^= (x << 13) >>> 0;
    x ^= (x >>> 17) >>> 0;
    x ^= (x << 5) >>> 0;
    this.state = x >>> 0;
    return this.state;
  }

  nextFloat() {
    // [0, 1)
    return (this.nextInt() >>> 0) / 0x100000000;
  }
}
