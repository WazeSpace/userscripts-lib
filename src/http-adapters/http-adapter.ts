export abstract class HttpAdapter {
  abstract _isAvailable(): boolean;
  abstract _send(input: Request | URL, init?: RequestInit): Promise<Response>;
}
