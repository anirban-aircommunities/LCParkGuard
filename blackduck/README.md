# Black Duck / Polaris — LCParkGuard

Scan and triage artifacts for **Park Guard** (`react-native@0.84.1`).

## Before every Polaris scan

1. From **`LCParkGuard/`** (this directory’s parent):
   ```bash
   npm ci
   cd ios && pod install && cd ..
   ```
2. Commit and push:
   - `package.json`
   - `package-lock.json`
   - `ios/Podfile.lock`
3. Run local verification:
   ```bash
   npm run blackduck:verify
   ```
   Must show **react-native 0.84.1** and **hermes-compiler 250829098.0.9**.  
   If you see **0.83.1** or **0.14.0**, fix the lockfile before scanning.

## npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `blackduck:verify` | `./scripts/blackduck-scan.sh verify` | Print lockfile versions; fail on stale Hermes/RN |
| `blackduck:sbom` | `./scripts/blackduck-scan.sh sbom` | Generate `blackduck/output/bom.json` (CycloneDX) |
| `blackduck:preflight` | `./scripts/blackduck-scan.sh preflight` | Same as verify + lockfile presence checks |
| `blackduck:detect` | `./scripts/blackduck-scan.sh detect` | Run Synopsys Detect (needs `DETECT_JAR`, `BLACKDUCK_*`) |

## Polaris / CI scan path

| Setting | Value |
|---------|--------|
| Project directory | **`LCParkGuard`** (not monorepo root unless Detect sets `detect.source.path`) |
| npm lockfile | `LCParkGuard/package-lock.json` |
| CocoaPods lockfile | `LCParkGuard/ios/Podfile.lock` |
| Detect properties | `LCParkGuard/blackduck/synopsys-detect.properties` |

If the dependency tree shows **`react-native/0.83.1`** or **`hermes-compiler/0.14.0`**, the scan did **not** use the current branch — open a new PR or re-run on the branch that contains the 0.84.1 lockfile.

## Triage

- **[POLARIS_ISSUES.md](./POLARIS_ISSUES.md)** — copy-paste **Not Affected** comments per Polaris issue ID  
- [TRIAGE.md](./TRIAGE.md) — workflow and checklists  
- [component-manifest.json](./component-manifest.json) — version corrections

## Generated output

`blackduck/output/` is gitignored. Regenerate with `npm run blackduck:sbom`.
