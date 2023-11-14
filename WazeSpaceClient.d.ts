import { CloudStorage } from './CloudStorage';
export interface ClientOptions {
    host?: string;
    userscriptId: string;
}
export declare class WazeSpaceClient {
    static readonly VERSION: string;
    private readonly _apiClient;
    private readonly _options;
    private readonly _cloudStorage;
    constructor(options: Readonly<ClientOptions>);
    private static _validateOptions;
    private _sendAuthInitRequest;
    private _sendCompleteAuthRequest;
    authenticate(): Promise<void>;
    get accessToken(): string;
    get cloudStorage(): CloudStorage;
}
