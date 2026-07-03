#!/usr/bin/env bash
# Black Duck / Polaris helpers for LCParkGuard.
# Usage:
#   ./scripts/blackduck-scan.sh verify     # Lockfile versions; exit 1 if stale RN/Hermes
#   ./scripts/blackduck-scan.sh preflight  # verify + required files for CI
#   ./scripts/blackduck-scan.sh sbom       # CycloneDX → blackduck/output/bom.json
#   ./scripts/blackduck-scan.sh detect     # Synopsys Detect (DETECT_JAR + BLACKDUCK_*)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p blackduck/output

cmd="${1:-verify}"

STALE_RN="0.83"
STALE_HERMES="0.14.0"
EXPECTED_RN="0.84.1"
EXPECTED_HERMES="250829098.0.9"

verify_versions() {
  local fail=0
  echo "=== LCParkGuard — Black Duck version verification ==="
  echo ""

  if [[ ! -f package-lock.json ]]; then
    echo "ERROR: package-lock.json missing — commit lockfile before Polaris scan"
    return 1
  fi

  node -e "
    const lock = require('./package-lock.json');
    const pkg = require('./package.json');
    const rn = lock.packages['node_modules/react-native'];
    const react = lock.packages['node_modules/react'];
    const hc = lock.packages['node_modules/hermes-compiler'];
    console.log('package.json react-native:', pkg.dependencies['react-native']);
    console.log('package-lock react-native: ', rn?.version);
    console.log('package.json react:         ', pkg.dependencies.react);
    console.log('package-lock react:          ', react?.version);
    console.log('package-lock hermes-compiler:', hc?.version);
    const inflight = Object.keys(lock.packages || {}).some(k => k.includes('inflight'));
    console.log('inflight in lockfile:        ', inflight ? 'YES (unexpected)' : 'no');
  "

  local rn_ver hc_ver
  rn_ver="$(node -e "console.log(require('./package-lock.json').packages['node_modules/react-native']?.version || '')")"
  hc_ver="$(node -e "console.log(require('./package-lock.json').packages['node_modules/hermes-compiler']?.version || '')")"

  if [[ "$rn_ver" != "$EXPECTED_RN" ]]; then
    echo ""
    echo "FAIL: react-native is '$rn_ver' (expected $EXPECTED_RN)"
    fail=1
  fi
  if [[ "$hc_ver" == "$STALE_HERMES" ]] || [[ "$hc_ver" == 0.14* ]]; then
    echo "FAIL: hermes-compiler is '$hc_ver' (expected $EXPECTED_HERMES)"
    fail=1
  fi
  if [[ "$rn_ver" == *"$STALE_RN"* ]]; then
    echo "FAIL: react-native $rn_ver looks like pre-0.84 scan input"
    fail=1
  fi

  if [[ -f ios/Podfile.lock ]]; then
    echo ""
    echo "ios/Podfile.lock hermes-engine:"
    grep -E 'hermes-engine \(' ios/Podfile.lock | head -1 || true
    if grep -q 'hermes-engine (0.14' ios/Podfile.lock 2>/dev/null; then
      echo "FAIL: ios still on hermes-engine 0.14.x — run pod install on RN 0.84.1"
      fail=1
    fi
  else
    echo ""
    echo "WARN: ios/Podfile.lock missing — CocoaPods scan will be incomplete"
  fi

  echo ""
  echo "react-server-dom (expect empty for CVE-2025-55182 N/A):"
  npm ls react-server-dom-webpack react-server-dom-turbopack react-server-dom-parcel 2>&1 || true

  echo ""
  if [[ $fail -eq 0 ]]; then
    echo "OK: Versions match RN 0.84.1 / Hermes V1 — safe to run Polaris scan."
  else
    echo "Fix lockfiles before Black Duck scan. See blackduck/README.md"
    return 1
  fi
}

preflight() {
  verify_versions
  echo ""
  echo "=== Preflight: required scan artifacts ==="
  for f in package.json package-lock.json ios/Podfile.lock blackduck/component-manifest.json; do
    if [[ -f "$f" ]]; then
      echo "  OK  $f"
    else
      echo "  MISSING  $f"
      return 1
    fi
  done
}

generate_sbom() {
  echo "Generating CycloneDX SBOM → blackduck/output/bom.json"
  npx --yes @cyclonedx/cdxgen@11 -o blackduck/output/bom.json -t npm
  echo ""
  echo "Key versions in SBOM:"
  node -e "
    const bom = require('./blackduck/output/bom.json');
    const names = ['react', 'react-native', 'hermes-compiler'];
    for (const n of names) {
      const c = bom.components?.find(x => x.name === n && x.purl?.includes('pkg:npm'));
      if (c) console.log(' ', n + ':', c.version);
    }
  "
  echo ""
  echo "Upload blackduck/output/bom.json to Polaris if your workflow supports CycloneDX."
}

run_detect() {
  if [[ -z "${DETECT_JAR:-}" ]]; then
    echo "Set DETECT_JAR to synopsys-detect.jar path"
    exit 1
  fi
  if [[ -z "${BLACKDUCK_URL:-}" || -z "${BLACKDUCK_API_TOKEN:-}" ]]; then
    echo "Set BLACKDUCK_URL and BLACKDUCK_API_TOKEN"
    exit 1
  fi
  preflight
  java -jar "$DETECT_JAR" \
    --properties="$ROOT/blackduck/synopsys-detect.properties" \
    --blackduck.url="$BLACKDUCK_URL" \
    --blackduck.api.token="$BLACKDUCK_API_TOKEN"
}

case "$cmd" in
  verify)    verify_versions ;;
  preflight) preflight ;;
  sbom)      generate_sbom ;;
  detect)    run_detect ;;
  *)
    echo "Usage: $0 {verify|preflight|sbom|detect}"
    exit 1
    ;;
esac
