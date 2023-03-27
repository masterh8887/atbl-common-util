/** 토큰유형 */
export enum TokenType {
  MANAGER = "m",
  AUTHOR = "a",
  USER = "u",
}

export interface JwtHeader {
  alg: string;
  typ: string;
}

export interface IPermissionMenu {
  /** 아트워크 메뉴 권한 */
  artwork?: number;
  /** 렌탈 메뉴 권한 */
  rental?: number;
  /** 구매 메뉴 권한 */
  buy?: number;
  /** 사용자 메뉴 권한 */
  user?: number;
  /** 디자인 메뉴 권한 */
  design?: number;
  /** 컨텐츠 메뉴 권한 */
  contents?: number;
  /** 프로모션 메뉴 권한 */
  promotion?: number;
  /** 통계 메뉴 권한 */
  stats?: number;
  /** 설정 메뉴 권한 */
  setting?: number;
}

/**
 * JWT Payload.
 * @param iss 생성
 * @param exp  토큰 만료시간 (unix time 포맷)
 * @param seq  고유번호 (managerSeq, authorSeq, userSeq)
 * @param id  로그인아이디
 * @param t  토큰유형 (manager:관리자, author:작가, user:회원)
 * @param n  이름
 * @param ip  접속 IP 주소
 * @param timeout 토큰유효시간 (초)
 * @param nn  닉네임
 * @param e  이메일
 * @param mp  메뉴별 권한(관리자)
 * @param aclList  ip접근 허용 리스트(관리자))
 */
export interface JwtPayload {
  iss: string;
  exp: string;
  seq: number;
  id: string;
  t: string;
  n: string;
  ip: string;
  timeout: number;
  nn?: string;
  e?: string;
  mp?: string;
  aclList?: string;
}

export class JwtObject {
  constructor(
    private readonly header: JwtHeader,
    private readonly payload: JwtPayload
  ) {}

  public getJwtHeader(): JwtHeader {
    return this.header;
  }

  public getPayload(): JwtPayload {
    return this.payload;
  }

  /**
   * 억세스토큰 만료시간을 반환한다.
   * @returns 억세스토큰 만료시간
   */
  public getExpired(): number {
    return Number(this.payload.exp);
  }

  /**
   * 억세스토큰이 만료 되었는지 여부를 반환한다.
   * @param {number} [time=0] 초
   * @returns true / false
   */
  public isExpired(time: number = 0): boolean {
    return Number(this.payload.exp) < Date.now() - time * 1000;
  }

  /**
   * 회원/관리자/작가 고유번호를 반환한다.
   * @returns 고유번호
   */
  public getSeq(): number {
    return this.payload.seq;
  }

  /**
   * ID를 반환한다.
   * @returns ID
   */
  public getId(): string {
    return this.payload.id;
  }

  /**
   * 운영자/사용자의 이름을 반환한다.
   * @returns 이름
   */
  public getName(): string {
    return this.payload.n;
  }

  /**
   * 이메일을 반환한다.
   * @returns 이메일
   */
  public getEmail(): string {
    return this.payload.e ?? "";
  }

  /**
   * 토큰유형(관리자/회원/작가)을 반환한다.
   * @returns 토큰유형
   */
  public getType(): TokenType {
    return this.payload.t as TokenType;
  }

  /**
   * 메뉴별 권한을 반환한다. (관리자)
   * @returns 메뉴별 권한
   */
  public getMenuPermissions(): IPermissionMenu | undefined {
    if (this.getType() === TokenType.MANAGER) {
      return JSON.parse(this.payload.mp!) as IPermissionMenu;
    }
    return undefined;
  }

  /**
   * 접속 ip 허용리스트 반환한다. (관리자)
   * @returns 접속 ip 허용리스트
   */
  public getAclList(): string[] | undefined {
    return this.payload.aclList ? this.payload.aclList.split(",") : undefined;
  }

  /**
   * IP 주소를 반환한다.
   * @returns IP 주소
   */
  public getIp(): string {
    return this.payload.ip;
  }
}
