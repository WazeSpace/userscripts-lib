import { getCookieValue } from './cookie';
import { getWazeWindow } from './window';
import { changeDescartesEnvOnPath, WazeDescartesEnvironment } from './wme-descrates';

export async function sendUpdateRequestComment(updateRequestId: number, text: string, environment?: WazeDescartesEnvironment) {
  const csrfToken = getCookieValue('_csrf_token');
  let sendToPath = getWazeWindow().W.Config.paths.updateRequestComments;
  if (environment) sendToPath = changeDescartesEnvOnPath(sendToPath, environment);
  const response = await fetch(sendToPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRF-Token': csrfToken,
    },
    body: new URLSearchParams({
      mapUpdateRequestID: updateRequestId.toString(),
      text: text,
    }),
  });
  const jsonResponse = await response.json();
  return jsonResponse.comment;
}
