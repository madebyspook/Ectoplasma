import { existsSync, mkdirSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'src');
const watching = process.argv.includes('--watch');
const development = process.argv.includes('--dev');

const themes = join(homedir(), 'Library/Application Support/BetterDiscord/themes');
const devTheme = join(themes, 'EctoplasmaDev.theme.css');

// Write files atomically to avoid partial updates.
function writeAtomic(path, css) {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, css);
  renameSync(temporary, path);
}

function build() {
  const { css } = sass.compile(join(source, 'main.scss'), {
    style: 'expanded',
    sourceMap: false,
  });
  const { css: loader } = sass.compile(join(source, 'loader.scss'), {
    style: 'expanded',
    sourceMap: false,
  });

  mkdirSync(join(root, 'dist'), { recursive: true });
  writeAtomic(join(root, 'dist/Ectoplasma.css'), css);
  writeAtomic(join(root, 'Ectoplasma.theme.css'), loader);
  console.log('Built Ectoplasma.theme.css and dist/Ectoplasma.css.');

  if (development) {
    if (!existsSync(themes)) {
      throw new Error(`BetterDiscord themes directory not found: ${themes}`);
    }

    const metadata = [
      '/**',
      ' * @name EctoplasmaDev',
      ' * @author Made By Spook',
      ' * @version 0.0.0',
      ' * @description Local development build of Ectoplasma. Do not enable alongside Ectoplasma.',
      ' */',
      '',
    ].join('\n');

    writeFileSync(devTheme, `${metadata}${css}`);
    console.log(`Updated ${devTheme}.`);
  }
}

// Detect changes to SCSS files.
function snapshot() {
  return readdirSync(source, { recursive: true })
    .filter(name => name.endsWith('.scss'))
    .sort()
    .map(name => {
      const stat = statSync(join(source, name));
      return `${name}:${stat.mtimeMs}:${stat.ctimeMs}:${stat.size}`;
    })
    .join('\n');
}

if (watching) {
  let previous;

  function rebuildIfChanged() {
    try {
      const current = snapshot();
      if (current === previous) return;
      previous = current;
      build();
    } catch (error) {
      console.error(error.message);
    }
  }

  rebuildIfChanged();
  setInterval(rebuildIfChanged, 500);

  console.log(
    `Watching src/ for SCSS changes${development ? ' (BetterDiscord dev theme)' : ''} (polling).`
  );
} else {
  build();
}
