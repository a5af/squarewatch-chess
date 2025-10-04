# Deployment Plan - SquareWatch

## Current State

### What's Working
- ✅ **CI/CD Pipeline**: GitHub Actions runs tests, coverage, and builds on every push/PR
- ✅ **Build Process**: Vite builds extension to `dist/` directory
- ✅ **Artifacts**: Build artifacts uploaded to GitHub Actions (30-day retention)
- ✅ **Version**: Currently at v2.0.0 (in manifest.json)
- ✅ **Testing**: Comprehensive test suite with coverage reporting

### What's Missing
- ❌ **Automated Releases**: No GitHub releases workflow
- ❌ **Chrome Web Store Publishing**: Manual upload process
- ❌ **Version Management**: No automated version bumping
- ❌ **Release Notes**: No automated changelog generation
- ❌ **Distribution Package**: No .zip creation for users

---

## GitHub Releases - Worth It?

### **YES - Highly Recommended**

**Benefits:**
1. **Version History**: Clear timeline of all releases with changelogs
2. **Artifact Distribution**: Downloadable .zip files for each version
3. **Professional Image**: Shows active maintenance and organization
4. **Release Triggers**: Can trigger Chrome Web Store auto-publishing
5. **Rollback Safety**: Easy access to previous versions
6. **Community Trust**: Contributors and users can track changes
7. **CI/CD Integration**: Natural fit with existing GitHub Actions setup

**Minimal Overhead:**
- Automated via GitHub Actions
- No manual work after initial setup
- Free for public repositories

---

## Chrome Web Store Deployment

### Current Process (Assumed Manual)
1. Build extension locally: `npm run build`
2. Zip the `dist/` folder manually
3. Log into Chrome Developer Dashboard
4. Upload .zip manually
5. Fill out update details
6. Submit for review

**Pain Points:**
- Time-consuming (15-20 minutes per release)
- Error-prone (forgetting files, wrong version)
- Not reproducible
- No audit trail

### Recommended Automated Process

**Option A: Semi-Automated (Recommended for Start)**
- GitHub Actions creates release + .zip on tag push
- Manual upload to Chrome Web Store (with prepared .zip)
- ~5 minutes per release

**Option B: Fully Automated (Best Long-term)**
- GitHub Actions publishes directly to Chrome Web Store
- Zero manual steps after creating a release
- Requires Chrome Web Store API credentials setup

---

## Recommended Implementation Plan

### Phase 1: GitHub Releases Automation (Week 1)
**Goal**: Automate release creation and asset packaging

**Tasks:**
1. Create `.github/workflows/release.yml`
   - Trigger: Git tags (`v*.*.*`)
   - Build extension
   - Create .zip package (`squarewatch-v{version}.zip`)
   - Generate changelog from commits
   - Create GitHub release with .zip attachment

2. Add version management script
   - `npm version patch|minor|major` updates both:
     - `package.json` version
     - `manifest.json` version
   - Auto-creates git tag

3. Document release process in README

**Time Estimate**: 2-3 hours

**Success Criteria:**
- `git tag v2.0.1 && git push --tags` creates GitHub release
- Release includes downloadable .zip
- Changelog auto-generated

---

### Phase 2: Chrome Web Store Setup (Week 2)
**Goal**: Prepare for automated publishing

**Tasks:**
1. Set up Chrome Web Store API access
   - Create Google Cloud project
   - Enable Chrome Web Store API
   - Create OAuth credentials
   - Store credentials as GitHub Secrets

2. Create Chrome Web Store publishing workflow
   - Use `chrome-webstore-upload-cli` or similar
   - Triggered after successful release creation
   - Upload .zip programmatically
   - Submit for review automatically

3. Add rollback documentation

**Time Estimate**: 3-4 hours (mostly setup)

**Success Criteria:**
- GitHub release triggers Chrome Web Store upload
- Extension submitted for review automatically
- Secrets securely stored in GitHub

---

### Phase 3: Version Management Enhancement (Week 3)
**Goal**: Streamline version bumping and changelog

**Tasks:**
1. Add `standard-version` or `semantic-release`
   - Auto-generates changelog from conventional commits
   - Bumps version in all files
   - Creates git tag

2. Enforce conventional commits
   - Add commitlint
   - Update contributing guidelines

3. Add release checklist template

**Time Estimate**: 2-3 hours

---

## Proposed Workflows

### Release Workflow (`.github/workflows/release.yml`)
```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run tests (ensure passing)
      - Build extension
      - Create .zip package
      - Generate changelog
      - Create GitHub Release
      - Upload .zip as release asset
      - (Optional) Publish to Chrome Web Store
```

### Version Bump Script (`scripts/version-bump.js`)
```javascript
// Updates both package.json and manifest.json
// Creates git commit and tag
// Usage: npm run version:patch
```

---

## Release Process (Post-Implementation)

### For Maintainers
1. **Make changes** and commit using conventional commits:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   ```

2. **Bump version** and create release:
   ```bash
   npm run version:patch  # or :minor, :major
   git push --follow-tags
   ```

3. **Automated**:
   - GitHub Actions builds and tests
   - Creates GitHub release with .zip
   - (Optional) Publishes to Chrome Web Store

4. **Manual step** (if not fully automated):
   - Go to Chrome Web Store Developer Dashboard
   - Upload the .zip from GitHub release
   - Submit for review

**Total Time**: ~2 minutes (vs 15-20 minutes manual)

---

## Cost Analysis

### Time Investment
- **Initial Setup**: 7-10 hours (one-time)
- **Per Release After**: 2-5 minutes (vs 15-20 minutes)
- **ROI**: Break-even after ~10 releases

### Infrastructure Costs
- GitHub Actions: Free for public repos
- Chrome Web Store: $5 one-time developer fee (already paid if listed)
- Google Cloud API: Free tier sufficient

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Chrome Web Store API changes | High | Pin API versions, monitor deprecations |
| Failed automated publish | Medium | Fallback to manual upload with .zip from GitHub |
| Version mismatch | Medium | Script validates package.json = manifest.json |
| Broken build on release | High | Release workflow runs full test suite first |
| Secrets compromise | High | Use GitHub Secrets, rotate credentials quarterly |

---

## Next Steps (Priority Order)

1. **Immediate** (This Week):
   - ✅ Review this deployment plan
   - ⬜ Create `.github/workflows/release.yml`
   - ⬜ Add version sync script (`scripts/version-bump.js`)
   - ⬜ Test release workflow with `v2.0.1-beta.1` tag

2. **Short-term** (Next 2 Weeks):
   - ⬜ Set up Chrome Web Store API credentials
   - ⬜ Add Chrome Web Store publishing to workflow
   - ⬜ Test end-to-end automated publish

3. **Medium-term** (Next Month):
   - ⬜ Add `standard-version` for changelog automation
   - ⬜ Set up commitlint for conventional commits
   - ⬜ Create release checklist template

4. **Long-term** (Ongoing):
   - ⬜ Monitor Chrome Web Store reviews/feedback
   - ⬜ Set up automated version notifications
   - ⬜ Add release notes to extension update popup

---

## Success Metrics

**After 3 Months:**
- ✅ 100% of releases via automated workflow
- ✅ <5 minutes average release time
- ✅ Zero manual .zip creation errors
- ✅ Complete version history on GitHub
- ✅ Automated changelog for all releases

---

## Resources

### Tools
- **chrome-webstore-upload-cli**: CLI for Chrome Web Store publishing
- **standard-version**: Automated changelog and version management
- **semantic-release**: Full automated semantic versioning

### Documentation
- [Chrome Web Store API](https://developer.chrome.com/docs/webstore/using_webstore_api/)
- [GitHub Actions: Creating Releases](https://docs.github.com/en/actions/creating-actions/about-actions)
- [Chrome Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)

### GitHub Actions
- `actions/create-release` - Create GitHub releases
- `softprops/action-gh-release` - Alternative release action
- `mnao305/chrome-extension-upload` - Chrome Web Store upload action

---

## Conclusion

**Recommendation**: Implement **Phase 1 immediately** (GitHub Releases), then **Phase 2 within 2 weeks** (Chrome Web Store automation).

**Why GitHub Releases**: Essential for professional project management, minimal effort, high ROI.

**Why Automate Chrome Web Store**: Saves 15+ minutes per release, eliminates errors, enables frequent updates.

**Expected Timeline**: Fully automated deployment pipeline operational in 2-3 weeks.
