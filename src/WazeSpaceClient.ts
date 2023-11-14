import { ApiClient } from './ApiClient';
import { CloudStorage } from './CloudStorage';
import { sendUpdateRequestComment } from './utils/wme-update-requests';

export interface ClientOptions {
  host?: string;
  userscriptId: string;
}

const defaultClientOptions: Partial<ClientOptions> = {
  host: 'https://us.waze.space',
};

export class WazeSpaceClient {
  static readonly VERSION = process.env.VERSION;

  private readonly _apiClient: ApiClient;
  private readonly _options: Readonly<Required<ClientOptions>>;
  private readonly _cloudStorage: CloudStorage;

  constructor(options: Readonly<ClientOptions>) {
    this._options = {
      ...defaultClientOptions,
      ...options,
    } as Readonly<Required<ClientOptions>>;
    WazeSpaceClient._validateOptions(this._options);

    this._apiClient = new ApiClient(this._options.host);
    this._cloudStorage = new CloudStorage(this._apiClient);
  }

  private static _validateOptions(options: Readonly<ClientOptions>) {
    if (!options.userscriptId) throw new Error('UserScript ID is required');
  }

  private async _sendAuthInitRequest() {
    const url = this._apiClient._getUrl('/auth/init');
    url.searchParams.set('script', this._options.userscriptId);
    const response = await this._apiClient._sendRequest('GET', url.toString());
    return await response.json();
  }

  private async _sendCompleteAuthRequest(sessionKey: string, commentId: number) {
    const url = this._apiClient._getUrl(`/auth/${sessionKey}`);
    url.searchParams.set('cid', commentId.toString());
    const response = await this._apiClient._sendRequest('PUT', url.toString());
    return await response.json();
  }

  async authenticate() {
    const initData = await this._sendAuthInitRequest();
    const valueToSend = `\x02${initData.sessionKey}\x04`;
    const { id: commentId } = await sendUpdateRequestComment(initData.target.id, valueToSend);
    const authenticatedSessionResponse = await this._sendCompleteAuthRequest(
      initData.sessionKey,
      commentId,
    );
    this._apiClient.accessToken = authenticatedSessionResponse.token;
  }

  get accessToken() {
    return this._apiClient.accessToken;
  }

  get cloudStorage() {
    return this._cloudStorage;
  }
}
