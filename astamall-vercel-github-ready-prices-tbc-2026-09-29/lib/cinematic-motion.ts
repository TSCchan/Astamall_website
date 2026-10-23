/** One reversible scroll value drives both the scene and its accessible DOM copy. */
export function scenePhase(progress: number) {
  const phase = Math.max(0, Math.min(1, progress)) * 4;
  const from = Math.min(4, Math.floor(phase));
  const x = Math.max(0, Math.min(1, (phase - from - 0.2) / 0.6));
  return { from, to: Math.min(4, from + 1), blend: x * x * (3 - 2 * x) };
}

export function stageWeight(progress: number, stage: number) {
  const { from, to, blend } = scenePhase(progress);
  return from === to ? Number(stage === from) : stage === from ? 1 - blend : stage === to ? blend : 0;
}

export function selectedStage(progress: number) {
  const { from, to, blend } = scenePhase(progress);
  return blend < 0.5 ? from : to;
}

const ease = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Spiral journey: stop 0 is the introduction, stops 1..count are products, the last stop is the collection close. */
export function spiralState(progress: number, count: number) {
  const s = clamp01(progress) * (count + 1);
  return {
    stop: s,
    intro: ease(clamp01(s)),
    focus: Math.max(0, Math.min(count - 1, s - 1)),
    outro: ease(clamp01(s - count)),
    selected: Math.round(s),
  };
}

/** Copy panel weight: fully visible at its own stop, gone halfway to the neighbours. */
export function spiralPanelWeight(progress: number, count: number, stop: number) {
  const s = clamp01(progress) * (count + 1);
  return ease(clamp01(1 - Math.abs(s - stop) * 2));
}
