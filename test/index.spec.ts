import * as crypto from "crypto";
import { JwtHelper } from "../src/jwt.helper";
import {
  JwtPayload,
  IPermissionMenu,
  TokenType,
  JwtHeader,
} from "../src/jwt.object";

const timeout = 1;
describe("JWT Helper/Object Test", () => {
  describe("[관리자/MANAGER] JWT Test", () => {
    const jwtHelper = new JwtHelper();
    const hedaer = getJwtHeader();
    const payload: JwtPayload = {
      iss: "test",
      exp: String(Date.now() + timeout * 60 * 1000),
      seq: 1,
      id: "test123",
      n: "관리자테스트",
      t: TokenType.MANAGER,
      timeout,
      ip: "123.123.211.211",
      e: "test@test.com",
      mp: JSON.stringify({
        artwork: 2,
        buy: 2,
        contents: 2,
        design: 1,
        promotion: 2,
        rental: 2,
        setting: 1,
        stats: 0,
        user: 1,
      } as IPermissionMenu),
      nn: "관리자 별명",
    };
    const token = createToken(hedaer, payload);
    const jwt = jwtHelper.getJwtObject(token);

    it("header 검증", () => {
      expect(jwt.getJwtHeader()).toBeDefined();
    });
    it("payload 검증", () => {
      expect(jwt.getPayload()).toBeDefined();
    });
    it("만료기간 검증", () => {
      expect(jwt.isExpired()).toBeFalsy();
    });
    it("고유번호 검증", () => {
      expect(jwt.getSeq()).toBe(payload.seq);
    });
    it("이름 검증", () => {
      expect(jwt.getName()).toBe(payload.n);
    });
    it("이름 검증", () => {
      expect(jwt.getNickName()).toBe(payload.nn);
    });
    it("이메일 검증", () => {
      expect(jwt.getEmail()).toBe(payload.e);
    });
    it("토큰 유형 검증", () => {
      expect(jwt.getType()).toBe(payload.t);
    });
    it("IP 검증", () => {
      expect(jwt.getIp()).toBe(payload.ip);
    });
    it("메뉴별 권한 검증", () => {
      expect(jwt.getMenuPermissions()?.artwork).toBe(2);
      expect(jwt.getMenuPermissions()?.buy).toBe(2);
      expect(jwt.getMenuPermissions()?.contents).toBe(2);
      expect(jwt.getMenuPermissions()?.design).toBe(1);
      expect(jwt.getMenuPermissions()?.promotion).toBe(2);
      expect(jwt.getMenuPermissions()?.rental).toBe(2);
      expect(jwt.getMenuPermissions()?.setting).toBe(1);
      expect(jwt.getMenuPermissions()?.stats).toBe(0);
      expect(jwt.getMenuPermissions()?.user).toBe(1);
    });
  });

  describe("[회원/USER] JWT Test", () => {
    const jwtHelper = new JwtHelper();
    const hedaer = getJwtHeader();
    const payload: JwtPayload = {
      iss: "test",
      exp: String(Date.now() + timeout * 60 * 1000),
      seq: 2,
      id: "test1234",
      n: "회원테스트",
      t: TokenType.USER,
      timeout,
      ip: "111.113.233.444",
      e: "user@user.com",
    };
    const token = createToken(hedaer, payload);
    const jwt = jwtHelper.getJwtObject(token);

    it("header 검증", () => {
      expect(jwt.getJwtHeader()).toBeDefined();
    });
    it("payload 검증", () => {
      expect(jwt.getPayload()).toBeDefined();
    });
    it("만료기간 검증", () => {
      expect(jwt.isExpired()).toBeFalsy();
    });
    it("고유번호 검증", () => {
      expect(jwt.getSeq()).toBe(payload.seq);
    });
    it("이름 검증", () => {
      expect(jwt.getName()).toBe(payload.n);
    });
    it("이메일 검증", () => {
      expect(jwt.getEmail()).toBe(payload.e);
    });
    it("토큰 유형 검증", () => {
      expect(jwt.getType()).toBe(payload.t);
    });
    it("IP 검증", () => {
      expect(jwt.getIp()).toBe(payload.ip);
    });
    it("메뉴별 권한 검증", () => {
      expect(jwt.getMenuPermissions()).toBeUndefined();
    });
  });
});

function createToken(header: JwtHeader, payload: JwtPayload) {
  const h = base64ToBase64Url(base64Encode(JSON.stringify(header)));
  const p = base64ToBase64Url(base64Encode(JSON.stringify(payload)));
  const s = base64ToBase64Url(
    crypto
      .createHmac("sha256", "1234567890123456")
      .update(`${h}.${p}`)
      .digest("base64")
  );
  return `${h}.${p}.${s}`;
}

function base64ToBase64Url(base64: string) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64Encode(input: string) {
  return Buffer.from(input).toString("base64");
}

function getJwtHeader(): JwtHeader {
  return {
    alg: "HS256",
    typ: "JWT",
  };
}
