#!/usr/bin/env bash
set -euo pipefail
phase_id=${1:-phase5}
work_item_id=${2:-WI-TEST}
out="artifacts/returns/${phase_id}__${work_item_id}.return.yaml"
tmp="${out}.tmp"
mkdir -p artifacts/returns
cat > "$tmp" <<YAML
status: done
phase_id: "$phase_id"
work_item_ids: ["$work_item_id"]
summary_of_changes:
  - "Sample completion contract for loop testing."
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
  - "OpenClaw: parse this file and advance the pipeline."
YAML
mv "$tmp" "$out"
echo "Wrote $out"
