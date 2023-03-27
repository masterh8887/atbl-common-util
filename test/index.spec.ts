import * as crypto from "crypto";
import { AuthTokenUserType, RoleType } from "../src/jwt.object";
import { JwtHelper } from "../src/jwt.helper";

const helper = new JwtHelper();
describe("JWT Helper/Object Test", () => {
  describe("[관리자/MASTER] jwt test", () => {
    const seq: number = 1;
    const name: string = "마스터";
    const email: string = "master@test.com";
    const role: RoleType = RoleType.MASTER;
    const ip = "123.222.222.123";
    const token = createToken(
      getJwtHeader(),
      getJwtPayload(seq, name, email, role, ip, 3600)
    );

    const jwt = helper.getJwtObject(token);
    it("만료기간 검증", () => {
      expect(jwt.isExpired()).toBeFalsy();
    });
    it("만료시간 반환 검증", () => {
      expect(jwt.getExpired()).toBeDefined();
    });

    it("고유번호 검증", () => {
      expect(jwt.getSeq()).toBe(seq);
    });

    it("이름 검증", () => {
      expect(jwt.getName()).toBe(name);
    });

    it("이메일 검증", () => {
      expect(jwt.getLoginEmail()).toBe(email);
    });

    it("권한 검증", () => {
      expect(jwt.getRole()).toBe(role);
    });

    it("사용자 유형 검증", () => {
      expect(jwt.getUserType()).toBe(AuthTokenUserType.ADMIN);
    });

    it("IP 검증", () => {
      expect(jwt.getIp()).toBe(ip);
    });
  });

  describe("[관리자/MANAGER] JWT Test", () => {
    const seq: number = 2;
    const name: string = "매니저";
    const email: string = "manager@test.com";
    const role: RoleType = RoleType.MANAGER;
    const ip = "123.123.211.211";

    const token = createToken(
      getJwtHeader(),
      getJwtPayload(seq, name, email, role, ip, 3600)
    );

    const jwt = helper.getJwtObject(token);

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
      expect(jwt.getSeq()).toBe(seq);
    });

    it("이름 검증", () => {
      expect(jwt.getName()).toBe(name);
    });

    it("이메일 검증", () => {
      expect(jwt.getLoginEmail()).toBe(email);
    });

    it("권한 검증", () => {
      expect(jwt.getRole()).toBe(role);
    });

    it("사용자 유형 검증", () => {
      expect(jwt.getUserType()).toBe(AuthTokenUserType.ADMIN);
    });

    it("IP 검증", () => {
      expect(jwt.getIp()).toBe(ip);
    });
  });

  describe("[회원/USER] jwt test", () => {
    const seq: number = 1;
    const name: string = "사용자";
    const email: string = "user@test.com";
    const role: RoleType = RoleType.USER;
    const ip = "123.123.123.123";

    const token = createToken(
      getJwtHeader(),
      getJwtPayload(seq, name, email, role, ip, 3600)
    );

    const jwt = helper.getJwtObject(token);

    it("만료기간 검증", () => {
      expect(jwt.isExpired()).toBeFalsy();
    });

    it("고유번호 검증", () => {
      expect(jwt.getSeq()).toBe(seq);
    });

    it("이름 검증", () => {
      expect(jwt.getName()).toBe(name);
    });

    it("이메일 검증", () => {
      expect(jwt.getLoginEmail()).toBe(email);
    });

    it("이메일 검증", () => {
      expect(jwt.getLoginEmail()).toBe(email);
    });

    it("권한 검증", () => {
      expect(jwt.getRole()).toBe(role);
    });

    it("사용자 유형 검증", () => {
      expect(jwt.getUserType()).toBe(AuthTokenUserType.USER);
    });

    it("IP 검증", () => {
      expect(jwt.getIp()).toBe(ip);
    });
  });
});

function createToken(header: any, payload: any) {
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

function getJwtHeader() {
  return {
    alg: "HS256",
    typ: "JWT",
  };
}

/**
 * JWT Payload를 가져온다.
 * @param s 운영자/회원 번호
 * @param n 운영자/회원 이름
 * @param e 로그인아이디(이메일)
 * @param r 권한
 * @param ip 요청 IP
 * @param timeout 토큰유효시간 (초)
 */
function getJwtPayload(
  s: number,
  n: string,
  e: string,
  r: RoleType,
  ip: string,
  timeout: number
) {
  return {
    iss: "test",
    exp: String(Date.now() + timeout * 60 * 1000),
    e,
    n,
    r,
    s: String(s),
    ip,
  };
}
