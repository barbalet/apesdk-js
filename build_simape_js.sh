#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LONGTERM_DIR="${ROOT_DIR}/longtermbrief/longtermbrief"

if [ ! -d "${LONGTERM_DIR}" ]; then
  echo "ERROR: ./longtermbrief/longtermbrief directory not found next to this script."
  echo "Ensure the longtermbrief C source tree exists at: ${LONGTERM_DIR}"
  exit 1
fi

echo "==> Building native simape using longtermbrief/longtermbrief/build.sh"
pushd "${LONGTERM_DIR}" >/dev/null
chmod +x ./build.sh
./build.sh
popd >/dev/null

# The upstream build writes ../simape relative to longtermbrief/longtermbrief/
NATIVE_BIN="${ROOT_DIR}/simape"
if [ ! -f "${NATIVE_BIN}" ]; then
  # fallback: maybe it wrote one level above longtermbrief/longtermbrief inside the original zip layout
  if [ -f "${LONGTERM_DIR}/../simape" ]; then
    NATIVE_BIN="${LONGTERM_DIR}/../simape"
  else
    echo "ERROR: native simape binary not found after build."
    echo "Looked for: ${ROOT_DIR}/simape and ${LONGTERM_DIR}/../simape"
    exit 1
  fi
fi

mkdir -p "${ROOT_DIR}/dist/native"
cp -f "${NATIVE_BIN}" "${ROOT_DIR}/dist/native/simape"
chmod +x "${ROOT_DIR}/dist/native/simape"

echo "==> Native simape copied to dist/native/simape"
echo "==> Done."
