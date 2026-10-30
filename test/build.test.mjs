import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

async function withFixture(callback) {
  const directory = mkdtempSync(join(tmpdir(), 'ectoplasma-build-test-'));
  try {
    for (const path of ['src', 'scripts', 'package.json', 'package-lock.json']) {
      cpSync(join(root, path), join(directory, path), { recursive: true });
    }
    // Reuse installed dependencies without installing or changing the real project.
    symlinkSync(join(root, 'node_modules'), join(directory, 'node_modules'), 'junction');
    await callback(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function run(directory, ...args) {
  const result = spawnSync(process.execPath, [join(directory, 'scripts/build.mjs'), ...args], {
    cwd: directory,
    encoding: 'utf8',
    timeout: 15000,
  });
  assert.ifError(result.error);
  return result;
}

function contents(directory, path) {
  return readFileSync(join(directory, path), 'utf8');
}

function outputs(directory) {
  return ['Ectoplasma.theme.css', 'dist/Ectoplasma.css'].map(path => ({
    path,
    contents: contents(directory, path),
    modified: statSync(join(directory, path)).mtimeMs,
  }));
}

async function waitFor(predicate, child, output) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (predicate()) return;
    assert.equal(child.exitCode, null, `Watcher exited early: ${output()}`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.fail(`Timed out waiting for watcher: ${output()}`);
}

async function stop(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise(resolve => child.once('close', resolve));
  child.kill();
  await closed;
}

test('build emits matching metadata, preserves public URLs, and check never rewrites files', async () => {
  await withFixture(directory => {
    assert.equal(run(directory).status, 0);
    const { version } = JSON.parse(contents(directory, 'package.json'));
    const loader = contents(directory, 'Ectoplasma.theme.css');
    const css = contents(directory, 'dist/Ectoplasma.css');
    for (const file of [loader, css]) {
      assert.ok(file.startsWith('/**\n * @name Ectoplasma\n'));
      assert.equal((file.match(/@name /g) || []).length, 1);
      assert.ok(file.includes(` * @version ${version}\n`));
    }
    assert.match(loader, /@updateUrl https:\/\/madebyspook\.github\.io\/Ectoplasma\/Ectoplasma\.theme\.css/);
    assert.match(loader, /@import url\("https:\/\/madebyspook\.github\.io\/Ectoplasma\/dist\/Ectoplasma\.css"\);/);
    const before = outputs(directory);
    assert.equal(run(directory, '--check').status, 0);
    assert.deepEqual(outputs(directory), before);
    assert.equal(run(directory).status, 0);
    assert.deepEqual(outputs(directory).map(file => file.contents), before.map(file => file.contents));
  });
});

test('check detects either stale artifact and missing files without repairing them', async () => {
  await withFixture(directory => {
    assert.equal(run(directory, '--check').status, 1);
    assert.equal(existsSync(join(directory, 'dist')), false);
    assert.equal(existsSync(join(directory, 'Ectoplasma.theme.css')), false);
    assert.equal(run(directory).status, 0);
    for (const path of ['Ectoplasma.theme.css', 'dist/Ectoplasma.css']) {
      writeFileSync(join(directory, path), 'stale artifact');
      const result = run(directory, '--check');
      assert.equal(result.status, 1);
      assert.ok(result.stderr.includes(path));
      assert.equal(contents(directory, path), 'stale artifact');
      assert.equal(run(directory).status, 0);
    }
  });
});

test('invalid flags and installation destinations fail before producing files', async () => {
  await withFixture(directory => {
    const invalid = [
      ['--betterdiscord'],
      ['--check', '--watch'],
      ['--check', '--dev'],
      ['--dev'],
      ['--themes-dir', directory],
      ['--watch', '--dev', '--themes-dir', ''],
      ['--watch', '--dev', '--themes-dir', join(directory, 'missing')],
      ['--watch', '--dev', '--themes-dir', join(directory, 'package.json')],
      ['unexpected-argument'],
    ];
    for (const args of invalid) {
      const result = run(directory, ...args);
      assert.equal(result.status, 1, args.join(' '));
      assert.match(result.stderr, /Build failed:/);
      assert.equal(existsSync(join(directory, 'dist')), false);
    }
  });
});

test('version mismatch or invalid metadata leaves previous generated outputs intact', async () => {
  await withFixture(directory => {
    assert.equal(run(directory).status, 0);
    const before = outputs(directory);
    const pkg = JSON.parse(contents(directory, 'package.json'));
    for (const change of [{ version: '9.0.0' }, { version: '1.3' }, { description: 'invalid */ header' }]) {
      writeFileSync(join(directory, 'package.json'), JSON.stringify({ ...pkg, ...change }));
      const result = run(directory);
      assert.equal(result.status, 1);
      assert.deepEqual(outputs(directory), before);
    }
  });
});

test('a Sass error leaves previous outputs intact', async () => {
  await withFixture(directory => {
    assert.equal(run(directory).status, 0);
    const before = outputs(directory);
    writeFileSync(join(directory, 'src/sections/_global.scss'), 'invalid {');
    const result = run(directory);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Build failed:/);
    assert.deepEqual(outputs(directory), before);
  });
});

test('watch recovers from errors, detects metadata and file changes, and writes the dev file in place', async () => {
  await withFixture(async directory => {
    const themes = join(directory, 'theme folder');
    mkdirSync(themes);
    const installed = join(themes, 'EctoplasmaDev.theme.css');
    writeFileSync(installed, 'previous installed theme');
    const inode = statSync(installed).ino;
    const globalPath = join(directory, 'src/sections/_global.scss');
    const original = readFileSync(globalPath, 'utf8');
    writeFileSync(globalPath, 'invalid {');
    const child = spawn(process.execPath, [join(directory, 'scripts/build.mjs'), '--watch', '--dev', '--themes-dir', themes], {
      cwd: directory,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', data => { output += data; });
    child.stderr.on('data', data => { output += data; });
    try {
      await waitFor(() => output.includes('Build failed:'), child, () => output);
      assert.equal(readFileSync(installed, 'utf8'), 'previous installed theme');
      writeFileSync(globalPath, `${original}\n.tooling-probe { opacity: 0.314; }\n`);
      await waitFor(() => readFileSync(installed, 'utf8').includes('opacity: 0.314;'), child, () => output);
      assert.equal(statSync(installed).ino, inode, 'Development installation must retain its inode.');
      const dev = readFileSync(installed, 'utf8');
      assert.equal((dev.match(/@name /g) || []).length, 1);
      assert.match(dev, /^\/\*\*\n \* @name EctoplasmaDev\n/);
      assert.equal(dev.includes('@updateUrl'), false);
      assert.equal(dev.includes('@import'), false);

      const pkg = JSON.parse(contents(directory, 'package.json'));
      const lock = JSON.parse(contents(directory, 'package-lock.json'));
      pkg.version = lock.version = lock.packages[''].version = '1.4.4';
      writeFileSync(join(directory, 'package.json'), JSON.stringify(pkg));
      writeFileSync(join(directory, 'package-lock.json'), JSON.stringify(lock));
      await waitFor(() => readFileSync(installed, 'utf8').includes('@version 1.4.4'), child, () => output);
      assert.equal(statSync(installed).ino, inode);

      const mainPath = join(directory, 'src/main.scss');
      const main = readFileSync(mainPath, 'utf8');
      const extraPath = join(directory, 'src/sections/_tooling-probe.scss');
      writeFileSync(extraPath, '.new-file-probe { opacity: 0.271; }\n');
      writeFileSync(mainPath, `${main}\n@use "sections/tooling-probe";\n`);
      await waitFor(() => readFileSync(installed, 'utf8').includes('opacity: 0.271;'), child, () => output);
      rmSync(extraPath);
      writeFileSync(mainPath, main);
      await waitFor(() => !readFileSync(installed, 'utf8').includes('opacity: 0.271;'), child, () => output);

      rmSync(installed);
      mkdirSync(installed);
      output = '';
      writeFileSync(globalPath, `${original}\n.install-error-probe { opacity: 0.618; }\n`);
      await waitFor(() => output.includes('Build failed:'), child, () => output);
      assert.equal(child.exitCode, null);
      rmSync(installed, { recursive: true });
      writeFileSync(installed, 'restored installed theme');
      const restoredInode = statSync(installed).ino;
      writeFileSync(globalPath, `${original}\n.install-recovery-probe { opacity: 0.619; }\n`);
      await waitFor(() => readFileSync(installed, 'utf8').includes('opacity: 0.619;'), child, () => output);
      assert.equal(statSync(installed).ino, restoredInode);
    } finally {
      await stop(child);
    }
  });
});
