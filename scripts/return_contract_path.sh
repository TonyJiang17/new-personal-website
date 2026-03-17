#!/usr/bin/env bash
set -euo pipefail
phase_id=${1:?phase_id required (e.g. phase5)}
work_item_id=${2:?work_item_id required (e.g. WI-3.2)}
echo "artifacts/returns/${phase_id}__${work_item_id}.return.yaml"
