#!/usr/bin/env bash
set -euo pipefail
phase_id=${1:-phase5}
work_item_id=${2:-WI-TEST}

mkdir -p artifacts/returns

stamp=$(date -u +%Y-%m-%dT%H%M%SZ)
base="run_${stamp}__${phase_id}__${work_item_id}.return.yaml"
out="artifacts/returns/${base}"

tmp="$out.tmp"
cat > "$tmp" <<YAML
status: done
phase_id: "$phase_id"
work_item_ids: ["$work_item_id"]
summary_of_changes:
  - "Sample completion contract for loop testing (LATEST pointer)."
changed_files_or_pr:
  - "(none)"
test_results:
  commands_run:
    - "npm test"
  outcomes:
    - command: "npm test"
      result: pass
      notes: "sample"
evidence_paths:
  - "evidence/sample"
acceptance_check_results:
  "$work_item_id": pass
open_questions: []
next_recommended_action:
  - "OpenClaw: read artifacts/returns/LATEST and ingest this contract."
YAML
mv "$tmp" "$out"

# Update LATEST atomically
ltmp="artifacts/returns/LATEST.tmp"
echo "$base" > "$ltmp"
mv "$ltmp" artifacts/returns/LATEST

echo "Wrote $out"
echo "Updated artifacts/returns/LATEST -> $base"
