import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../lib/cinematic-motion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { scenePhase, selectedStage, stageWeight } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('every scroll position has bounded, conserved scene weights', () => {
  for (let step = -10; step <= 1010; step++) {
    const weights = Array.from({ length: 5 }, (_, i) => stageWeight(step / 1000, i));
    assert.ok(weights.every(w => w >= 0 && w <= 1));
    assert.ok(Math.abs(weights.reduce((a, b) => a + b, 0) - 1) < 1e-10);
    assert.ok(weights.filter(w => w > 0).length <= 2);
  }
});
test('five chapter stops resolve precisely in either direction', () => {
  for (const stage of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    assert.equal(selectedStage(stage / 4), stage);
    assert.equal(stageWeight(stage / 4, stage), 1);
  }
});
test('transitions are continuous at chapter boundaries and clamp overscroll', () => {
  assert.equal(scenePhase(-1).from, 0);
  assert.equal(scenePhase(2).from, 4);
  for (let stage = 1; stage < 4; stage++) {
    assert.ok(Math.abs(stageWeight(stage / 4 - 1e-7, stage) - stageWeight(stage / 4 + 1e-7, stage)) < 1e-5);
  }
});
