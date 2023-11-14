import * as URL from 'url';
import { HttpAdapter } from './http-adapter';

export class FetchAdapter extends HttpAdapter {
  _isAvailable(): boolean {
    return 'fetch' in window;
  }

  _send(input: Request | URL, init?: RequestInit): Promise<Response> {
    return fetch(input, init);
  }
}
