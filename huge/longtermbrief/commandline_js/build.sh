#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is not available in PATH." >&2
  exit 1
fi

exec node "${SCRIPT_DIR}/cli.js" "$@"
