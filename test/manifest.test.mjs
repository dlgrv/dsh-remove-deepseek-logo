import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

test('package exposes the client bundle and the bundle patch', () => {
  assert.equal(pkg.exports['.'], './lib/index.js')
  assert.equal(pkg.exports['./client'], './client/client.js')
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(pkg.dsh.client.platform, 'web')
})

test('every shipped file exists', () => {
  for (const f of ['lib/index.js', 'client/client.js', 'cordis.patch.yml', 'README.md', 'LICENSE']) {
    assert.ok(existsSync(join(root, f)), f + ' missing')
  }
})

test('the bundle patch inserts exactly this package', () => {
  const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /id:\s*dsh-remove-deepseek-logo/)
  assert.match(patch, /name:\s*'?dsh-remove-deepseek-logo'?/)
})

test('client bundle carries the loader signature and package name', () => {
  const client = readFileSync(join(root, 'client/client.js'), 'utf8')
  assert.ok(client.includes('__ModuleLoader__'), 'must register via __ModuleLoader__')
  assert.ok(client.includes("'dsh-remove-deepseek-logo'"), 'must use its own id')
})

test('client does not register brand slots', () => {
  const client = readFileSync(join(root, 'client/client.js'), 'utf8')
  assert.ok(!client.includes('sidebar.brand.mark'), 'must not register sidebar.brand.mark')
  assert.ok(!client.includes('sidebar.brand.name'), 'must not register sidebar.brand.name')
  assert.ok(!client.includes('conversation.hero.brand.mark'), 'must not register conversation.hero.brand.mark')
})
