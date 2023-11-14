import { getCookieValue } from './cookie';
import { getWazeWindow } from './window';

export async function sendUpdateRequestComment(updateRequestId: number, text: string) {
  const csrfToken = getCookieValue('_csrf_token');
  const response = await fetch(getWazeWindow().W.Config.paths.updateRequestComments, {
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
