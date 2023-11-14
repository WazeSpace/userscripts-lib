import * as path from './utils/path';
import { ApiClient } from './ApiClient';

export class CloudStorage {
  private static readonly _BASE_URL = '/cloud-storage/';
  constructor(private readonly _apiClient: ApiClient) {}

  private _expandUrl(...paths: string[]) {
    return path.join(CloudStorage._BASE_URL, ...paths);
  }

  async getKeys(): Promise<string[] | null> {
    const response = await this._apiClient._sendRequest(
      'GET',
      CloudStorage._BASE_URL,
    );
    return await response.json();
  }

  async getItem(key: string): Promise<string> {
    const response = await this._apiClient._sendRequest(
      'GET',
      this._expandUrl(key),
    );
    return await response.text();
  }

  async setItem(key: string, value: string) {
    await this._apiClient._sendRequest('PUT', this._expandUrl(key), value);
  }

  async removeItem(key: string) {
    await this._apiClient._sendRequest('DELETE', this._expandUrl(key));
  }

  async removeAllItems() {
    await this._apiClient._sendRequest('DELETE', CloudStorage._BASE_URL);
  }
}
