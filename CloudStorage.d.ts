import { ApiClient } from './ApiClient';
export declare class CloudStorage {
    private readonly _apiClient;
    private static readonly _BASE_URL;
    constructor(_apiClient: ApiClient);
    private _expandUrl;
    getKeys(): Promise<string[] | null>;
    getItem(key: string): Promise<string>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    removeAllItems(): Promise<void>;
}
