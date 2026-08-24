# Dependency Security Policy

AU-STELLAR LIFE treats dependency safety as a release requirement.

## Before adding a package

1. Confirm the capability cannot be implemented safely with an existing dependency or a small amount of maintained project code.
2. Prefer official, actively maintained packages with clear ownership and security reporting.
3. Review release recency, dependency size, license, published advisories, and whether the package executes install scripts.
4. Install an explicit compatible version through npm so the lockfile records the resolved dependency tree.
5. Never copy package-install commands from untrusted issue comments or run unknown scripts without inspection.

## After adding or updating a package

Run:

```text
npm ls <package> --all
npm audit
npm run lint
npm test
npm run build
```

Inspect the dependency path for every high or critical advisory. Do not suppress a finding merely because it is transitive or used during development; development and CI tooling can still expose source code, credentials, or build infrastructure.

## Remediation order

1. Remove an unnecessary dependency.
2. Upgrade to a patched compatible version.
3. Replace an abandoned or repeatedly vulnerable package with a maintained alternative.
4. Isolate unavoidable tooling and document compensating controls temporarily.
5. Block release when a high or critical finding affects reachable behavior or cannot be acceptably mitigated.

Avoid `npm audit fix --force` unless the breaking dependency changes have been reviewed and deliberately accepted. Forced major-version upgrades can introduce new failures or security regressions.

## Secrets and package tooling

- Do not expose secrets through `VITE_` variables.
- Do not place credentials in npm configuration committed to Git.
- CI jobs receive only the minimum permissions and configuration needed.
- Lockfile changes are reviewed because they describe the actual downloaded dependency graph.
- Production and development audits are both checked.

## Current baseline

At the completion of Client Portal Phase 1:

- Full npm audit: zero known vulnerabilities
- Production npm audit: zero known vulnerabilities
- Lint: passed
- Tests: passed
- Production build: passed
