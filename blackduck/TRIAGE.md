# Black Duck / Polaris — Security Triage (LCParkGuard)

**Project:** ParkingEnforcementDevelopment / Park Guard  
**Stack:** React Native **0.84.1**, React **19.2.3**, Hermes V1 **250829098.0.9**  
**Manifest:** [component-manifest.json](./component-manifest.json)  
**Scan guide:** [README.md](./README.md)

---

## Stale scan — react-native 0.83.1 / hermes-compiler 0.14.0

If the dependency tree shows:

```
Park Guard → react-native/0.83.1 → hermes-compiler/0.14.0
```

that is **not** the current codebase. HEAD should show **0.84.1** and **250829098.0.9**.

**Fix:** Push `package-lock.json` + `ios/Podfile.lock`, scan **`LCParkGuard/`**, re-run Polaris on a **new PR/branch**. Run `npm run blackduck:verify` locally first.

---

## Step 1 — Correct component versions in Polaris

| Black Duck shows (wrong) | Set to (correct) | Evidence |
|--------------------------|------------------|----------|
| `facebookhermes` **0.14.0** | `hermes-engine` **250829098.0.9** | `ios/Podfile.lock` |
| `hermes-compiler` **0.14.0** | **250829098.0.9** | `package-lock.json` |
| `react-native` **0.83.1** | **0.84.1** | `package-lock.json` |
| `React from Facebook` **19.2.0** | **19.2.3** | `package-lock.json` |
| `boost` **1.59.0** | N/A or **ReactNativeDependencies 0.84.1** | RN 0.84 `Podfile.lock` (no boost 1.59 pod) |
| `inflight` **1.0.6** | **glob 10.5.0** (no inflight in lockfile) | `package.json` overrides |

---

## Step 2 — Hermes CVEs (`facebookhermes 0.14.0`)

**CVEs:** CVE-2020-1914, CVE-2020-1915, CVE-2022-40138, CVE-2023-23556, CVE-2023-23557, CVE-2023-24832, CVE-2023-24833  
**Disposition:** Not Affected

**Comment:**

```
Component version mismatch in Black Duck KB. Scanner matched npm hermes-compiler to facebookhermes 0.14.0
or showed react-native/0.83.1 (stale BOM).
Actual: react-native@0.84.1, hermes-compiler@250829098.0.9, hermes-engine@250829098.0.9 (ios/Podfile.lock).
Legacy CVEs target old Hermes engine builds; RN 0.84 ships Hermes V1. Park Guard runs only bundled JS.
Evidence: blackduck/component-manifest.json; npm run blackduck:verify on scan branch.
```

---

## Step 3 — React CVE-2025-55182 (issue A0782A3A4212E8412864A4DE7EDFAF10)

**Disposition:** Not Affected

**Comment:** See [POLARIS_ISSUES.md](./POLARIS_ISSUES.md) — React CVE-2025-55182 block.

---

## Step 3b — React CVE-2025-55184 (issue 9368837AEDC60CAD38F55F81532449E0)

**Disposition:** Not Affected

**Comment:** See [POLARIS_ISSUES.md](./POLARIS_ISSUES.md) — React CVE-2025-55184 block.

---

## Step 4 — Boost 1.59.0 (medium)

**Disposition:** Not Affected (version/KB mismatch)

**Comment:**

```
Black Duck component origin shows boost 1.59.0 while dependency tree may list boost 1.84.0 under RN 0.83.x — indicates stale or mixed scan.
RN 0.84.1 iOS uses ReactNativeDependencies prebuilts; boost 1.59.0 is not in current Podfile.lock.
Re-scan LCParkGuard with committed ios/Podfile.lock after pod install on 0.84.1 branch.
```

---

## Step 5 — inflight 1.0.6

**Disposition:** Remediated

**Comment:**

```
package.json overrides glob@10.5.0; package-lock.json has no inflight dependency.
Re-scan after lockfile commit.
```

---

## Re-scan checklist

- [ ] Scan root: **`LCParkGuard/`**
- [ ] **`package-lock.json`** and **`ios/Podfile.lock`** on the scanned commit
- [ ] `npm run blackduck:verify` passes (no 0.83.1 / 0.14.0)
- [ ] Optional: `npm run blackduck:sbom` → upload `blackduck/output/bom.json`
- [ ] New PR branch if baseline still shows old tree

---

## Do NOT do

- Do not set `:hermes_enabled => false` in Podfile
- Do not pin `hermes-compiler@0.14.1` override (conflicts with RN 0.84 Hermes V1)
- Do not downgrade React Native to change Black Duck labels only

---

## Issue ID quick reference

| Severity | CVE | Black Duck issue |
|----------|-----|------------------|
| Critical | CVE-2020-1914 | 4369BE4B2AD5886671B1FE1A47AF9818 |
| Critical | CVE-2023-23556 | 5084A6B09CE3A13375EAA3BF60FCFE30 |
| Critical | CVE-2023-23557 | FE8B5AB924CFBCB58E8C4A145AB77468 |
| Critical | CVE-2025-55182 | A0782A3A4212E8412864A4DE7EDFAF10 |
| High | CVE-2022-40138 | 54558AE0A410EFEC04FD47A5025C5C06 |
| High | CVE-2020-1915 | 557575701971EC88C205D52D9364D66B |
| High | CVE-2023-24832 | 2381738BD41AB641E7F1CEA3166B443B |
| High | CVE-2023-24833 | ED0A669F594693CC7C8C2FCC161ADD41 |
