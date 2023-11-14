import { AuthManager } from './AuthManager';
import * as path from './utils/path';
import { ClientOptions } from './WazeSpaceClient';

export class ApiClient {
  readonly _authManager: AuthManager;

  constructor(private readonly _host: string, clientOptions: Readonly<ClientOptions>) {
    this._authManager = new AuthManager(this, clientOptions.userscriptId);
  }

  private _expandUrl(...paths: string[]) {
    if (!paths.length) return null;
    const appendHost = !paths[0].startsWith('http');
    if (appendHost && !this._host) throw new Error('Host is not defined');
    if (!appendHost) return path.join(...paths);
    return path.join(this._host, ...paths);
  }

  private _prepareBody(body: any) {
    if (!body) return undefined;
    if (typeof body === 'string') return body;
    return JSON.stringify(body);
  }

  private async _ensureSuccessfulResponse(response: Response | null) {
    if (!response) throw new Error('Response is null');
    if (response.status < 200 || response.status > 299)
      throw await response.json();
    return response;
  }

  private _sendRequestWithGrassMonkey(
    method: string,
    url: string,
    data?: any,
  ) {
    if (
      'GM_xmlhttpRequest' in window &&
      typeof window.GM_xmlhttpRequest === 'function'
    ) {
      const request = window.GM_xmlhttpRequest;
      return new Promise<Response>((resolve) => {
        request({
          method,
          url,
          data: this._prepareBody(data),
          onload: (response: XMLHttpRequest) => {
            resolve(new Response(response.responseText, {
              status: response.status,
              statusText: response.statusText,
            }));
          },
        });
        return;
      });
    }

    throw new Error('Unavailable implementation of GM XHR');
  }

  private _sendRequestWithFetch(method: string, url: string, data?: any) {
    return fetch(url, {
      method,
      body: this._prepareBody(data),
    });
  }

  private _setTokenOnURL(url: string) {
    if (!this.accessToken) return url;
    const constructedUrl = new URL(url);
    constructedUrl.searchParams.set('token', this.accessToken);
    return constructedUrl.toString();
  }

  async _sendRequest(
    method: string,
    url: string,
    data?: any,
    allowUnauthorized = false
  ) {
    url = this._expandUrl(url);
    if (!allowUnauthorized) {
      await this._authManager._authenticateIfNecessary();
      url = this._setTokenOnURL(url);
    }

    let response: Response | null = null;
    try {
      response = await this._sendRequestWithGrassMonkey(method, url, data);
    } catch {
      response = await this._sendRequestWithFetch(method, url, data);
    } finally {
      // noinspection ReturnInsideFinallyBlockJS
      return await this._ensureSuccessfulResponse(response);
    }
  }

  _getUrl(...paths: string[]) {
    return new URL(this._expandUrl(this._host, ...paths));
  }

  get accessToken() {
    return this._authManager.accessToken.toString();
  }
}
