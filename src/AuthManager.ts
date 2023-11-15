import { ApiClient } from './ApiClient';
import { AuthSession } from './AuthSession';
import { JwtToken, RegisteredClaims } from './JwtToken';
import {
  deleteScriptStorageValue,
  getScriptStorageValue,
  setScriptStorageValue
} from './utils/script-storage';
import { getWazeWindow } from './utils/window';

export class AuthManager {
  private _accessToken: JwtToken<RegisteredClaims & { username: string; rank: number }>;
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

  get isUnauthenticated() {
    return !this._accessToken || !this._accessToken.isActive;
  }

  async authenticate() {
    const session = await AuthSession._authenticate(this._apiClient, this._userscriptId);
    if (!session.isAuthenticated) throw new Error('Unable to authenticate');
    this._accessToken = new JwtToken(session.accessToken);
    this._saveAccessTokenInStorage();
  }

  async _authenticateIfNecessary() {
    if (!this.isUnauthenticated && !this.isObsoleteSession) return;
    await this.authenticate();
  }

  logout() {
    deleteScriptStorageValue(AuthManager._ACCESS_TOKEN_STORAGE_KEY);
    this._accessToken = null;
  }

  get accessToken() {
    return this._accessToken;
  }

  get isObsoleteSession() {
    const { sub, username, rank } = this.accessToken.payload;
    if (!sub || !username || !rank) return true;
    const loggedInUser = getWazeWindow().W.loginManager.user;
    return loggedInUser.getID() !== sub
      || loggedInUser.getUsername() !== username
      || loggedInUser.getRank() !== rank;
  }
}
