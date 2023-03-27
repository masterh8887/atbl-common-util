import { JwtObject, JwtHeader, JwtPayload } from "./jwt.object";

/**
 * JWT Helper.
 */
export class JwtHelper {
  public getJwtObject(accessToken: string) {
    const t = accessToken.split(".");
    const header: JwtHeader = JSON.parse(
      this.base64Decode(this.base64UrlToBase64(t[0]))
    );
    const payload: JwtPayload = JSON.parse(
      this.base64Decode(this.base64UrlToBase64(t[1]))
    );
    return new JwtObject(header, payload);
  }

  private base64UrlToBase64(base64url: string) {
    return base64url.replace(/\-/g, "+").replace(/_/g, "/");
  }

  private base64Decode(base64: string) {
    return Buffer.from(base64, "base64").toString("utf8");
  }
}
