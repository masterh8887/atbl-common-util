import * as crypto from "crypto";
import { JwtObject, IJwtHeader, IJwtPayload } from "./jwt.object";

export interface ILog {
  log(message: any): void;
  error(message: any): void;
  warn(message: any): void;
  debug(message: any): void;
}

/**
 * JWT Helper.
 */
export class JwtHelper {
  private readonly secretKey: string;
  private readonly logger: ILog;

  constructor(logger?: ILog) {
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = {
        log: (message) => console.log(message),
        error: (message) => console.error(message),
        warn: (message) => console.warn(message),
        debug: (message) => console.debug(message),
      };
    }
    this.secretKey === process.env.JWT_SECRET_KEY ?? "test0123456789";
    if (
      process.env.NODE_ENV === "production" &&
      this.secretKey === "test0123456789"
    ) {
      throw new Error("환경변수 [JWT_SECRET_KEY]가 설정되지 않았습니다.");
    }
  }

  public getJwtObject(accessToken: string) {
    const t = accessToken.split(".");
    const header: IJwtHeader = JSON.parse(
      this.base64Decode(this.base64UrlToBase64(t[0]))
    );
    const payload: IJwtPayload = JSON.parse(
      this.base64Decode(this.base64UrlToBase64(t[1]))
    );
    return new JwtObject(header, payload);
  }

  public getJwtHeader(): IJwtHeader {
    return {
      alg: "HS256",
      typ: "JWT",
    };
  }

  public getJwtPayload(params: IJwtPayload): IJwtPayload {
    return {
      iss: params.iss,
      exp: params.exp,
      seq: params.seq,
      id: params.id,
      n: params.n,
      nn: params.nn,
      e: params.e,
      t: params.t,
      ip: params.ip,
      timeout: params.timeout,
      mp: params.mp,
      aclList: params.aclList,
    };
  }

  public createToken(header: IJwtHeader, payload: IJwtPayload) {
    const h = this.base64ToBase64Url(this.base64Encode(JSON.stringify(header)));
    const p = this.base64ToBase64Url(
      this.base64Encode(JSON.stringify(payload))
    );
    const s = this.base64ToBase64Url(
      crypto
        .createHmac("sha256", "0123456789")
        .update(`${h}.${p}`)
        .digest("base64")
    );
    return `${h}.${p}.${s}`;
  }

  public validateToken(token: string) {
    try {
      const [header, payload, signature] = token.split(".");
      const s = this.base64ToBase64Url(
        crypto
          .createHmac("sha256", this.secretKey)
          .update(`${header}.${payload}`)
          .digest("base64")
      );
      return signature === s;
    } catch (error) {
      this.logger.warn("토큰의 서명값이 유효하지 않습니다.");
      return false;
    }
  }

  private base64ToBase64Url(base64: string) {
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }

  private base64Encode(input: string) {
    return Buffer.from(input).toString("base64");
  }

  private base64UrlToBase64(base64url: string) {
    return base64url.replace(/\-/g, "+").replace(/_/g, "/");
  }

  private base64Decode(base64: string) {
    return Buffer.from(base64, "base64").toString("utf8");
  }
}
