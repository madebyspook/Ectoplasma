import { mkdirSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'src');
const watching = process.argv.includes('--watch');

// Publish the compiled stylesheet atomically.
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

  mkdirSync(join(root, 'dist'), { recursive: true });
  writeAtomic(join(root, 'dist/Ectoplasma.css'), css);
  console.log('Built dist/Ectoplasma.css.');
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