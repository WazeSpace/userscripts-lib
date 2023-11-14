import { ApiClient } from './ApiClient';
import { CloudStorage } from './CloudStorage';

export interface ClientOptions {
  host?: string;
  userscriptId: string;
}

const defaultClientOptions: Partial<ClientOptions> = {
  host: 'https://us.waze.space',
};

export class WazeSpaceClient {
  // noinspection JSUnusedGlobalSymbols
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

    this._apiClient = new ApiClient(this._options.host, this._options);
    this._cloudStorage = new CloudStorage(this._apiClient);
  }

  private static _validateOptions(options: Readonly<ClientOptions>) {
    if (!options.userscriptId) throw new Error('UserScript ID is required');
  }

  // noinspection JSUnusedGlobalSymbols
  async authenticate() {
    await this._apiClient._authManager._authenticateIfNecessary();
  }

  // noinspection JSUnusedGlobalSymbols
  get cloudStorage() {
    return this._cloudStorage;
  }
}
