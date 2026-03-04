'use strict';

/**
 * Postinstall fallback: if the optional platform-specific package was not
 * installed (e.g. restricted npm config), download the tarball from the
 * npm registry and extract the binary manually.
 */

const path = require('path');
const os = require('os');
const fs = require('fs');
const { execFileSync } = require('child_process');

const PLATFORMS = {
  'darwin-arm64': '@doctrack/darwin-arm64',
  'darwin-x64':   '@doctrack/darwin-x64',
  'linux-x64':    '@doctrack/linux-x64',
  'win32-x64':    '@doctrack/win32-x64',
};

const key = `${process.platform}-${process.arch}`;
const pkg = PLATFORMS[key];
if (!pkg) {
  console.log(`[doctrack] Unsupported platform: ${key} — skipping binary download.`);
  process.exit(0);
}

const ext = process.platform === 'win32' ? '.exe' : '';
const binName = `doctrack${ext}`;

// Check if optional package already installed (happy path)
try {
  require.resolve(`${pkg}/bin/${binName}`);
  console.log(`[doctrack] Binary found via optional dependency — all good!`);
  process.exit(0);
} catch (_) {}

// Fallback: download from npm registry
console.log(`[doctrack] Optional package ${pkg} not found, attempting download...`);

// Use a process-unique temp directory to avoid collisions and path traversal.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctrack-install-'));
const tarball = path.join(tmpDir, 'pkg.tgz');

try {
  const pkgJson = require('../package.json');
  const version = pkgJson.version;

  // On Windows npm is a cmd script, not a standalone executable.
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execFileSync(npmCmd, ['pack', `${pkg}@${version}`, '--pack-destination', tmpDir], { stdio: 'pipe' });

  // Rename whatever npm packed to a known path.
  const packed = fs.readdirSync(tmpDir).find((f) => f.endsWith('.tgz'));
  if (!packed) throw new Error('npm pack produced no .tgz file');
  fs.renameSync(path.join(tmpDir, packed), tarball);

  // Extract only the bin directory from the tarball. --strip-components=1
  // removes the npm-standard "package/" prefix so files land at pkgDir/bin/.
  const pkgDir = path.join(__dirname, '..', 'node_modules', pkg.replace('/', path.sep));
  fs.mkdirSync(path.join(pkgDir, 'bin'), { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', pkgDir, '--strip-components=1', 'package/bin'], { stdio: 'pipe' });

  console.log(`[doctrack] Successfully installed binary for ${key}`);
} catch (err) {
  console.warn(`[doctrack] Could not download binary: ${err.message}`);
  console.warn('[doctrack] Run: npm install -g doctrack to retry');
} finally {
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
}
