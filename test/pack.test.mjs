import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

test('npm pack archive contains every shipped file', () => {
  const cache = mkdtempSync(join(tmpdir(), 'dsh-rdl-pack-'))
  const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--cache', cache], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const [entry] = JSON.parse(out.slice(out.indexOf('[')))
  const packed = entry.files.map((f) => f.path)
  const expected = [...pkg.files, 'package.json']
  for (const f of expected) {
    const present = packed.includes(f) || packed.some((p) => p.startsWith(f + '/'))
    assert.ok(present, f + ' missing from the tarball')
  }
})
