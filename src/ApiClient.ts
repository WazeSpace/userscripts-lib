import { AuthManager } from './AuthManager';
import { HttpAdapter } from './http-adapters/http-adapter';
import * as path from './utils/path';
import { getWazeWindow } from './utils/window';
import { ClientOptions } from './WazeSpaceClient';

export class ApiClient {
  readonly _authManager: AuthManager;
  private _adapter: HttpAdapter;

  constructor(private readonly _host: string, clientOptions: Readonly<ClientOptions>) {
    this._authManager = new AuthManager(this, clientOptions.userscriptId);
    this._adapter = clientOptions.adapters.find((adapter) => adapter._isAvailable());
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

    const response = await this._adapter._send(
      new URL(url, getWazeWindow().location.toString()),
      {
        method,
        body: data,
      }
    );
    return await this._ensureSuccessfulResponse(response);
  }

  _getUrl(...paths: string[]) {
    return new URL(this._expandUrl(this._host, ...paths));
  }

  get accessToken() {
    return this._authManager.accessToken.toString();
  }
}
