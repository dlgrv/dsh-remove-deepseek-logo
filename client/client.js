window.__ModuleLoader__.load({ id: "remove-deepseek-logo", factory: (require) => {
  var module = { exports: {} }; var exports = module.exports;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

  var inject = ["slots"];

  function Ghost() { return null; }

  function apply(ctx) {
    ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.inject("sidebar.brand.name", function* () {
      yield ctx.slots.register({ name: "sidebar.brand.mark", id: "remove-deepseek-logo-mark", order: 9999 }, Ghost);
      yield ctx.slots.register({ name: "sidebar.brand.name", id: "remove-deepseek-logo-name", order: 9999 }, Ghost);
    }));

    ctx.slots.inject("conversation.hero.brand.mark", () =>
      ctx.slots.register({ name: "conversation.hero.brand.mark", id: "remove-deepseek-logo-hero", order: 9999 }, Ghost));

    var style = document.createElement("style");
    style.setAttribute("data-remove-deepseek-logo", "");
    style.textContent = [
      '[class*="localBuildBrand"], [class*="localBuildTitle"], [class*="copyVersion"],',
      '[class*="buildVersion"], [class*="fallbackBrandName"] { display: none !important; }',
      '[class$="_fish"], [class$="fishHitbox"] { display: none !important; }',
      '[class*="logoRow"] { height: 0 !important; min-height: 0 !important; max-height: 0 !important;',
      '  padding: 0 !important; margin: 0 !important; overflow: hidden !important; border: 0 !important; }',
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  exports.apply = apply;
  exports.inject = inject;
  exports.name = "remove-deepseek-logo";
  return module.exports;
} });
