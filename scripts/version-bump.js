#!/usr/bin/env node

/**
 * Version Bump Script
 *
 * Synchronizes version numbers across package.json and manifest.json,
 * then creates a git commit and tag.
 *
 * Usage:
 *   node scripts/version-bump.js patch   # 1.0.0 -> 1.0.1
 *   node scripts/version-bump.js minor   # 1.0.0 -> 1.1.0
 *   node scripts/version-bump.js major   # 1.0.0 -> 2.0.0
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const PACKAGE_JSON = join(rootDir, 'package.json');
const MANIFEST_JSON = join(rootDir, 'manifest.json');

/**
 * Parse semantic version string
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
}

/**
 * Bump version based on type
 */
function bumpVersion(version, type) {
  const v = parseVersion(version);

  switch (type) {
    case 'major':
      return `${v.major + 1}.0.0`;
    case 'minor':
      return `${v.major}.${v.minor + 1}.0`;
    case 'patch':
      return `${v.major}.${v.minor}.${v.patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${type}. Must be major, minor, or patch.`);
  }
}

/**
 * Update JSON file with new version
 */
function updateJsonFile(filePath, newVersion) {
  const content = readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  json.version = newVersion;
  writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
}

/**
 * Execute git command
 */
function gitExec(command) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      cwd: rootDir,
      stdio: 'pipe'
    }).trim();
  } catch (error) {
    console.error(`Git command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Check if git working directory is clean
 */
function checkGitStatus() {
  const status = gitExec('git status --porcelain');
  if (status) {
    console.error('Error: Git working directory is not clean. Commit or stash changes first.');
    console.error('\nUncommitted changes:');
    console.error(status);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  const bumpType = process.argv[2];

  if (!bumpType || !['major', 'minor', 'patch'].includes(bumpType)) {
    console.error('Usage: node scripts/version-bump.js <major|minor|patch>');
    console.error('\nExamples:');
    console.error('  node scripts/version-bump.js patch   # 1.0.0 -> 1.0.1');
    console.error('  node scripts/version-bump.js minor   # 1.0.0 -> 1.1.0');
    console.error('  node scripts/version-bump.js major   # 1.0.0 -> 2.0.0');
    process.exit(1);
  }

  console.log('🔍 Checking git status...');
  checkGitStatus();

  // Read current version from package.json
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON, 'utf-8'));
  const currentVersion = packageJson.version;

  console.log(`📦 Current version: ${currentVersion}`);

  // Calculate new version
  const newVersion = bumpVersion(currentVersion, bumpType);
  console.log(`🚀 New version: ${newVersion}`);

  // Update files
  console.log('\n📝 Updating files...');
  updateJsonFile(PACKAGE_JSON, newVersion);
  console.log(`  ✓ Updated package.json`);

  updateJsonFile(MANIFEST_JSON, newVersion);
  console.log(`  ✓ Updated manifest.json`);

  // Git operations
  console.log('\n📌 Creating git commit and tag...');
  gitExec('git add package.json manifest.json');
  gitExec(`git commit -m "chore: bump version to ${newVersion}"`);
  console.log(`  ✓ Committed version bump`);

  gitExec(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`  ✓ Created tag v${newVersion}`);

  console.log('\n✅ Version bump complete!');
  console.log('\nNext steps:');
  console.log(`  1. Review changes: git show v${newVersion}`);
  console.log('  2. Push to remote: git push && git push --tags');
  console.log('  3. GitHub Actions will automatically create a release');
}

// Run script
main();
