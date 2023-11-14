import { HttpAdapter } from './http-adapter';

export class GMAdapter extends HttpAdapter {
  _isAvailable(): boolean {
    return 'GM_xmlhttpRequest' in window &&
      typeof window.GM_xmlhttpRequest === 'function';
  }

  private _createResponse(xhr: XMLHttpRequest): Response {
    return new Response(xhr.responseText, {
      status: xhr.status,
      statusText: xhr.statusText,
    });
  }

  _send(input: Request | URL, init?: RequestInit): Promise<Response> {
    const executeXHR = window['GM_xmlhttpRequest'];
    return new Promise((resolve, reject) => {
      if (input instanceof URL) input = new Request(input, init);

      executeXHR({
        method: input.method,
        url: input.url,
        headers: Object.fromEntries(input.headers.entries()),
        data: input.body,
        redirect: input.redirect,
        fetch: true,
        onabort: () => reject(),
        onerror: (error) => reject(error),
        onload: (xhr: XMLHttpRequest) => resolve(this._createResponse(xhr)),
      });
    });
  }
}
