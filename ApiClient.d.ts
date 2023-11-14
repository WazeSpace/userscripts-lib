export declare class ApiClient {
    private readonly _host;
    private _accessToken;
    constructor(_host: string);
    private _expandUrl;
    private _prepareBody;
    private _ensureSuccessfulResponse;
    private _sendRequestWithGrassMonkey;
    private _sendRequestWithFetch;
    private _setTokenOnURL;
    _sendRequest(method: string, url: string, data?: any): Promise<Response>;
    _getUrl(...paths: string[]): URL;
    private static _getAccessTokenFromMemory;
    get accessToken(): string;
    set accessToken(value: string);
}
