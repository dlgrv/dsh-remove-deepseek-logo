window.__ModuleLoader__.load({ id: 'dsh-remove-deepseek-logo', factory: (require) => {
  var module = { exports: {} }
  var exports = module.exports
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

  var inject = ['slots']
  var MARKER = 'data-dsh-remove-deepseek-logo'
  var DIAGNOSTIC_DELAY_MS = 3000

  function apply(ctx) {
    if (document.querySelector('style[' + MARKER + ']')) return
    var style = document.createElement('style')
    style.setAttribute(MARKER, '')
    style.textContent = [
      '[class*="localBuildBrand"], [class*="localBuildTitle"], [class*="copyVersion"],',
      '[class*="buildVersion"], [class*="fallbackBrandName"] { display: none !important; }',
      '[class$="_fish"], [class$="fishHitbox"] { display: none !important; }',
      '[class$="_headline"], [class$="_previewBadge"] { display: none !important; }',
      '[class*="logoRow"] { height: 0 !important; min-height: 0 !important; max-height: 0 !important;',
      '  padding: 0 !important; margin: 0 !important; overflow: hidden !important; border: 0 !important; }',
    ].join('\n')
    ;(document.head || document.documentElement).appendChild(style)
    window.setTimeout(function () {
      if (document.querySelector('[class*="logoRow"], [class*="localBuildBrand"], [class$="_fish"]')) return
      console.warn('[dsh-remove-deepseek-logo] no branding elements found, the DSH UI may have changed')
    }, DIAGNOSTIC_DELAY_MS)
  }

  exports.apply = apply
  exports.inject = inject
  exports.name = 'dsh-remove-deepseek-logo'
  return module.exports
} })
