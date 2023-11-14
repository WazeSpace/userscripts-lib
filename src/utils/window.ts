type WazeWindow = Window & { W: any };
export function getWazeWindow(): WazeWindow {
  if ('unsafeWindow' in window) return window.unsafeWindow as WazeWindow;
  return window as any as WazeWindow;
}
