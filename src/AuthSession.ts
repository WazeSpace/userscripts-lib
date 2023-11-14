import { ApiClient } from './ApiClient';
import { WazeDescartesEnvironment } from './utils/wme-descrates';
import { sendUpdateRequestComment } from './utils/wme-update-requests';

export class AuthSession {
  private _sessionPayload: string;
  private _targetEnv: WazeDescartesEnvironment = 'il';
  private _targetType: 'updateRequest' | string;
  private _targetId: number;
  private _sentOnId: number;
  private _accessToken: string;

  constructor(
    private readonly _apiClient: ApiClient,
    private readonly _userscriptId: string,
  ) {}

  private async _initAuthSession() {
    const url = this._apiClient._getUrl('/auth/init');
    url.searchParams.set('script', this._userscriptId);
    const response = await this._apiClient._sendRequest('GET', url.toString(), null, true);
    const { target, sessionKey } = await response.json();
    if (target.env) this._targetEnv = target.env;
    this._targetType = target.type;
    this._targetId = target.id;
    this._sessionPayload = sessionKey;
  }

  private _encodeSessionPayload() {
    return `\x02${this._sessionPayload}\x04`;
  }

  private async _sendToTarget(): Promise<void> {
    const payload = this._encodeSessionPayload();

    if (this._targetType === 'updateRequest') {
      const { id: commentId } = await sendUpdateRequestComment(
        this._targetId,
        payload,
        this._targetEnv
      );
      this._sentOnId = commentId;
      return;
    }

    throw new Error('Unsupported target type: ' + this._targetType);
  }

  private async _completeAuthSession() {
    const url = this._apiClient._getUrl(`/auth/${this._sessionPayload}`);
    url.searchParams.set('cid', this._sentOnId.toString());
    const response = await this._apiClient._sendRequest('PUT', url.toString(), null, true);
    const { token } = await response.json();
    this._accessToken = token;
  }

  get isAuthenticated() {
    return Boolean(this._accessToken);
  }

  get accessToken() {
    return this._accessToken;
  }

  static async _authenticate(apiClient: ApiClient, userscriptId: string) {
    const session = new AuthSession(apiClient, userscriptId);
    await session._initAuthSession();
    await session._sendToTarget();
    await session._completeAuthSession();
    return session;
  }
}
