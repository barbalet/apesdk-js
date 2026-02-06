const fs = require('fs');
const path = require('path');
const readline = require('readline');
const runtime = require('./runtime');

const rootDir = path.resolve(__dirname, '..');
const headerDir = path.join(rootDir, 'commandline');

const headerPaths = fs
  .readdirSync(headerDir)
  .filter((file) => file.endsWith('.h'))
  .map((file) => path.join(headerDir, file));

const ctx = runtime.createContext();
const defines = runtime.loadHeaders(headerPaths);
Object.assign(ctx, defines);

runtime.installRuntime(ctx);

const files = [
  'toolkit_math.js',
  'toolkit_memory.js',
  'toolkit_vect.js',
  'toolkit_io.js',
  'entity_immune.js',
  'entity_episodic.js',
  'entity_social.js',
  'entity_drives.js',
  'entity_food.js',
  'entity_body.js',
  'entity_brain.js',
  'entity_being.js',
  'sim_tile.js',
  'sim_spacetime.js',
  'sim_land.js',
  'sim_console.js',
  'universe_command.js',
  'universe_loop.js',
  'universe_sim.js',
  'longterm.js',
];

runtime.loadModules(
  ctx,
  files.map((file) => path.join(__dirname, file))
);

// Reapply defines after module load to override any null placeholders.
Object.assign(ctx, defines);

runtime.installOverrides(ctx);

// Define constants from C source that live in .c files.
if (!ctx.MAX_POSSIBLE_CONTROL_CHARACTER_X && ctx.CHARACTER_WIDTH) {
  ctx.MAX_POSSIBLE_CONTROL_CHARACTER_X = Math.floor((2048 - ctx.CHARACTER_WIDTH) / ctx.CHARACTER_WIDTH);
}
if (!ctx.MAX_POSSIBLE_CONTROL_CHARACTER_Y && ctx.CHARACTER_HEIGHT) {
  ctx.MAX_POSSIBLE_CONTROL_CHARACTER_Y = Math.floor((2048 - ctx.CHARACTER_WIDTH) / ctx.CHARACTER_HEIGHT);
}

if (ctx.MAX_POSSIBLE_CONTROL_CHARACTER_X && ctx.MAX_POSSIBLE_CONTROL_CHARACTER_Y) {
  ctx.sim_control = new Array(ctx.MAX_POSSIBLE_CONTROL_CHARACTER_X * ctx.MAX_POSSIBLE_CONTROL_CHARACTER_Y);
}

// Initialize input buffer for the fake console.
ctx.fake_input_string = ctx.memory_new(ctx.STRING_BLOCK_SIZE || 4096);
ctx.fake_input_string_present = 0;

function runInteractive() {
  if (typeof ctx.python_init !== 'function') {
    console.error('python_init not available.');
    return;
  }

  ctx.python_init();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    const buffer = ctx.__cstrFromString(`${line}\n`, ctx.STRING_BLOCK_SIZE || 4096);
    ctx.python_check_string(buffer);
    if (!ctx.python_quit_check || !ctx.python_quit_check()) {
      rl.close();
    }
  });

  rl.on('close', () => {
    if (typeof ctx.python_close === 'function') {
      ctx.python_close();
    }
  });
}

function runCommandLine() {
  if (typeof ctx.command_line_run !== 'function') {
    console.error('command_line_run not available.');
    return;
  }
  ctx.command_line_run();
}

if (process.argv.includes('--commandline')) {
  runCommandLine();
} else {
  runInteractive();
}
