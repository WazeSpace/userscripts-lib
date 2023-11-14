export interface RegisteredClaims {
  iss?: string;
  sub?: string | number;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
}

export class JwtToken<P extends RegisteredClaims = RegisteredClaims, H = any> {
  private readonly _header: H;
  private readonly _payload: P;
  private readonly _signature: string;

  constructor(token: string) {
    this._header = JwtToken._extractHeaderFromToken(token);
    this._payload = JwtToken._extractPayloadFromToken(token);
    this._signature = JwtToken._extractSignatureFromToken(token);
  }

  get isExpired(): boolean {
    if (!this._payload.exp) return false;
    return Date.now() / 1000 > this._payload.exp;
  }

  get isActive(): boolean {
    if (this.isExpired) return false;
    if (!this._payload.nbf) return true;
    return Date.now() / 1000 > this._payload.nbf;
  }

  private static _getTokenSegment(token: string, segmentIndex: number) {
    return token.split('.')[segmentIndex];
  }

  private static _decodeBase64Segment(segment: string) {
    return JSON.parse(atob(segment));
  }

  private static _decodeTokenSegment(token: string, segmentIndex: number) {
    return this._decodeBase64Segment(this._getTokenSegment(token, segmentIndex));
  }

  private static _extractHeaderFromToken(token: string) {
    return this._decodeTokenSegment(token, 0);
  }

  private static _extractPayloadFromToken(token: string) {
    return this._decodeTokenSegment(token, 1);
  }

  private static _extractSignatureFromToken(token: string): string {
    return this._getTokenSegment(token, 2);
  }

  private static _encodeSegment<T>(segment: T): string {
    let encoded = btoa(JSON.stringify(segment));
    while (encoded.endsWith('='))
      encoded = encoded.substring(0, encoded.length - 1);
    return encoded;
  }

  toString() {
    const headerEncoded = JwtToken._encodeSegment(this._header);
    const payloadEncoded = JwtToken._encodeSegment(this._payload);
    return `${headerEncoded}.${payloadEncoded}.${this._signature}`;
  }

  get payload() {
    return this._payload;
  }
}
