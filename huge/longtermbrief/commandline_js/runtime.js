const fs = require('fs');
const path = require('path');
const vm = require('vm');

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function joinContinuations(text) {
  return text.replace(/\\\r?\n/g, '');
}

function cleanupExpr(expr) {
  let out = expr.trim();
  if (!out) return out;

  out = out.replace(/\b__DATE__\b/g, JSON.stringify(new Date().toDateString()));
  out = out.replace(/\b__TIME__\b/g, JSON.stringify(new Date().toTimeString().slice(0, 8)));
  out = out.replace(/\bNULL\b/g, 'null');
  out = out.replace(/\bTRUE\b/g, '1');
  out = out.replace(/\bFALSE\b/g, '0');

  // Remove common C casts.
  out = out.replace(/\(\s*(unsigned|signed)?\s*(long|short|char|int|float|double|n_[A-Za-z0-9_]+)\s*\)/g, '');

  // Normalize sizeof(type) to sizeof("type").
  out = out.replace(/\bsizeof\s*\(\s*([A-Za-z_][A-Za-z0-9_\s\*]*)\s*\)/g, (_m, typeName) => {
    const clean = typeName.replace(/\s+/g, ' ').trim();
    return `sizeof(${JSON.stringify(clean)})`;
  });

  // Remove integer/float suffixes.
  out = out.replace(/(\b\d+)([uUlLfF]+)\b/g, '$1');
  out = out.replace(/(\b0x[0-9a-fA-F]+)([uUlLfF]+)\b/g, '$1');

  return out;
}

function evalExpr(expr, scope) {
  if (!expr) return undefined;
  const jsExpr = cleanupExpr(expr);
  try {
    const fn = new Function('scope', `with (scope) { return (${jsExpr}); }`);
    return fn(scope);
  } catch (_err) {
    return undefined;
  }
}

function parseEnums(text, scope) {
  const enumRegex = /enum\s+[A-Za-z_][A-Za-z0-9_]*\s*\{([\s\S]*?)\}/g;
  const typedefEnumRegex = /typedef\s+enum\s*\{([\s\S]*?)\}\s*[A-Za-z_][A-Za-z0-9_]*\s*;/g;

  const blocks = [];
  let match;
  while ((match = enumRegex.exec(text))) {
    blocks.push(match[1]);
  }
  while ((match = typedefEnumRegex.exec(text))) {
    blocks.push(match[1]);
  }

  for (const block of blocks) {
    const entries = block.split(',');
    let current = 0;
    for (const raw of entries) {
      const line = raw.trim();
      if (!line) continue;
      const parts = line.split('=');
      const name = parts[0].trim();
      if (!name) continue;
      if (parts.length > 1) {
        const value = evalExpr(parts.slice(1).join('=').trim(), scope);
        if (typeof value === 'number' && !Number.isNaN(value)) {
          current = value;
        }
      }
      if (!(name in scope)) {
        scope[name] = current;
      }
      current += 1;
    }
  }
}

function parseDefines(text, scope) {
  const lines = text.split('\n');
  const pending = [];

  for (const line of lines) {
    const match = line.match(/^\s*#define\s+(\w+)(?:\(([^)]*)\))?\s*(.*)$/);
    if (!match) continue;
    const name = match[1];
    const args = match[2];
    let body = (match[3] || '').trim();

    if (!body) {
      scope[name] = 1;
      continue;
    }

    if (args !== undefined) {
      const argList = args.split(',').map((arg) => arg.trim()).filter(Boolean);
      const cleaned = cleanupExpr(body);
      if (cleaned.includes('__VA_ARGS__') || cleaned.includes('##')) {
        scope[name] = function () { return undefined; };
        continue;
      }
      scope[name] = function (...callArgs) {
        const localScope = Object.assign({}, scope);
        for (let i = 0; i < argList.length; i++) {
          localScope[argList[i]] = callArgs[i];
        }
        return evalExpr(cleaned, localScope);
      };
      continue;
    }

    const value = evalExpr(body, scope);
    if (value === undefined || Number.isNaN(value)) {
      pending.push({ name, expr: body });
      continue;
    }
    scope[name] = value;
  }

  // Try to resolve pending defines in a few passes.
  for (let pass = 0; pass < 4 && pending.length; pass++) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const { name, expr } = pending[i];
      const value = evalExpr(expr, scope);
      if (value !== undefined && !Number.isNaN(value)) {
        scope[name] = value;
        pending.splice(i, 1);
      }
    }
  }
}

function loadHeaders(headerPaths) {
  const scope = {
    Math,
    Date,
  };

  for (const headerPath of headerPaths) {
    let text = fs.readFileSync(headerPath, 'utf8');
    text = joinContinuations(text);
    text = stripComments(text);
    parseEnums(text, scope);
    parseDefines(text, scope);
  }

  return scope;
}

function makeCStringFromString(str, max) {
  const array = [];
  const limit = max ? Math.max(0, max - 1) : str.length;
  const len = Math.min(str.length, limit);
  for (let i = 0; i < len; i++) {
    array[i] = str[i];
  }
  array[len] = 0;
  return array;
}

function cStringToString(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return String(value);
  let out = '';
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === 0 || ch === '\0' || ch === undefined) break;
    if (typeof ch === 'number') {
      out += String.fromCharCode(ch);
    } else {
      out += ch;
    }
  }
  return out;
}

function writeCString(dest, str, max) {
  if (!dest) return dest;
  const src = typeof str === 'string' ? str : cStringToString(str);
  const limit = max ? Math.max(0, max - 1) : src.length;
  const len = Math.min(src.length, limit);
  for (let i = 0; i < len; i++) {
    dest[i] = src[i];
  }
  dest[len] = 0;
  return dest;
}

function cStringLength(value, max) {
  if (value == null) return 0;
  if (typeof value === 'string') {
    return max ? Math.min(value.length, max) : value.length;
  }
  if (!Array.isArray(value) && !ArrayBuffer.isView(value)) {
    return String(value).length;
  }
  const limit = max != null ? Math.min(max, value.length || 0) : (value.length || 0);
  let len = 0;
  for (; len < limit; len++) {
    const ch = value[len];
    if (ch === 0 || ch === '\0' || ch === undefined) break;
  }
  return len;
}

function installRuntime(ctx) {
  const randState = { seed: 1 };

  ctx.__cstrFromString = (str, max) => makeCStringFromString(str, max || ctx.STRING_BLOCK_SIZE || 4096);
  ctx.__cstrToString = (value) => cStringToString(value);
  ctx.__cstrWrite = (dest, str, max) => writeCString(dest, str, max || ctx.STRING_BLOCK_SIZE || 4096);
  ctx.strlen = (value) => cStringLength(value);

  ctx.sizeof = (type) => {
    const pointerSize = 8;
    if (type == null) return 0;
    const name = String(type).trim();
    if (name.endsWith('*')) return pointerSize;
    const map = {
      n_byte: 1,
      n_byte2: 2,
      n_byte4: 4,
      n_uint: 4,
      n_int: 4,
      n_c_int: 4,
      n_double: 8,
      n_string: pointerSize,
      n_string_block: ctx.STRING_BLOCK_SIZE || 4096,
    };
    if (map[name] !== undefined) return map[name];
    return 1;
  };

  const elementLength = (buffer, length) => {
    if (!buffer) return 0;
    const bufLength = buffer.length || 0;
    if (length == null) return bufLength;
    let len = length;
    if (ArrayBuffer.isView(buffer) && buffer.BYTES_PER_ELEMENT) {
      if (len > bufLength) {
        len = Math.floor(len / buffer.BYTES_PER_ELEMENT);
      }
    }
    if (bufLength && len > bufLength) len = bufLength;
    return len;
  };

  ctx.memcpy = (to, from, number) => {
    if (!to || !from || number == null) return to;
    const src = typeof from === 'string' ? makeCStringFromString(from, number + 1) : from;
    const len = Math.min(elementLength(src, number), elementLength(to, number));
    for (let i = 0; i < len; i++) {
      to[i] = src[i];
    }
    return to;
  };

  ctx.memset = (buffer, value, length) => {
    if (!buffer || length == null) return buffer;
    if (Array.isArray(buffer) && buffer.length && (Array.isArray(buffer[0]) || ArrayBuffer.isView(buffer[0]))) {
      for (let i = 0; i < buffer.length; i++) {
        ctx.memset(buffer[i], value, length);
      }
      return buffer;
    }
    const len = elementLength(buffer, length);
    for (let i = 0; i < len; i++) {
      buffer[i] = value;
    }
    return buffer;
  };

  ctx.malloc = (bytes) => {
    const size = Math.max(0, Number(bytes) || 0);
    const arr = new Array(size);
    for (let i = 0; i < size; i++) arr[i] = 0;
    return arr;
  };

  ctx.free = (_ptr) => 0;

  ctx.time = (_ptr) => Math.floor(Date.now() / 1000);

  ctx.srand = (seed) => {
    randState.seed = (Number(seed) || 1) >>> 0;
  };

  ctx.pthread_create = (_thread, _attr, startRoutine, arg) => {
    if (typeof startRoutine === 'function') {
      startRoutine(arg);
    }
    return 0;
  };

  ctx.pthread_exit = (_code) => 0;

  ctx.parse_convert = ctx.parse_convert || ((_input, _variable, _codes) => 0);
  ctx.interpret_cleanup = ctx.interpret_cleanup || ((_interp) => 0);
  ctx.interpret_individual = ctx.interpret_individual || ((_individual) => 0);
  ctx.interpret_cycle = ctx.interpret_cycle || ((_interp, _individual, _start, _out, _in) => 0);
  ctx.apescript_variable_codes = ctx.apescript_variable_codes || 0;

  ctx.rand = () => {
    randState.seed = (1103515245 * randState.seed + 12345) & 0x7fffffff;
    return randState.seed;
  };

  ctx.printf = (fmt, ...args) => {
    const text = ctx.__formatC(fmt, args);
    process.stdout.write(text);
  };

  ctx.sprintf = (dest, fmt, ...args) => {
    const text = ctx.__formatC(fmt, args);
    if (dest && Array.isArray(dest)) {
      writeCString(dest, text, dest.length || (ctx.STRING_BLOCK_SIZE || 4096));
    }
    return text;
  };

  ctx.perror = (message) => {
    const msg = typeof message === 'string' ? message : cStringToString(message);
    process.stderr.write(`${msg}\n`);
  };

  ctx.fflush = (_stream) => 0;

  ctx.fgets = (buffer, length, _stream) => {
    if (!buffer) return 0;
    const queue = ctx.__inputQueue || [];
    if (!queue.length) return 0;
    const line = queue.shift();
    writeCString(buffer, line, length);
    return buffer;
  };

  ctx.stdin = {};
  ctx.stdout = {};
  ctx.stderr = {};

  ctx.IS_RETURN = (val) => val === 10 || val === 13 || val === '\n' || val === '\r';
  ctx.IS_SPACE = (val) => val === 32 || val === ' ';
  ctx.ASCII_NUMBER = (val) => {
    if (typeof val === 'number') return val >= 48 && val <= 57;
    return val >= '0' && val <= '9';
  };

  ctx.SHOW_ERROR = (message) => {
    const msg = typeof message === 'string' ? message : cStringToString(message);
    process.stderr.write(`ERROR: ${msg}\n`);
    return -1;
  };

  ctx.__formatC = (fmt, args) => {
    const format = typeof fmt === 'string' ? fmt : cStringToString(fmt);
    let index = 0;
    const out = format.replace(/%%|%([0-9]*)(?:\.([0-9]+))?([l]?)([dufs])?/g, (match, width, precision, _lflag, type) => {
      if (match === '%%') return '%';
      const value = args[index++];
      const spec = type || 'f';
      let text = '';
      if (spec === 's') {
        text = cStringToString(value);
      } else if (spec === 'd' || spec === 'u') {
        const num = Number(value) || 0;
        text = String(Math.trunc(num));
      } else if (spec === 'f') {
        const num = Number(value) || 0;
        if (precision !== undefined) {
          text = num.toFixed(Number(precision));
        } else {
          text = String(num);
        }
      } else {
        text = String(value);
      }

      if (width) {
        const w = Number(width);
        if (!Number.isNaN(w) && w > text.length) {
          const padChar = width.startsWith('0') ? '0' : ' ';
          text = padChar.repeat(w - text.length) + text;
        }
      }

      return text;
    });

    return out;
  };

  ctx.abs = Math.abs;
  ctx.floor = Math.floor;
  ctx.ceil = Math.ceil;
  ctx.sqrt = Math.sqrt;
  ctx.sin = Math.sin;
  ctx.cos = Math.cos;
  ctx.tan = Math.tan;
  ctx.atan2 = Math.atan2;
  ctx.pow = Math.pow;
  ctx.log = Math.log;
  ctx.exp = Math.exp;
  ctx.fmod = (a, b) => a % b;

  return ctx;
}

function installOverrides(ctx) {
  ctx.sizeof = ctx.sizeof || ((_) => 1);

  ctx.memory_copy = (from, to, number) => ctx.memcpy(to, from, number);
  ctx.memory_erase = (buffer, length) => ctx.memset(buffer, 0, length);
  ctx.memory_new = (bytes) => ctx.malloc(bytes);
  ctx.memory_free = (_ptr) => 0;
  ctx.memory_new_range = (memory_min, memory_allocated) => {
    let size = Number(memory_allocated) || 0;
    const min = Number(memory_min) || 0;
    while (size > 0 && size >= min) {
      const buf = ctx.malloc(size);
      if (buf) return buf;
      size = Math.floor((size * 3) / 4);
    }
    return ctx.malloc(min);
  };

  ctx.io_length = (value, max) => {
    if (value == null) return 0;
    if (typeof value === 'string') return Math.min(value.length, max || value.length);
    let len = 0;
    const limit = max || value.length || 0;
    while (len < limit) {
      const ch = value[len];
      if (ch === 0 || ch === '\0' || ch === undefined) break;
      len++;
    }
    return len;
  };

  ctx.IS_RETURN = (val) => val === 10 || val === 13 || val === '\n' || val === '\r';
  ctx.IS_SPACE = (val) => val === 32 || val === ' ';
  ctx.ASCII_NUMBER = (val) => {
    if (typeof val === 'number') return val >= 48 && val <= 57;
    return val >= '0' && val <= '9';
  };

  ctx.io_find = (check, from, max, valueFind, valueFindLength) => {
    const hay = cStringToString(check).slice(from, max);
    const needle = cStringToString(valueFind).slice(0, valueFindLength || undefined);
    if (!needle) return -1;
    const idx = hay.indexOf(needle);
    return idx === -1 ? -1 : idx + from + needle.length;
  };

  ctx.io_lower = (value, length) => {
    if (!value) return;
    const limit = length || value.length || 0;
    for (let i = 0; i < limit; i++) {
      const ch = value[i];
      if (ch === 0 || ch === '\0' || ch === undefined) break;
      if (typeof ch === 'number') {
        const lower = String.fromCharCode(ch).toLowerCase();
        value[i] = lower.charCodeAt(0);
      } else {
        value[i] = String(ch).toLowerCase();
      }
    }
  };

  ctx.IO_LOWER_CHAR = (val) => {
    if (typeof val === 'number') {
      return String.fromCharCode(val).toLowerCase().charCodeAt(0);
    }
    return String(val).toLowerCase();
  };

  ctx.io_string_write = (dest, insert, pos) => {
    if (!dest) return 0;
    const start = (pos && typeof pos === 'object' && typeof pos.value === 'number')
      ? pos.value
      : ctx.io_length(dest, ctx.STRING_BLOCK_SIZE || 4096);
    const src = cStringToString(insert);
    for (let i = 0; i < src.length; i++) {
      dest[start + i] = src[i];
    }
    dest[start + src.length] = 0;
    if (pos && typeof pos === 'object') {
      pos.value = start + src.length;
    }
    return start + src.length;
  };

  ctx.io_three_string_combination = (output, first, second, third, count) => {
    if (!output) return;
    const firstStr = cStringToString(first);
    const secondStr = cStringToString(second);
    const thirdStr = cStringToString(third);
    const total = Math.max(0, count - (firstStr.length + secondStr.length + 1));

    let pos = 0;
    output[pos++] = ' ';
    for (let i = 0; i < firstStr.length; i++) output[pos++] = firstStr[i];
    output[pos++] = ' ';
    for (let i = 0; i < secondStr.length; i++) output[pos++] = secondStr[i];
    for (let i = 0; i < total; i++) output[pos++] = ' ';
    for (let i = 0; i < thirdStr.length; i++) output[pos++] = thirdStr[i];
    output[pos] = 0;
  };

  ctx.io_number_to_string = (value, number) => {
    const num = Number(number) || 0;
    const str = String(Math.trunc(num));
    writeCString(value, str, (ctx.STRING_BLOCK_SIZE || 4096));
  };

  ctx.io_string_number = (outputString, inputString, number) => {
    const head = cStringToString(inputString);
    const tail = String(Math.trunc(Number(number) || 0));
    writeCString(outputString, head + tail, (ctx.STRING_BLOCK_SIZE || 4096));
  };

  ctx.io_three_strings = (outputString, firstString, secondString, thirdString, newLine) => {
    const first = cStringToString(firstString);
    const second = cStringToString(secondString);
    const third = cStringToString(thirdString);
    const newline = newLine ? '\r\n' : '';
    writeCString(outputString, `${first}${second}${third}${newline}`, (ctx.STRING_BLOCK_SIZE || 4096));
  };

  ctx.io_string_copy = (stringValue) => {
    const str = cStringToString(stringValue);
    return makeCStringFromString(str, str.length + 1);
  };

  ctx.io_string_copy_buffer = (stringValue, buffer) => {
    writeCString(buffer, cStringToString(stringValue), (ctx.STRING_BLOCK_SIZE || 4096));
  };

  ctx.io_assert = (message, fileLoc, line) => {
    const msg = cStringToString(message);
    const file = cStringToString(fileLoc);
    process.stderr.write(`Assert: ${msg}, ${file}, ${line}\n`);
  };

  ctx.NA_ASSERT = (_test, _message) => {};

  ctx.io_number = (numberString) => {
    const str = cStringToString(numberString).trim();
    if (!str) return -1;
    const num = Number(str);
    if (Number.isNaN(num)) return ctx.SHOW_ERROR('number contains non-numeric value');
    return Math.trunc(num);
  };

  ctx.memory_execute = (fn) => {
    if (typeof ctx.memory_execute_set === 'function') {
      ctx.memory_execute_set(fn);
    }
  };

  return ctx;
}

function createContext() {
  const base = {
    console,
    process,
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Math,
    Date,
    Number,
    String,
    Array,
    Object,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int32Array,
    JSON,
    isNaN,
    parseInt,
    parseFloat,
  };

  const proxy = new Proxy(base, {
    has: () => true,
    get(target, prop) {
      if (prop in target) return target[prop];
      return 0;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  });

  vm.createContext(proxy);
  return proxy;
}

function loadModules(ctx, filePaths) {
  for (const filePath of filePaths) {
    const code = fs.readFileSync(filePath, 'utf8');
    vm.runInContext(code, ctx, { filename: filePath });
  }
}

module.exports = {
  createContext,
  loadHeaders,
  installRuntime,
  installOverrides,
  loadModules,
  cStringToString,
};
