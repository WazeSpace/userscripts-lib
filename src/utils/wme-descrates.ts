import { getWazeWindow } from './window';

export type WazeDescartesEnvironment = 'il' | 'row' | 'na';

const WazeDescartesBasePaths: Record<WazeDescartesEnvironment, string> = {
  'il': '/il-Descartes/app',
  'row': '/row-Descartes/app',
  'na': '/Descartes/app',
}

export function changeDescartesEnvOnPath(compiledPath: string, newEnv: WazeDescartesEnvironment) {
  const currentDescartesBase = getWazeWindow().W.Config.api_base;
  const isLinkedToCurrentDescartes = compiledPath.startsWith(currentDescartesBase);
  if (isLinkedToCurrentDescartes)
    compiledPath = compiledPath.substring(currentDescartesBase.length);

  return WazeDescartesBasePaths[newEnv] + compiledPath;
}
