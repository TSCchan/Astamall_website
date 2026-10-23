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

