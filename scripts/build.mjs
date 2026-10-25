import { mkdirSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'src');
const watching = process.argv.includes('--watch');
const betterDiscord = process.argv.includes('--betterdiscord');
if (betterDiscord && (!watching || process.platform !== 'darwin')) {
  throw new Error('--betterdiscord requires watch mode on macOS.');
}

// Publish complete files with a rename, including the installed theme.
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
  writeAtomic(join(root, 'Ectoplasma.theme.css'), css);
  writeAtomic(join(root, 'dist/Ectoplasma.css'), css);
  console.log('Built Ectoplasma.theme.css and dist/Ectoplasma.css.');
  if (betterDiscord) {
    const themes = join(homedir(), 'Library/Application Support/BetterDiscord/themes');
    mkdirSync(themes, { recursive: true });
    writeAtomic(join(themes, 'Ectoplasma.theme.css'), css);
    console.log('Copied theme to BetterDiscord.');
  }
}

// Rescan the directory tree so new files are detected, even after a failed build.
// Polling avoids native file-watcher limits and needs no extra dependency.
function snapshot() {
  return readdirSync(source, { recursive: true }).filter(name => name.endsWith('.scss'))
    .sort().map(name => {
      const stat = statSync(join(source, name));
      return `${name}:${stat.mtimeMs}:${stat.ctimeMs}:${stat.size}`;
    }).join('\n');
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
  console.log('Watching src/ for SCSS changes (polling).');
} else {
  build();
}
