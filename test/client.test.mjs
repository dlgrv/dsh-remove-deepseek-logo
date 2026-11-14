import test, { mock } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'client/client.js'), 'utf8')

function loadClient(opts = {}) {
  const styles = []
  const timers = []
  const document = {
    createElement(tag) {
      return { tag, textContent: '', setAttribute() {} }
    },
    head: { appendChild(el) { styles.push(el) } },
    documentElement: { appendChild(el) { styles.push(el) } },
    querySelector(sel) {
      if (sel.startsWith('style[')) return styles.length > 0 ? styles[0] : null
      return opts.brandQuery ? opts.brandQuery(sel) : null
    },
  }
  const module = { exports: {} }
  let factoryResult = null
  const window = {
    __ModuleLoader__: {
      load(entry) {
        window.__ModuleLoader__.id = entry.id
        factoryResult = entry.factory(() => ({}))
      },
    },
    setTimeout(fn, ms) {
      timers.push({ fn, ms })
      return timers.length
    },
  }
  new Function('window', 'document', 'module', 'exports', source)(
    window, document, module, module.exports,
  )
  return { id: window.__ModuleLoader__.id, plugin: factoryResult, styles, timers }
}

test('bundle registers under the package name', () => {
  const c = loadClient()
  assert.equal(c.id, 'dsh-remove-deepseek-logo')
  assert.equal(c.plugin.name, 'dsh-remove-deepseek-logo')
  assert.equal(typeof c.plugin.apply, 'function')
  assert.deepEqual(c.plugin.inject, ['slots'])
})

test('apply injects stylesheet with all hiding rules', () => {
  const c = loadClient()
  c.plugin.apply({})
  assert.ok(c.styles.length >= 1, 'style element appended')
  const css = c.styles.map((s) => s.textContent).join('\n')
  for (const needle of [
    'localBuildBrand', 'localBuildTitle', 'copyVersion', 'buildVersion',
    'fallbackBrandName', '_fish', 'fishHitbox', 'logoRow', '_headline', '_previewBadge',
  ]) {
    assert.ok(css.includes(needle), 'css must hide ' + needle)
  }
  assert.ok(/height:\s*0/.test(css), 'logoRow must collapse to zero height')
})

test('apply does not register any slots', () => {
  const c = loadClient()
  const slots = {
    inject() { throw new Error('slot inject should not be called') },
    register() { throw new Error('slot register should not be called') },
  }
  c.plugin.apply({ slots })
})

test('apply is idempotent', () => {
  const c = loadClient()
  c.plugin.apply({})
  c.plugin.apply({})
  assert.equal(c.styles.length, 1)
})

test('diagnostics fires once and warns when no branding elements are found', () => {
  const warn = mock.method(console, 'warn', () => {})
  try {
    const c = loadClient()
    c.plugin.apply({})
    assert.equal(c.timers.length, 1)
    assert.equal(c.timers[0].ms, 3000)
    c.timers[0].fn()
    assert.equal(warn.mock.callCount(), 1)
    assert.match(String(warn.mock.calls[0].arguments[0]), /dsh-remove-deepseek-logo/)
  } finally {
    warn.mock.restore()
  }
})

test('diagnostics stays silent when branding elements are present', () => {
  const warn = mock.method(console, 'warn', () => {})
  try {
    const c = loadClient({ brandQuery: () => ({ tag: 'div' }) })
    c.plugin.apply({})
    c.timers[0].fn()
    assert.equal(warn.mock.callCount(), 0)
  } finally {
    warn.mock.restore()
  }
})
