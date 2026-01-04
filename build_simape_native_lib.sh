#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LONGTERM_DIR="${ROOT_DIR}/longtermbrief/longtermbrief"
ADDON_DIR="${ROOT_DIR}/native/longtermbrief-addon"

if [ ! -d "${LONGTERM_DIR}" ]; then
  echo "ERROR: longtermbrief C tree not found at: ${LONGTERM_DIR}"; exit 1
fi
if [ ! -d "${ADDON_DIR}" ]; then
  echo "ERROR: addon sources not found at: ${ADDON_DIR}"; exit 1
fi

echo "==> Building MAIN_LIBRARY longtermbrief library"
pushd "${LONGTERM_DIR}" >/dev/null
chmod +x ./build_library.sh
./build_library.sh
popd >/dev/null

echo "==> Building Node addon (node-gyp)"
pushd "${ADDON_DIR}" >/dev/null

# Use npx so users don't need a global install.
npx --yes node-gyp configure
npx --yes node-gyp build

OUT_NODE="${ADDON_DIR}/build/Release/longtermbrief.node"
if [ ! -f "${OUT_NODE}" ]; then
  echo "ERROR: expected addon output missing at: ${OUT_NODE}"; exit 1
fi

mkdir -p "${ROOT_DIR}/dist/native"
cp -f "${OUT_NODE}" "${ROOT_DIR}/dist/native/longtermbrief.node"

popd >/dev/null

echo "==> Wrote dist/native/longtermbrief.node"
echo "==> Done. Run: npm run start:native-lib"
