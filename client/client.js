window.__ModuleLoader__.load({ id: 'dsh-remove-deepseek-logo', factory: (require) => {
  var module = { exports: {} }
  var exports = module.exports
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

  var inject = ['slots']

  function apply(ctx) {
    var style = document.createElement('style')
    style.setAttribute('data-dsh-remove-deepseek-logo', '')
    style.textContent = [
      '[class*="localBuildBrand"], [class*="localBuildTitle"], [class*="copyVersion"],',
      '[class*="buildVersion"], [class*="fallbackBrandName"] { display: none !important; }',
      '[class$="_fish"], [class$="fishHitbox"] { display: none !important; }',
      '[class$="_headline"], [class$="_previewBadge"] { display: none !important; }',
      '[class*="logoRow"] { height: 0 !important; min-height: 0 !important; max-height: 0 !important;',
      '  padding: 0 !important; margin: 0 !important; overflow: hidden !important; border: 0 !important; }',
    ].join('\n')
    ;(document.head || document.documentElement).appendChild(style)
  }

  exports.apply = apply
  exports.inject = inject
  exports.name = 'dsh-remove-deepseek-logo'
  return module.exports
} })
