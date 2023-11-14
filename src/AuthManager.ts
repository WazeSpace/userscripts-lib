import { ApiClient } from './ApiClient';
import { AuthSession } from './AuthSession';
import { JwtToken } from './JwtToken';
import {
  deleteScriptStorageValue,
  getScriptStorageValue,
  setScriptStorageValue
} from './utils/script-storage';

export class AuthManager {
  private _accessToken: JwtToken;
  private static _ACCESS_TOKEN_STORAGE_KEY = 'WAZE_SPACE_CLIENT_TOKEN'

  constructor(
    private readonly _apiClient: ApiClient,
    private readonly _userscriptId: string
  ) {
    this._populateAccessTokenFromStorage();
  }

  private _populateAccessTokenFromStorage() {
    const token = getScriptStorageValue(AuthManager._ACCESS_TOKEN_STORAGE_KEY);
    if (!token) return false;
    this._accessToken = new JwtToken(token);
    return true;
  }

  private _saveAccessTokenInStorage() {
    return setScriptStorageValue(
      AuthManager._ACCESS_TOKEN_STORAGE_KEY,
      this._accessToken.toString(),
    );
  }

  private get _isUnauthenticated() {
    return !this._accessToken || !this._accessToken.isActive;
  }

  async _authenticate() {
    const session = await AuthSession._authenticate(this._apiClient, this._userscriptId);
    if (!session.isAuthenticated) throw new Error('Unable to authenticate');
    this._accessToken = new JwtToken(session.accessToken);
    this._saveAccessTokenInStorage();
  }

  async _authenticateIfNecessary() {
    if (!this._isUnauthenticated) return;
    await this._authenticate();
  }

  _logout() {
    deleteScriptStorageValue(AuthManager._ACCESS_TOKEN_STORAGE_KEY);
    this._accessToken = null;
  }

  get accessToken() {
    return this._accessToken;
  }
}
