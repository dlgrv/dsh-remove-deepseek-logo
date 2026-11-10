import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "client/client.js"), "utf8");

function loadClient() {
  const injected = [];
  const registered = [];
  const styles = [];
  const document = {
    createElement(tag) { return { tag, textContent: "", setAttribute() {} }; },
    head: { appendChild(el) { styles.push(el); } },
    documentElement: { appendChild(el) { styles.push(el); } },
  };
  const slots = {
    inject(name, fn) {
      injected.push(name);
      const result = fn();
      if (result && typeof result[Symbol.iterator] === "function") { for (const _ of result) {} }
      return result;
    },
    register(meta, component) { registered.push({ meta, component }); return () => {}; },
  };
  let factoryResult;
  const loader = { load(entry) { loader.id = entry.id; factoryResult = entry.factory(() => ({})); } };
  const window = { __ModuleLoader__: loader };
  new Function("window", "document", source)(window, document);
  return { id: loader.id, plugin: factoryResult, injected, registered, styles, slots };
}

test("bundle registers under the package name", () => {
  const c = loadClient();
  assert.equal(c.id, "remove-deepseek-logo");
  assert.equal(c.plugin.name, "remove-deepseek-logo");
  assert.equal(typeof c.plugin.apply, "function");
  assert.deepEqual(c.plugin.inject, ["slots"]);
});

test("apply registers a ghost into all three brand slots", () => {
  const c = loadClient();
  c.plugin.apply({ slots: c.slots });
  for (const slot of ["sidebar.brand.mark", "sidebar.brand.name", "conversation.hero.brand.mark"]) {
    assert.ok(c.injected.includes(slot), slot + " not injected");
  }
  assert.equal(c.registered.length, 3);
  for (const { meta, component } of c.registered) {
    assert.ok(meta.order > 0, "registration must carry an order to compete with the official brand");
    assert.equal(component(), null, "occupant component must render nothing");
  }
});

test("apply injects the safety-net stylesheet", () => {
  const c = loadClient();
  c.plugin.apply({ slots: c.slots });
  assert.ok(c.styles.length >= 1, "style element appended");
  const css = c.styles.map((s) => s.textContent).join("\n");
  for (const needle of ["localBuildBrand", "copyVersion", "fallbackBrandName", 'class$="_fish"', "fishHitbox", "logoRow"]) {
    assert.ok(css.includes(needle), "css must hide " + needle);
  }
  assert.ok(/height:\s*0/.test(css), "logoRow must collapse to zero height");
});
