import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import * as sass from 'sass';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'src');
const loaderPath = join(root, 'Ectoplasma.theme.css');
const cssPath = join(root, 'dist/Ectoplasma.css');

function readMetadata() {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(pkg.version)) {
    throw new Error('Use a stable MAJOR.MINOR.PATCH version in package.json.');
  }
  if (lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version) {
    throw new Error('Package and lockfile versions differ. Update them together with npm version <version> --no-git-tag-version.');
  }

  const metadata = {
    name: 'Ectoplasma',
    author: pkg.author,
    version: pkg.version,
    description: pkg.description,
    source: pkg.repository?.url?.replace(/\.git$/, ''),
    updateUrl: new URL('Ectoplasma.theme.css', pkg.homepage).href,
  };
  for (const [field, value] of Object.entries(metadata)) {
    if (typeof value !== 'string' || !value.trim() || /[\r\n]|\*\//.test(value)) {
      throw new Error(`Theme metadata ${field} must be a non-empty single-line string.`);
    }
  }
  return { metadata, stylesheetUrl: new URL('dist/Ectoplasma.css', pkg.homepage).href };
}

function header(metadata) {
  return ['/**', ...Object.entries(metadata).map(([key, value]) => ` * @${key} ${value}`), ' */', ''].join('\n');
}

// Repository outputs use atomic replacement. The installed development theme must not.
function writeAtomic(path, contents) {
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, contents);
    renameSync(temporary, path);
  } finally {
    rmSync(temporary, { force: true });
  }
}

function build({ check, dev, themesDir }) {
  const { metadata, stylesheetUrl } = readMetadata();
  const { css } = sass.compile(join(source, 'main.scss'), {
    style: 'expanded',
    sourceMap: false,
  });
  const productionHeader = header(metadata);
  const outputs = [
    [loaderPath, `${productionHeader}\n@import url("${stylesheetUrl}");\n`],
    [cssPath, `${productionHeader}${css}`],
  ];

  if (check) {
    const stale = outputs.filter(([path, contents]) => !existsSync(path) || readFileSync(path, 'utf8') !== contents);
    if (stale.length) {
      throw new Error(`Generated files are missing or stale: ${stale.map(([path]) => path.slice(root.length)).join(', ')}. Run npm run build.`);
    }
    console.log('Generated CSS, loader, and metadata are consistent.');
    return;
  }

  mkdirSync(join(root, 'dist'), { recursive: true });
  for (const [path, contents] of outputs) writeAtomic(path, contents);
  console.log(`Built Ectoplasma.theme.css and dist/Ectoplasma.css (${metadata.version}).`);

  if (dev) {
    const developmentHeader = header({
      name: 'EctoplasmaDev',
      author: metadata.author,
      version: metadata.version,
      description: 'Local development build of Ectoplasma. Do not enable alongside Ectoplasma.',
      source: metadata.source,
    });
    // Preserve the file in place: atomic replacement can cause BetterDiscord to unload it.
    writeFileSync(join(themesDir, 'EctoplasmaDev.theme.css'), `${developmentHeader}${css}`);
    console.log(`Updated ${join(themesDir, 'EctoplasmaDev.theme.css')}.`);
  }
}

// Include metadata changes as well as new, changed, or deleted SCSS files.
function snapshot() {
  return [...readdirSync(source, { recursive: true })
    .filter(name => name.endsWith('.scss'))
    .map(name => join(source, name)), join(root, 'package.json'), join(root, 'package-lock.json')]
    .sort()
    .map(path => {
      const stat = statSync(path);
      return `${path}:${stat.mtimeMs}:${stat.ctimeMs}:${stat.size}`;
    })
    .join('\n');
}

function main() {
  const { values } = parseArgs({
    options: {
      watch: { type: 'boolean', default: false },
      dev: { type: 'boolean', default: false },
      check: { type: 'boolean', default: false },
      'themes-dir': { type: 'string' },
      help: { type: 'boolean', default: false },
    },
  });
  if (values.help) {
    console.log('Usage: node scripts/build.mjs [--watch [--dev [--themes-dir <directory>]] | --check]');
    return;
  }
  if (values.check && (values.watch || values.dev || values['themes-dir'])) {
    throw new Error('--check cannot be combined with watch or development installation.');
  }
  if (values.dev && !values.watch) throw new Error('--dev requires --watch.');
  if (values['themes-dir'] !== undefined && (!values.dev || !values['themes-dir'].trim())) {
    throw new Error('--themes-dir requires --dev and a non-empty directory path.');
  }
  if (values.dev && !values['themes-dir'] && process.platform !== 'darwin') {
    throw new Error('Outside macOS, provide your existing BetterDiscord theme folder with --themes-dir <directory>.');
  }
  const themesDir = values['themes-dir']
    ? resolve(values['themes-dir'])
    : join(homedir(), 'Library/Application Support/BetterDiscord/themes');
  if (values.dev && (!existsSync(themesDir) || !statSync(themesDir).isDirectory())) {
    throw new Error(`BetterDiscord themes directory not found: ${themesDir}. Open the theme folder in BetterDiscord and pass its path with --themes-dir if needed.`);
  }
  const options = { check: values.check, dev: values.dev, themesDir };
  if (!values.watch) {
    build(options);
    return;
  }

  let previous;
  let lastError;
  function rebuildIfChanged() {
    try {
      const current = snapshot();
      if (current === previous) return;
      previous = current;
      build(options);
      lastError = undefined;
    } catch (error) {
      if (error.message !== lastError) console.error(`Build failed: ${error.message}`);
      lastError = error.message;
    }
  }
  rebuildIfChanged();
  setInterval(rebuildIfChanged, 500);
  console.log(`Watching src/ and package metadata${values.dev ? ' (BetterDiscord dev theme)' : ''} (polling).`);
}

try {
  main();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
