# Polaris — Copy-paste triage (ParkingEnforcementDevelopment / LCParkGuard)

**Installed versions (verify with `npm run blackduck:verify`):**

| Component | Polaris shows (stale) | Actual |
|-----------|------------------------|--------|
| Hermes | `facebookhermes 0.14.0` | `hermes-engine` / `hermes-compiler` **250829098.0.9** |
| React | `React from Facebook 19.2.0` | **react@19.2.3** |
| React Native | (tree may show 0.83.1) | **react-native@0.84.1** |

**Disposition for all rows below:** **Not Affected** (unless your policy requires **Remediated** for React after confirming 19.2.3 on the scanned branch).

**Polaris steps:** Open issue → **Edit** component version (if allowed) → set disposition → paste **Comment** → Save.

---

## Hermes — use this comment for every `facebookhermes 0.14.0` issue

**CVEs:** CVE-2020-1914, CVE-2020-1915, CVE-2022-40138, CVE-2023-23556, CVE-2023-23557, CVE-2023-24832, CVE-2023-24833

```
Black Duck KB mismatch: component listed as facebookhermes 0.14.0. Park Guard (LCParkGuard) ships react-native@0.84.1 with hermes-compiler@250829098.0.9 and ios hermes-engine@250829098.0.9 (Hermes V1) per package-lock.json and ios/Podfile.lock. Listed CVEs apply to legacy Hermes engine builds (<=0.12.x era), not the RN 0.84 bundled engine. Per Meta guidance (facebook/hermes#937), exploitation requires executing attacker-controlled JavaScript in Hermes; this mobile app runs only Metro-bundled application JS. Not applicable — incorrect component/version mapping and no vulnerable runtime in shipped artifact. Evidence: LCParkGuard/blackduck/component-manifest.json; npm run blackduck:verify.
```

| Issue ID | Severity | CVE | Title |
|----------|----------|-----|-------|
| [4369BE4B2AD5886671B1FE1A47AF9818](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/4369BE4B2AD5886671B1FE1A47AF9818) | Critical | CVE-2020-1914 | Always-Incorrect Control Flow Implementation |
| [5084A6B09CE3A13375EAA3BF60FCFE30](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/5084A6B09CE3A13375EAA3BF60FCFE30) | Critical | CVE-2023-23556 | Out-of-bounds Write |
| [FE8B5AB924CFBCB58E8C4A145AB77468](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/FE8B5AB924CFBCB58E8C4A145AB77468) | Critical | CVE-2023-23557 | Access of Resource Using Incompatible Type |
| [54558AE0A410EFEC04FD47A5025C5C06](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/54558AE0A410EFEC04FD47A5025C5C06) | High | CVE-2022-40138 | Out-of-bounds Write |
| [557575701971EC88C205D52D9364D66B](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/557575701971EC88C205D52D9364D66B) | High | CVE-2020-1915 | Out-of-bounds Read |
| [2381738BD41AB641E7F1CEA3166B443B](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/2381738BD41AB641E7F1CEA3166B443B) | High | CVE-2023-24832 | NULL Pointer Dereference |
| [ED0A669F594693CC7C8C2FCC161ADD41](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/ED0A669F594693CC7C8C2FCC161ADD41) | High | CVE-2023-24833 | Use After Free |

---

## React — CVE-2025-55182 (Critical)

**Issue:** [A0782A3A4212E8412864A4DE7EDFAF10](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/A0782A3A4212E8412864A4DE7EDFAF10)  
**BDSA:** BDSA-2025-42124

```
Installed react@19.2.3 per LCParkGuard/package-lock.json (Polaris shows stale 19.2.0). CVE-2025-55182 affects react-server-dom-webpack/turbopack/parcel 19.2.0 (React Server Components / Flight deserialization on a server). This project is a React Native iOS mobile client: no react-server-dom-* packages (npm ls react-server-dom — empty), no RSC HTTP endpoint, no server-side React rendering attack surface. Not applicable — wrong component version in scan and CVE does not apply to RN client bundle. Evidence: LCParkGuard/blackduck/component-manifest.json.
```

---

## React — CVE-2025-55184 (Medium)

**Issue:** [9368837AEDC60CAD38F55F81532449E0](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/9368837AEDC60CAD38F55F81532449E0)  
**BDSA:** BDSA-2025-55369

```
Installed react@19.2.3 per LCParkGuard/package-lock.json. CVE-2025-55184 affects react-server-dom-* (pre-auth DoS via unsafe deserialization on Server Function HTTP endpoints). Park Guard does not depend on react-server-dom-webpack, react-server-dom-turbopack, or react-server-dom-parcel; it is a React Native mobile app without an exposed RSC server. Not applicable — no vulnerable package in BOM and no exploitable server surface. Evidence: npm ls react-server-dom (empty); LCParkGuard/package-lock.json.
```

---

## inflight 1.0.6 — BDSA-2017-4131 (Medium)

**Issue:** [D4B98024068B9C5B09C2426941A21932](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/D4B98024068B9C5B09C2426941A21932)  
**Disposition:** **Remediated** (or **Not Affected** if scan branch still lists inflight but LCParkGuard lockfile does not)

```
inflight@1.0.6 was a transitive dependency of deprecated glob@7 (memory leak — CWE-401 / BDSA-2017-4131).
LCParkGuard/package.json overrides glob to 10.5.0; LCParkGuard/package-lock.json contains no inflight package.
Polaris finding is from a stale BOM (scan dated 2026-04-03) or parent LCMobileApp tree before lockfile update.
Remediated on current branch — re-scan LCParkGuard with committed package-lock.json. Evidence: npm run blackduck:verify (inflight: no); grep inflight package-lock.json (empty).
```

---

## Boost 1.59.0 — use this comment for all three medium issues

**CVEs / BDSA:** CVE-2016-9840 (BDSA-2016-1107), BDSA-2018-1263, BDSA-2018-2656

```
Black Duck lists Boost C++ Libraries boost 1.59.0. LCParkGuard on react-native@0.84.1 does not ship boost 1.59.0:
ios/Podfile.lock has no boost (1.59.0) pod — RN 0.84 uses ReactNativeDependencies prebuilts.
Earlier scans under RN 0.83.x may have shown boost 1.84.0; 1.59.0 is a KB default version mismatch, not the resolved CocoaPods version.
CVE-2016-9840 and related BDSA entries target legacy Boost; not present in current iOS lockfile for this app.
Disposition: Not Affected — incorrect component/version in SCA; re-scan after RN 0.84.1 + ios/Podfile.lock commit on LCParkGuard path.
Evidence: LCParkGuard/blackduck/component-manifest.json; ios/Podfile.lock.
```

| Issue ID | Title |
|----------|-------|
| [DC2890CB87B0B3275003188877250085](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/DC2890CB87B0B3275003188877250085) | Use of Out-of-range Pointer Offset |
| [5EA4EEE3985D461D3CC7F4FDFF87807E](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/5EA4EEE3985D461D3CC7F4FDFF87807E) | Incorrect Type Conversion or Cast |
| [5907C4DA4590F1C39DC57E5DB1F3C15E](https://polaris.blackduck.com/portfolio/portfolios/fc0f6a89-b081-491c-8492-2e5a320600cc/portfolio-items/d8b9d6a5-6357-4183-9bc8-82382ecc3a44/projects/36a40f57-6ca0-4c9c-923c-927106dbbc3b/issues/5907C4DA4590F1C39DC57E5DB1F3C15E) | Buffer Over-read |

---

## After triaging

1. Re-scan the branch that contains **RN 0.84.1** lockfiles so new issues (if any) reflect current versions.
2. If issues **reappear** with correct versions, escalate to security for policy exception vs. component correction in Black Duck KB.
