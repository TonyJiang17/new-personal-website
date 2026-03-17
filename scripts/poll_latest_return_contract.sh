#!/usr/bin/env bash
set -euo pipefail
interval=${1:-2}
max_tries=${2:-60}

for ((i=1; i<=max_tries; i++)); do
  if [ -f artifacts/returns/LATEST ]; then
    base=$(cat artifacts/returns/LATEST | tr -d '\n\r')
    path="artifacts/returns/${base}"
    if [ -f "$path" ]; then
      echo "DETECTED LATEST: $base"
      echo "---"
      sed -n '1,60p' "$path"
      exit 0
    fi
  fi
  sleep "$interval"
done

echo "TIMEOUT waiting for artifacts/returns/LATEST" >&2
exit 1
