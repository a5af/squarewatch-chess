# Project Context - Chess Overlay Extension

## Current State (as of 2025-10-02)

### Version
- **Current Version**: 0.1.0 (early beta)
- Both `package.json` and `manifest.json` synced to 0.1.0

### Recent Implementation: Automated Release Workflow

#### What Was Built
1. **Version Management Script** (`scripts/version-bump.js`)
   - Syncs version across package.json and manifest.json
   - Creates git commit and tag automatically
   - Usage: `npm run version:patch|minor|major`

2. **GitHub Actions Release Workflow** (`.github/workflows/release.yml`)
   - Triggers on git tags matching `v*.*.*`
   - Runs tests before releasing
   - Builds extension
   - Creates `.zip` package for Chrome Web Store
   - Auto-generates changelog from commits
   - Creates GitHub release with downloadable artifacts
   - Automatically marks beta/alpha/rc versions as pre-releases

3. **Documentation**
   - `DEPLOYMENT_PLAN.md`: Complete deployment strategy and roadmap
   - Updated `README.md`: Release process instructions
   - Added release section with step-by-step guide

#### NPM Scripts Added
```json
"version:patch": "node scripts/version-bump.js patch",
"version:minor": "node scripts/version-bump.js minor",
"version:major": "node scripts/version-bump.js major"
```

### Git Status
- **Branch**: main
- **Last Commit**: 904c0da - "feat: add automated release workflow and version management"
- **Pushed**: Yes, to origin/main
- **Remote**: github.com:a5af/chess-overlay-extension.git

### Release Process

#### For Beta Releases
```bash
git tag v0.1.0-beta.1
git push --tags
```
Automatically creates pre-release on GitHub.

#### For Production Releases
```bash
npm run version:patch  # or :minor, :major
git push --tags
```

#### What Happens Automatically
1. GitHub Actions workflow triggers
2. Tests run (must pass)
3. Extension builds
4. ZIP created: `chess-overlay-extension-v{version}.zip`
5. Changelog generated from git commits
6. GitHub release created with ZIP attachment
7. Pre-release flag set for beta/alpha/rc versions

### Next Steps (Not Yet Done)

#### Phase 2: Chrome Web Store Automation (Week 2)
- Set up Chrome Web Store API credentials
- Add automated publishing to workflow
- Store secrets in GitHub repository settings

#### Phase 3: Version Management Enhancements
- Consider adding `standard-version` for conventional commits
- Add commitlint for commit message validation
- Create release checklist template

### Project Structure
```
chess-overlay-extension/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: tests, build, coverage
│       └── release.yml         # NEW: Release automation
├── scripts/
│   └── version-bump.js         # NEW: Version sync script
├── src/                        # Extension source code
├── dist/                       # Build output (gitignored)
├── DEPLOYMENT_PLAN.md          # NEW: Deployment strategy
├── README.md                   # Updated with release process
├── package.json                # v0.1.0 + new scripts
└── manifest.json               # v0.1.0 (synced)
```

### Technology Stack
- **Framework**: SolidJS 1.8+
- **Build Tool**: Vite 5+
- **Language**: TypeScript 5+
- **Extension Plugin**: @crxjs/vite-plugin 2.0
- **Testing**: Vitest
- **CI/CD**: GitHub Actions

### Key Design Decisions

1. **Version at 0.1.0**: Early beta, not production ready
2. **Pre-release Support**: Beta/alpha/rc tags automatically marked
3. **No Co-authorship**: Git commits exclude Claude attribution
4. **Manual Chrome Web Store**: Semi-automated for now (Phase 1 complete)
5. **Version Sync Script**: Ensures package.json ↔ manifest.json consistency

### Outstanding Items
- [ ] Test release workflow with `v0.1.0-beta.1` tag
- [ ] Set up Chrome Web Store API (Phase 2)
- [ ] Add automated Chrome Web Store publishing (Phase 2)
- [ ] Consider conventional commits tooling (Phase 3)

### Important Notes
- All releases require git tags (e.g., `v0.1.0`, `v0.1.0-beta.1`)
- Tests must pass before release workflow succeeds
- ZIP files are ready for Chrome Web Store upload
- Changelog auto-generated from commit history
- Pre-releases: any version with `beta`, `alpha`, or `rc` in tag

### Recent Commits
```
904c0da feat: add automated release workflow and version management
1a5cbb2 New Arch
e1c68b8 misc updates
6a40cf1 modularize
99eb50c overlay working
```

### Environment
- **Platform**: Windows (win32)
- **Node.js**: 18.x, 20.x, 22.x (CI tested)
- **Git Remote**: GitHub (a5af/chess-overlay-extension)
