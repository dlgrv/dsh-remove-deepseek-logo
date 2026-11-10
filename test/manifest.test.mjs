import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

test("package exposes the client bundle and the bundle patch", () => {
  assert.equal(pkg.exports["."], "./lib/index.js");
  assert.equal(pkg.exports["./client"], "./client/client.js");
  assert.equal(pkg.dsh.bundle.patch, "./cordis.patch.yml");
  assert.equal(pkg.dsh.client.platform, "web");
});

test("client inject targets exist and are spelled exactly", () => {
  assert.deepEqual(pkg.dsh.client.inject, [
    "@deepseek-ai/dsh-client-ui-sidebar",
    "@deepseek-ai/dsh-client-ui-conversation",
  ]);
});

test("every shipped file exists", () => {
  for (const f of ["lib/index.js", "client/client.js", "cordis.patch.yml", "README.md", "LICENSE"]) {
    assert.ok(existsSync(join(root, f)), f + " missing");
  }
});

test("the bundle patch inserts exactly this package", () => {
  const patch = readFileSync(join(root, "cordis.patch.yml"), "utf8");
  assert.match(patch, /id:\s*remove-deepseek-logo/);
  assert.match(patch, /name:\s*'?remove-deepseek-logo'?/);
});

test("the client bundle carries the loader signature", () => {
  const client = readFileSync(join(root, "client/client.js"), "utf8");
  assert.ok(client.includes("window.__ModuleLoader__.load"), "must register via __ModuleLoader__");
  assert.ok(client.includes('"remove-deepseek-logo"'), "must use its own id");
});
