#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIMCODE_DIR="${ROOT_DIR}/simcode"

if [ ! -d "${SIMCODE_DIR}" ]; then
  echo "ERROR: ./simcode directory not found next to this script."
  echo "Put the provided C source tree at: ${SIMCODE_DIR}"
  exit 1
fi

echo "==> Building native simape using simcode/build.sh"
pushd "${SIMCODE_DIR}" >/dev/null
chmod +x ./build.sh
./build.sh
popd >/dev/null

# The upstream build writes ../simape relative to simcode/
NATIVE_BIN="${ROOT_DIR}/simape"
if [ ! -f "${NATIVE_BIN}" ]; then
  # fallback: maybe it wrote one level above simcode inside the original zip layout
  if [ -f "${SIMCODE_DIR}/../simape" ]; then
    NATIVE_BIN="${SIMCODE_DIR}/../simape"
  else
    echo "ERROR: native simape binary not found after build."
    echo "Looked for: ${ROOT_DIR}/simape and ${SIMCODE_DIR}/../simape"
    exit 1
  fi
fi

mkdir -p "${ROOT_DIR}/dist/native"
cp -f "${NATIVE_BIN}" "${ROOT_DIR}/dist/native/simape"
chmod +x "${ROOT_DIR}/dist/native/simape"

echo "==> Native simape copied to dist/native/simape"
echo "==> Done."
